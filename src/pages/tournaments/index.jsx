import { Box, Tab, Tabs } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import PrivateRoute from "../../common/privateRoute";
import Header from "../../components/header";

const formatDate = (_val) => {
    const inputDate = new Date(_val);

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(inputDate);

    return formattedDate
}

const Tournaments = () => {
    const [value, setValue] = useState(1)
    const [tournaments, setTournaments] = useState({ upcoming: [], ongoing: [], completed: [] })
    const router = useRouter()

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const card = (_val) => {
        let photo = _val?.photo ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}tournament/${_val?.photo}_sm` : null
        console.log(photo,"tour photo")
        return (
            <CardWrapper onClick={() => {
                localStorage.setItem(`tournament-${_val?.id}`, JSON.stringify(_val))
                router.push(`/tournaments/${_val?.id}`)
            }}>
                <CardLeft>
                    <img width={52} height={49} src={photo ? photo : "/images/tournaments.svg"} />
                </CardLeft>
                <CardRight>
                    <Name>{_val?.name}</Name>
                    <SDate><span>Starts on :</span> {formatDate(_val?.start_date)} {_val?.start_time}</SDate>
                    <SDate><span>Time :</span> {_val?.start_time} {_val?.start_time?.split(":")[0] > 12 ? "pm" : "am"}</SDate>
                    <RegEndDate><span>Last date of registration :</span> {formatDate(_val?.registration_end_date)}</RegEndDate>
                </CardRight>
            </CardWrapper>
        )
    }

    const fetchTournaments = async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/tournaments/api/getTournaments`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
        if (res.status === 200 && res.data.status === 200) {
            let data = { upcoming: [], ongoing: [], completed: [] };
            res.data.data.map((_val) => {
                if (_val?.status === "Upcoming") {
                    data.upcoming.push(_val)
                } else if (_val?.status === "Ongoing") {
                    data.ongoing.push(_val)
                } else {
                    data.completed.push(_val)
                }
            })
            setTournaments(data)
        }
    }

    useEffect(() => {
        if (localStorage) {
            fetchTournaments()
        }
    }, [])



    return (
        <>
            <Header title="Tournaments" hasBackbtn={false} />
            <div style={{ minHeight:"100vh",position: "relative" }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <MuiTabs value={value} onChange={(e, newValue) => setValue(newValue)} aria-label="basic tabs example">
                        <Tab label="Ongoing" {...a11yProps(0)} />
                        <Tab label="Upcoming" {...a11yProps(1)} />
                        <Tab label="Completed" {...a11yProps(2)} />
                    </MuiTabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <TabWrapper>
                        {tournaments?.ongoing.map((_val) => {
                            return card(_val)
                        })}
                    </TabWrapper>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <TabWrapper>
                        {tournaments?.upcoming.map((_val) => {
                            return card(_val)
                        })}
                    </TabWrapper>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    <TabWrapper>
                        {tournaments?.completed.map((_val) => {
                            return card(_val)
                        })}
                    </TabWrapper>
                </CustomTabPanel>
                <AddIcon href="/tournaments/create-tournaments"><img src="/images/addIcon.svg" /></AddIcon>
            </div>
        </>
    )
}

const CustomTabPanel = styled.div`
    display: ${(props) => props.value == props.index ? "block" : "none"};
    padding: 21px 16px;
    overflow-y: scroll;
    min-height: 100vh;
`;

const TabWrapper = styled.div`
    margin-bottom: 50px;
    overflow-y: auto;
`

const MuiTabs = styled(Tabs)`
    .MuiTabs-flexContainer{
        justify-content: space-between;
        padding: 0 10px;
    }
    button{
        text-transform: capitalize;
    }
`

const AddIcon = styled(Link)`
    position: absolute;
    bottom: 20%;
    right: 20px;
`

const CardWrapper = styled.div`
    padding: 12px;
    display: flex;
    gap: 10px;
    border-radius: 6px;
    background: #FFF;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.20);
    margin-bottom: 20px;
    cursor: pointer;
`

const CardLeft = styled.div`

`
const CardRight = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`
const Name = styled.span`
    font-size: 16px;
    font-weight: 700;
`
const SDate = styled.span`
    font-size: 12px;
    font-weight: 400;
    span{
        opacity: 0.5;
    }
`
const RegEndDate = styled.span`
    font-size: 12px;
    font-weight: 400;
    span{
        opacity: 0.5;
    }
`

export default PrivateRoute(Tournaments);