import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import styled from "styled-components"
import socket from "../../../../../socket"
import PrivateRoute from "../../../../common/privateRoute"
import Header from "../../../../components/header"

const noop = () => { }
const MatchDetails = () => {
    const router = useRouter()
    const [details, setDetails] = useState([])
    const [matchDetails, setMatchDetails] = useState(null)
    const [currentSet, setCurrentSet] = useState(null)
    const [p1Count, setP1Count] = useState(0)
    const [p2Count, setP2Count] = useState(0)
    const [setNumber, setSetNumber] = useState(1)
    const [setResult, setSetResult] = useState(null)
    const [userDetails, setUserDetails] = useState(null)
    const [tour, setTour] = useState(null)

    socket.on("fetch_set_details", () => {
        fetchSetsDetails()
    })
    socket.on("fetchMatch", () => {
        fetchMatchDetails()
    })
    useEffect(() => {
        if (localStorage) {
            const user = JSON.parse(localStorage.getItem("loggedInUser"))
            const curr_tour = JSON.parse(localStorage.getItem(`tournament-${router.query.id}`))
            setUserDetails(user)
            setTour(curr_tour)
        }
        fetchMatchDetails()
        fetchSetsDetails()
    }, [router.isReady])

    useEffect(() => {
        if (details?.length === 3 && details[2]?.status === 2) {
            let id = null, count = 0
            details?.forEach((_val) => {
                if (!id) {
                    id = _val?.id
                    count = 1;
                } else if (_val?.id !== id) {
                    id = _val?.id
                    count--;
                } else {
                    count++;
                }
            })
            const name = matchDetails?.player1?.id === id ? matchDetails?.player1?.fullname : matchDetails?.player2?.fullname
            setSetResult({
                player_id: count === 0 ? null : id,
                result: `${count === 0 ? "Match is draw" : `${name} won the match`}`
            })
        }
    }, [matchDetails, details])

    async function fetchSetsDetails() {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/tournaments/api/getSetDetails/${router.query.matchId}`, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            if (res.status === 200 && res.data.status === 200) {
                const result = res?.data?.data
                let lastMatch = false
                result.forEach((_val, idx) => {
                    if (_val?.status === 1) {
                        const payload = {
                            id: _val.id,
                            set_id: idx + 1,
                            match_id: _val.match_id,
                            result: _val.result,
                            status: _val.status,
                            p1_score: _val?.set_score.split("-")[0],
                            p2_score: _val?.set_score.split("-")[1]
                        }
                        setP1Count(payload?.p1_score)
                        setP2Count(payload?.p2_score)
                        setCurrentSet(payload)
                    }
                    if (_val?.set_number === '3' && _val?.status === 2) {
                        lastMatch = true
                    }
                })
                const length = result.length
                if (!length) {
                    setSetNumber(length + 1)
                } else {
                    if (result[length - 1].status === 2) {
                        setSetNumber(length + 1)
                    } else {
                        setSetNumber(length)
                    }
                }
                // if(result && result.length)
                // if (lastMatch) setSetNumber(4)
                // else if(result?.length > 1) setSetNumber(result.length)
                setDetails(result)

            } else {
                console.log(res)
            }
        } catch (err) {
            console.log(err)
        }
    }

    async function fetchMatchDetails() {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/tournaments/api/fetchMatch/${router?.query?.matchId}`, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            if (res.status === 200 && res.data.status === 200) {
                setMatchDetails(res?.data?.data)
            } else {
                console.log(res)
            }
        } catch (err) {
            console.log(err)
        }
    }
    // useEffect(() => {
    // },[])
    socket.on("broadcast_score", () => {
        console.log("match_id, set_number")
        fetchSetsDetails()
    })
    const handleScore = (id, score) => {
        console.log(router.query.matchId, setNumber, score, "setNumber,setNumber")
        socket.emit("update_score", { match_id: router.query.matchId, set_number: setNumber, score: score })
    }
    const manageScoreOut = (idx, score, setid) => {
        let updatedScore = `${p1Count}-${p2Count}`
        if (idx === 1) {
            setP1Count(parseInt(score) - 1)
            updatedScore = `${p1Count-1}-${p2Count}`
        }
        else {
            setP2Count(parseInt(score) - 1)
            updatedScore = `${p1Count}-${p2Count-1}`
        }
        console.log(updatedScore,"updatedScore12")

        handleScore(setid, updatedScore)
    }
    const manageScoreIn = (idx, score, setid) => {
        let updatedScore = `${p1Count}-${p2Count}`
        if (idx === 1) {
            setP1Count(parseInt(score) + 1)
            updatedScore = `${p1Count+1}-${p2Count}`
        }
        else {
            setP2Count(parseInt(score) + 1)
            updatedScore = `${p1Count}-${p2Count+1}`
        }
        console.log(updatedScore,"updatedScore12")
        handleScore(setid, updatedScore)
    }

    const UserSection = (playerDetails, score, setid, idx) => {
        const photo = playerDetails?.photo ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}profile/${playerDetails?.photo}_sm` : null
        return (
            <UserWrapper>
                <Details>
                    <Name>{playerDetails?.fullname}</Name>
                    <ImgWrapper>
                        <img width={54} height={58} src={photo ? photo : "/images/profile.svg"} />
                    </ImgWrapper>
                </Details>
                {userDetails?.id == tour?.created_by &&
                    <ScoreSection>
                        <Btn
                            onClick={
                                score < 12 ?
                                    () => {
                                        manageScoreIn(idx, score, setid)
                                    }
                                    : noop
                            }
                            color="#54D17B">+</Btn>
                        <Score>{score ? score : 0}</Score>
                        <Btn
                            onClick={
                                score > 0 ?
                                    () => {
                                        manageScoreOut(idx, score, setid)
                                    }
                                    : noop
                            }
                            color="#DC6562">-</Btn>
                    </ScoreSection>
                }
            </UserWrapper>
        )
    }
    const handleStartSet = () => {
        if (currentSet?.status === 1) {
            const winner = p1Count > p2Count ? matchDetails?.player1?.id : p1Count === p2Count ? 0 : matchDetails?.player2?.id
            socket.emit("finish_set", { matchId: router.query.matchId, set_number: setNumber, winner: winner })
            setSetNumber(setNumber + 1)
            setP1Count(0)
            setP2Count(0)
            setCurrentSet(null)
        } else {
            socket.emit("start_set", { matchId: router.query.matchId, set_number: setNumber, tourId: tour.id })
        }

    }
    const handleFinishMatch = () => {
        let winner = null;
        if (details[0].result == details[1].result) {
            winner = details[0].result
        } else if (details[0].result == details[2].result) {
            winner = details[0].result
        } else if (details[1].result == details[2].result) {
            winner = details[1].result
        } else {
            winner = null
        }
        console.log(matchDetails, "matchDetails")
        socket.emit("finish_match", { winner_id: winner, match_id: router.query.matchId, curr_round: matchDetails?.match?.curr_round, total_round: tour.total_rounds, tourId: tour.id })
    }
    return (
        <>
            <Header title="Score Board" hasNotificationIcon={false} />
            <Wrapper>
                <Container>
                    {UserSection(matchDetails?.player1, p1Count, currentSet?.id, 1)}
                    <Hr />
                    {UserSection(matchDetails?.player2, p2Count, currentSet?.id, 2)}
                    <CardMiddle>
                        <span>v/s</span>
                    </CardMiddle>
                    <SetWrapper>
                        {details?.map((_val, idx) => {
                            const s1 = _val?.set_score?.split("-")[0]
                            const s2 = _val?.set_score?.split("-")[1]
                            const status = _val?.status
                            return (
                                <>
                                    <SetDetails key={idx}>
                                        {_val?.result == matchDetails?.player1?.id ? <img style={{ position: "absolute", left: "-25px" }} width={17} height={23} src="/images/medal.svg" /> : null}
                                        <span>{status === 1 ? p1Count : s1}</span>
                                        <span>Set {idx + 1}</span>
                                        <span>{status === 1 ? p2Count : s2}</span>
                                        {_val?.result == matchDetails?.player2?.id ? <img style={{ position: "absolute", right: "-25px" }} width={17} height={23} src="/images/medal.svg" /> : null}
                                    </SetDetails>
                                </>
                            )
                        })}
                        {(userDetails?.id == tour?.created_by && setNumber != 4) && <StartBtn onClick={handleStartSet}><span>{currentSet?.status === 1 ? "Finish" : "Start"} Set {setNumber}</span></StartBtn>}
                    </SetWrapper>
                    {setNumber === 4 && <BtnGroup>
                        <img width={34} height={47} src="/images/medal.svg" />
                        <p>{setResult?.result}</p>
                        {(userDetails?.id == tour?.created_by && !matchDetails?.match?.result) ? <div onClick={handleFinishMatch}>
                            <span>Finish match</span>
                        </div> : null}
                    </BtnGroup>}
                </Container>
            </Wrapper>
        </>
    )
}

const Wrapper = styled.div`
    // height: 100vh;
