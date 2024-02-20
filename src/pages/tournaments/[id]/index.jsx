import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import styled from "styled-components"
import socket from "../../../../socket"
import PrivateRoute from "../../../common/privateRoute"
import Header from "../../../components/header"


const formatDate = (_val) => {
    const inputDate = new Date(_val);

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(inputDate);

    return formattedDate
}

const TournamentDetails = () => {
    const router = useRouter()
    const [tourDetails, setTourDetails] = useState()
    const [userDetails, setUserDetails] = useState({})
    let hasAccess = false
    const getTourDetals = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/tournaments/api/getTournament/${router.query.id}`, {
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
        hasAccess = tourDetails?.created_by == userDetails?.id
    }, [router.isReady])
console.log(tourDetails?.created_by==userDetails?.id,hasAccess,"36"==36,"hasAccess")
    useEffect(() => {
        socket.on("fetchTournament", () => {
            getTourDetals()
        })
    }, [])

    const profileData = async () => {
        const token = localStorage.getItem("token")

        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/api/profile`, {
            headers: {
                Authorization: token
            }
        })
        if (res && res?.status === 200 && res?.data?.status === 200) {
            localStorage.setItem("loggedInUser", JSON.stringify(res?.data?.data))
            setUserDetails(res?.data?.data)
        }
    }

    useEffect(() => {
        if (localStorage) {
            profileData()
        }
    }, [])


    const options = [{
        title: "Delete tournament",
        icon: "/images/deleteIcon.svg",
        isVisible: hasAccess,
        action: async (cb) => {
            try {
                const res = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/tournaments/api/deleteTournaments/${router.query.id}`, {
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                })
                if (res.status === 202) {
                    cb();
                }
            } catch (err) {
                console.error(err)
            }
        }
    }]

    return (
        <>
            <Header title="Tournament details" hasMenuIcon={true} hasNotificationIcon={false} menuOptions={options} />
            <Wrapper>
                <Container>
                    {tourDetails ? <List>
                        <Name>{tourDetails?.name}</Name>
                        <SDate>Status : <span>{tourDetails?.status}</span></SDate>
                        {console.log(tourDetails?.start_date, "tourDetails?.start_date")}
                        <SDate>Starts on : <span>{formatDate(tourDetails?.start_date)}</span></SDate>
                        <SDate>Time : <span>{tourDetails?.start_time} {tourDetails?.start_time?.split(":")[0] >= 12 ? "pm" : "am"}</span></SDate>
                        <RDate>Last date of registration : <span>{formatDate(tourDetails?.registration_end_date)}</span></RDate>
                        <Name>Winner: <span>{tourDetails?.winner}</span></Name>
                    </List> : null}
                </Container>
                {tourDetails?.total_rounds ?
                    <Button onClick={() => router.push(`/tournaments/${tourDetails?.id}/matches`)}>View matches</Button>
                    :
                    (hasAccess ?
                        <Button onClick={() => router.push(`/tournaments/${tourDetails?.id}/create-draw`)}>Create draws</Button>
                        : null)
                }
            </Wrapper>
            {(tourDetails?.status !== "Completed" && hasAccess) ? <AddIcon href={`/tournaments/${router.query.id}/edit-tournament`}><img width={20} height={20} src="/images/edit.svg" /></AddIcon> : null}
        </>
    )
}

const Wrapper = styled.div`
max-width: 375px;
margin: 0 auto;
text-align: center;
height: 90vh;
font-family: "Nunito", "sans-serif";
position: relative;
margin:8px;
`;

const Container = styled.div`
display: flex;
justify-content: center;
flex-direction: column;
padding: 0px 16px;    
`;

const AddIcon = styled(Link)`
    position: absolute;
    bottom: 70px;
    right: 20px;
    background-color: #5983E3;
    padding: 17px;
    border-radius: 50%;
    cursor: pointer;
`
const List = styled.div`
margin-top: 40px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
    justify-content: center;
`

const Name = styled.span`
font-size: 20px;
font-weight: 700;
margin-bottom: 20px;
`

const SDate = styled.span`
color: #878787;
font-size: 14px;
span{
    color: #343435;
}
`
const RDate = styled.span`
color: #878787;
font-size: 14px;
span{
    color: #343435;
}
`

const Button = styled.button`
    position: fixed;
    bottom: 0px;
    width: 100%;
    left: 0px;
    background: #5983E3;
    box-shadow: 0px 2px 4px 0px rgba(114, 114, 114, 0.50);
    border: none;
    padding: 15px;
    font-size: 16px;
    font-weight: 700;
    color: #FFF;
    text-align: center;
`

export default PrivateRoute(TournamentDetails)