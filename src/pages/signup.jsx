import { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import { useRouter } from "next/router";
import PrivateRoute from '../common/privateRoute';

const BASE_URL = "http://localhost:8000"
const nameRegex = /^([a-zA-Z ]){2,15}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

const errorState = { name: "", email: "", password: "", confirmPass: "" }

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPass, setConfrimPass] = useState("")
    const [errors, setError] = useState({ name: "", email: "", password: "", confirmPass: "" })
    // const [isValidated,setIsValidated] = useState(true)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [isSuccess, setIsSuccess] = useState(false)

    const isDataValid = (payload) => {
        const errorFields = errors
        let isValidated = true
        if (!nameRegex.test(payload.name)) {
            errorFields.name = "enter a valid name"
            isValidated = false
        } else {
            errorFields.name = ""
        }

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

        if (payload.password !== payload.confirmPassword) {
            errorFields.confirmPass = "enter same password"
            isValidated = false
        } else {
            errorFields.confirmPass = ""
        }
        setError(errorFields)
        return isValidated
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const payload = {
                name,
                email,
                password,
                confirmPassword: confirmPass,
                age: "23 Years",
                gender: "Male"
            }
            if (isDataValid(payload)) {
                const res = await axios.post(`${BASE_URL}/users/api/signup`, payload)
                if (res.status === 200 && res.data.status === 200) {
                    setName("");
                    setEmail("")
                    setPassword("")
                    setConfrimPass('')
                    setError(errorState)
                    // router.push("/");
                    setIsSuccess(true)
                }
            } else {
                console.log(errors)
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

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
                        <Typography>Sign up</Typography>
                        <Form variant="standard">
                            <TextField
                                onChange={(e) => setName(e.target.value)}
                                error={errors?.name ? true : false}
                                id="outlined-basic"
                                label="Name"
                                variant="outlined"
                                helperText={errors.name}
                                // required
                                fullWidth
                                autoFocus
                            />
                            <TextField
                                onChange={(e) => setEmail(e.target.value)}
                                error={errors?.email ? true : false}
                                id="outlined-basic"
                                label="Email ID"
                                variant="outlined"
                                helperText={errors.email}
                                // required
                                fullWidth
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
                            <TextField
                                onChange={(e) => setConfrimPass(e.target.value)}
                                error={errors?.confirmPass ? true : false}
                                id="outlined-basic"
                                label="Confirm Password"
                                variant="outlined"
                                helperText={errors.confirmPass}
                                required
                                fullWidth
                            />
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
                        <BottomText>Already have an account? <Linked href={"/login"}>Login</Linked></BottomText>
                    </>
            }
        </Container>
    )
}

const Container = styled.div`
    max-width: 375px;
    margin: 0 auto;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;
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
    width: 100%;
`
const BottomText = styled.span`
`
const Linked = styled(Link)`
    color: #5983E3;
    text-decoration: none;
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

export default PrivateRoute(Signup)