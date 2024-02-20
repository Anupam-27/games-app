import { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import { useRouter } from "next/router";
import PrivateRoute from '../common/privateRoute';

const BASE_URL = "http://localhost:8000"

const errorState = { phone: "", otp:"" }

const MobileLogin = () => {
    const [phoneNumber, setPhoneNumber] = useState(null)
    const [otp, setOtp] = useState("")
    const [errors, setError] = useState(errorState)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [currentStep,setCurrentStep] = useState("STEP1")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            if(currentStep === "STEP1"){
                const res = await axios.post(`${BASE_URL}/users/api/send_otp`, {"phone_number":phoneNumber})
                if (res.status === 202 && res.data.status === 202) {
                    setError(errorState)
                    localStorage.setItem("phone_number",JSON.stringify(phoneNumber))
                    setCurrentStep("STEP2")
                }else{
                    throw(res.data.message)
                }
            }else if(currentStep === "STEP2"){
                const phone_number = JSON.parse(localStorage.getItem("phone_number")) || phoneNumber
                const res = await axios.post(`${BASE_URL}/users/api/verify_otp`, {"phone_number":phone_number,"otp":otp})
                if (res.status === 202 && res.data.status === 202) {
                    setError(errorState)
                    localStorage.removeItem("phone_number")
                    router.push("/tournaments");
                }else{
                    throw(res.data.message)
                }
            }
        } catch (err) {
            console.log(err, "hitted")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container>
            <Typography>Enter Phone Number</Typography>
            <Form variant="standard">
                {currentStep == "STEP1" && <TextField
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    error={errors?.email ? true : false}
                    id="outlined-basic"
                    label="Phone number"
                    variant="outlined"
                    helperText={errors.phone}
                    required
                    fullWidth
                    autoFocus
                />}
                {currentStep == "STEP2" && <TextField
                    onChange={(e) => setOtp(e.target.value)}
                    error={errors?.password ? true: false}
                    id="outlined-basic"
                    label="OTP"
                    variant="outlined"
                    helperText={errors.otp}
                    required
                    fullWidth
                    autoFocus
                /> }
                <Button
                    onClick={handleSubmit}
                    fullWidth
                    size="large"
                    variant="contained"
                    disabled={loading}
                >
                    {currentStep === "STEP2" ? "Continue": "Send OTP"}
                </Button>
            </Form>
            <SocialLoginWrapper>
                <OAuthText>
                    <Divider></Divider>
                    <DividerText>Login with</DividerText>
                    <Divider></Divider>
                </OAuthText>
                <OtpLogin>
                    <span><i class="fa-solid fa-envelope"></i></span>
                    <Option2Text onClick={() => router.push("/login")}>Login with Email</Option2Text>
                </OtpLogin>
            </SocialLoginWrapper>
            <BottomText>New here? <Linked href={"/signup"}>Signup</Linked></BottomText>
        </Container>
    )
}

const Container = styled.div`
    max-width: 375px;
    margin: 0 auto;
    text-align: center;
    position: relative;
    height:80vh;
    font-family: "Nunito", "sans-serif";
    margin:8px;
`

const Typography = styled.h1`
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    margin-top: 43px;
    margin-bottom: 54px;
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2.3rem;
    align-items: center;
    margin-bottom: 37px;
    justify-content: center;
`
const BottomText = styled.span`
    bottom: 0px;
    text-align:center;
    position: absolute;
`
const Linked = styled(Link)`
    color: #5983E3;
    text-decoration: none;
`

const SocialLoginWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`
const OAuthText = styled.div`
    display: flex;
    align-items: center;
`
const Divider = styled.div`
    border-bottom: 1px solid #e4e6e9;
    flex-grow: 1;
    height: 1px;
`
const DividerText = styled.div`
    font-size: 12px;
    line-height: 20px;
    color: #777;
    padding: 0 1rem;
`
const OtpLogin = styled.div`
    padding: 10px 10px;
    display: flex;
    border: 1px solid #dadce0;
`
const Option2Text = styled.div`
    flex-grow: 1;
    font-size: 13px;
    font-weight: 500;
    color: #3c4043;
`

export default PrivateRoute(MobileLogin)