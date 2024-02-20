import { FormControl, FormLabel, MenuItem, Select } from "@mui/material"
import axios from "axios"
import Link from "next/link"
import styled from "styled-components"
import PrivateRoute from "../common/privateRoute"
import Header from "../components/header"
import { useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const Profile = () => {
    const [userDetails, setUserDetails] = useState({})
    const [show, setShow] = useState(false)
    const [userInfo, setUserInfo] = useState({ type: "", data: "" })
    const [type, setType] = useState(null);
    const [data, setData] = useState("")
    const [preview,setPreview] = useState(null)

    const profileData = async () => {
        const token = localStorage.getItem("token")

        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/api/profile`, {
            headers: {
                Authorization: token
            }
        })
        if (res && res?.status === 200 && res?.data?.status === 200) {
            setUserDetails(res?.data?.data)
        }
    }

    useEffect(() => {
        if (localStorage) {
            profileData()
        }
    }, [])

    const handleImage = async (e) => {
        try {
            setPreview(URL.createObjectURL(e.target.files[0]))

            const fileSize = e.target.files[0].size / (1024 ** 2)
            const token = localStorage.getItem("token")
            const data = new FormData();
            data.append("image", e.target.files[0]);
            if (fileSize <= 2) {
                const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/users/api/photos`, data, {
                    headers: {
                        Authorization: token
                    }
                })
                profileData()
            }
        } catch (err) {
            console.log("somethinh went wrong", err)
        }
    }

    const handleSaveDetails = async (e) => {
        const payload = { [type]: data }
        const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/users/api/update_profile`, payload, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
        if (res.status === 202) {
            profileData()
            setShow(false)
            setType(null)
            setData("")
        }
    }

    return (
        <>
            <Header title="My profile" hasBackbtn={false}/>
            <ProfileWrapper>
                <ProfileContainer>
                    <BGWrapper />
                    <Details>
                        <Form>
                            <label style={{ cursor: "pointer" }}>
                                <ImgBox>
                                    <img src={preview || `${process.env.NEXT_PUBLIC_S3_BASE_URL}profile/${userDetails?.photo}_sm` || "/images/profile.svg"} />
                                    <img
                                        style={{
                                            position: "absolute",
                                            bottom: "13px",
                                            right: "7px"
                                        }}
                                        src="/images/upload.png"
                                    />
                                </ImgBox>
                                <input
                                    id="file-input"
                                    type="file"
                                    hidden
                                    onChange={handleImage}
                                />
                            </label>
                        </Form>
                        <UserInfo>
                            <h2 style={{ margin: "0px", marginBottom: "8px", fontSize: "20px" }}>{userDetails?.fullname}</h2>
                            <span style={{ fontSize: "14px" }}>{userDetails?.emails?.[0].email}</span>
                        </UserInfo>
                        <DetailList>
                            <div>
                                {userDetails?.emails?.length && <DetailsHead>Emails</DetailsHead>}
                                {
                                    userDetails?.emails?.length && userDetails?.emails.map((_val) => {
                                        return <EmailList>{_val?.email}</EmailList>
                                    })
                                }
                            </div>
                            <div>
                                {userDetails?.phone_numbers && <DetailsHead>Phone Numbers</DetailsHead>}
                                {
                                    userDetails?.phone_numbers ? userDetails?.phone_numbers.map((_val) => {
                                        return <EmailList>{_val?.phone_number}</EmailList>
                                    }) : null
                                }
                            </div>
                        </DetailList>
                        <AddBtn onClick={() => setShow(true)}>Add more details</AddBtn>
                    </Details>
                </ProfileContainer>
                {show && <Dialog open={show} onClose={() => { }}>
                    <DialogTitle>{`${userDetails?.fullname.split(" ")[0]}'s`} emails and phone numbers</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            You can add upto 4 email address and phone numbers to this account.
                        </DialogContentText>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // value={type}
                            label="Select"
                            onChange={(e) => setType(e.target.value)}
                            name="type"
                        >
                            <MenuItem value="" selected disabled>Select option</MenuItem>
                            <MenuItem value="email">Email</MenuItem>
                            <MenuItem value="phone_number">Phone Number</MenuItem>
                        </Select>
                        {type && <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label={type === "email" ? "Email Address" : "Phone Number"}
                            type={type === "email" ? "email" : "tel"}
                            fullWidth
                            variant="standard"
                            name="userInfo"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                        />}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setType(null)
                            setShow(false)
                        }}>Cancel</Button>
                        <Button onClick={handleSaveDetails}>Save</Button>
                    </DialogActions>
                </Dialog>}
            </ProfileWrapper>
        </>
    )
}

const ProfileWrapper = styled.div`
    position: relative;
`
const ProfileContainer = styled.div`
`
const BGWrapper = styled.div`
    position: absolute;
    width: 100%;
    height: 212px;
    border-bottom-left-radius: 22px;
    border-bottom-right-radius: 22px;
    background: #7094E6;
`
const Details = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 110px;
    gap: 3rem;
`
const ImgBox = styled.div`
    width: 150px;
    height: 150px;
    border-radius: 27px;
    border: 1px solid #E2E2E2;
    background: #FFF;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.50);
    z-index: 10;
    object-fit: none;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
    position: relative;
`
const Form = styled(FormControl)`
`
// margin-bottom: 20px;
const UserInfo = styled.div`
    text-align: center;
`
const AddBtn = styled.span`
    color: #5983E3;
    text-align: center;
    font-size: 14px;
    font-weight: 700;
    line-height: normal;
    margin-bottom: 80px;
`
const DetailList = styled.div`
    width: 80%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 2rem;
`
const DetailsHead = styled.span`
    margin-bottom: 20px;
    padding: 6px;
    border-radius: 4px;
    background-color: whitesmoke;
    color: black;
`
const EmailList = styled.div`
    padding: 6px;
    border-radius: 4px;
    background-color: grey;
    color: white;
    margin: 10px 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 300px;
`

export default PrivateRoute(Profile)