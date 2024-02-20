import { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import { useRouter } from "next/router";
import PrivateRoute from '../common/privateRoute';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';

const BASE_URL = "http://localhost:8000"
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

const errorState = { email: "", password: "" }

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setError] = useState({ email: "", password: "" })
    const [isSuccess, setIsSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const isDataValid = (payload) => {
        const errorFields = errors
        let isValidated = true

        if (!emailRegex.test(payload.email)) {
            errorFields.email = "enter a valid email"
            isValidated = false
        } else {
            errorFields.email = ""
        }

        if (!passRegex.test(payload.password)) {
            errorFields.password = "enter a valid password"
            isValidated = false
        } else {
            errorFields.password = ""
        }

        setError(errorFields)
        return isValidated
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const payload = {
                email,
                password
            }
            if (isDataValid(payload)) {
                const res = await axios.post(`${BASE_URL}/users/api/login`, payload)
                if (res.status === 200 && res.data.status === 200) {
                    setEmail("")
                    setPassword("")
                    setError(errorState)
                    localStorage.setItem("token", res.data.data.token)
                    router.push("/tournaments");
                }
            } else {
                setError(errors)
            }
        } catch (err) {
            console.log(err, "hitted")
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await axios.post(`${BASE_URL}/users/api/google_login?google_token=${tokenResponse.access_token}`, {})
                if (res.status === 200){
                    if(res.data.status === 200) {
                        router.push("/tournaments")
                    }
                }else if(res.status === 202){
                    setIsSuccess(true)
                }
            } catch (err) {
                console.error(err)
            }
        },
    });

    return (
        <Container>
            {
                isSuccess ?
                    <>
                        <SuccessBox>
                            <SuccessText>Link Sent</SuccessText>
                            <img height="30" src="/images/verified.png" />
                        </SuccessBox>
                        <p></p>
                    </>
                    :
                    <>
                        <Typography>Login</Typography>
                        <Form variant="standard">
                            <TextField
                                onChange={(e) => setEmail(e.target.value)}
                                error={errors?.email ? true : false}
                                id="outlined-basic"
                                label="Email ID"
                                variant="outlined"
                                helperText={errors.email}
                                // required
                                fullWidth
                                autoFocus
                            />
                            <TextField
                                onChange={(e) => setPassword(e.target.value)}
                                error={errors?.password ? true : false}
                                id="outlined-basic"
                                label="Enter Password"
                                variant="outlined"
                                helperText={errors.password}
                                required
                                fullWidth
                            />
                            {/* <BottomText><Linked href={"/mobileLogin"}>Login</Linked> with phone number!</BottomText> */}
                            <Button
                                onClick={handleSubmit}
                                fullWidth
                                size="large"
                                variant="contained"
                                disabled={loading}
                            >
                                Continue
                            </Button>
                        </Form>
                        <SocialLoginWrapper>
                            <OAuthText>
                                <Divider></Divider>
                                <DividerText>Login with</DividerText>
                                <Divider></Divider>
                            </OAuthText>
                            <OtpLogin>
                                <span><i class="fa-solid fa-phone"></i></span>
                                <Option2Text onClick={() => router.push("/mobileLogin")}>Login with Phone Number</Option2Text>
                            </OtpLogin>
                            <GoogleLogin
                                size="large"
                                width="100%"
                                onSuccess={handleGoogleLogin}
                                shape="rectangular"
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                            />
                        </SocialLoginWrapper>
                        <BottomText>New here? <Linked href={"/signup"}>Signup</Linked></BottomText>
                    </>
            }
        </Container>
    )
}

const Container = styled.div`
    max-width: 375px;
    margin: 0 auto;
    text-align: center;
    height:90vh;
    font-family: "Nunito", "sans-serif";
    position: relative;
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
    margin-bottom: 30px;
`
const BottomText = styled.span`
    position: absolute;
    bottom: 10px;
    text-align: center;
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
// const GoogleLogin = styled.div`
//     padding: 10px 10px;
//     display: flex;
//     border: 1px solid #dadce0;
// `
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
const SuccessBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
`
const SuccessText = styled.h1`
font-family: "Nunito", "sans-serif";
`

export default PrivateRoute(Login)