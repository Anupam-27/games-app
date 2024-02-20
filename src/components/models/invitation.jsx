import { Box, Modal, Typography } from "@mui/material"
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import socket from "../../../socket";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 290,
    maxWidth: 375,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2,
    pb: 0,
    borderRadius: "7px"
};

const InvitationModel = (props) => {
    const [tourDetails, setTourDetails] = useState()
    const getTourDetals = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/tournaments/api/getTournament/${props.modelData.tourId}`, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            if (res.status === 200 && res.data.status === 200) {
                setTourDetails(res.data.data)
            }
        } catch (err) {
            console.error(err)
        }
    }
    useEffect(() => {
        getTourDetals()
    }, [])

    const handleAcceptEvent = () => {
        socket.emit("invite_accepted", { user_id: socket.userID, tour_id: tourDetails?.id })
        props.setOpen(false)
    }
    return (
        <Modal
            open={props.open}
            onClose={() => props.setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontSize: "16px", fontWeight: "700" }}>
                    You have been added to a tournnament
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2, color: '#878787', fontSize: "15px" }}>
                    {tourDetails?.name}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2, fontSize: "14px" }}>
                    Would you like to accept?
                </Typography>
                <BtnWrapper>
                    <OptionBtn onClick={handleAcceptEvent} color="#54D17B">
                        <span><img src="/images/right.svg" /></span>
                        <span>Accept</span>
                    </OptionBtn>
                    <Divider>|</Divider>
                    <OptionBtn onClick={() => props.setOpen(false)} color="#DC6562">
                        <span><img src="/images/cross.svg" /></span>
                        <span>Reject</span>
                    </OptionBtn>
                </BtnWrapper>
            </Box>
        </Modal>
    )
}

const BtnWrapper = styled.div`
    border-top: 1px solid #E4E4E4;
    display: flex;
    align-items: center;
    justify-content: space-around;
`
const OptionBtn = styled.div`
    padding: 10px 15px 15px 36px;
    span{
        color: ${({ color }) => color};
        margin-left: 2px;
        font-weight: 700;
    }
    cursor: pointer;
`
const Divider = styled.span`
    width: 2px;
    height: 44px;
    color: #E4E4E4;
`

export default InvitationModel