`
const Container = styled.div`
    display: flex;
    justify-content: space-around;
    height: 100vh;
    position: relative;
`

const UserWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 26px 45px 46px 50px;
`

const Details = styled.div`
    display: flex;
    flex-direction: column;
    align-items:center;
    gap: 30px;
`
const Name = styled.span`
    font-size: 16px;
    font-weight: 700;
`
const ImgWrapper = styled.div`
    border: 1px solid #E2E2E2;
    border-radius: 50%;
    width: 98px;
    height: 98px;
    display: flex;
    align-items:center;
    justify-content: center;
`
const ScoreSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
`
const Btn = styled.span`
    font-size: 26px;
    font-weight: 700;
    color: white;
    padding: 0px 12px;
    background-color: ${({ color }) => color};
    border-radius: 50%;
`
const Score = styled.span`
    font-size: 32px;
    font-weight: 600;
`
const Hr = styled.hr`
    margin: 0;
    width: 2px;
    color: #D8D8D8;
`
const CardMiddle = styled.div`
    position: absolute;
    top: 17%;
    span{
        padding: 10px;
        border-radius: 50%;
        background-color: #EBEBEB;
        font-size: 14px;
    }
`
const SetWrapper = styled.div`
    position: absolute;
    bottom: 45%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
`
const SetDetails = styled.div`
    padding: 7px 22px;
    border-radius: 5px;
    border: 1px solid #979797; 
    background: #FFF;
    width: 170px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    span{
        opacity: 0.5;
        font-size: 12px;
    }
`

const BtnGroup = styled.div`
    position: absolute;
    bottom: 6%;
    width: 267px;
    height: 176px;
    border-radius: 11px;
    border: 1px solid #E3E3E3;
    background: #FFF;
    box-shadow: 0px 3px 14px 0px rgba(0, 0, 0, 0.29);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    p{
        font-size: 16px;
    }
    div{
        border-radius: 6px;
        background: #5983E3;
        box-shadow: 0px 2px 4px 0px rgba(114, 114, 114, 0.50);
        padding: 4px 40px;
        cursor: pointer;    
        span{
            color: #FFF;
            font-size: 14px;
            font-weight: 700;
        }
    }
`

const StartBtn = styled.div`
border-radius: 6px;
background: #5983E3;
box-shadow: 0px 2px 4px 0px rgba(114, 114, 114, 0.50);
padding: 4px 40px;
cursor: pointer;   
padding: 7px 22px; 
width: 170px;
text-align: center;
span{
    color: #FFF;
    font-size: 14px;
    font-weight: 700;
}
`

export default PrivateRoute(MatchDetails)