import axios from "axios";
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import styled from "styled-components"
import Header from "../../../../components/header";

const Matches = () => {
    const router = useRouter()
    const [matches, setMatches] = useState([])

    useEffect(() => {
        if (localStorage)
            fetchMatches()
    }, [router.isReady])

    async function fetchMatches() {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/tournaments/api/getMatches/${router.query.id}`, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            if (res.status === 200 && res.data.status === 200) {
                setMatches(res.data.data)
            } else {
                console.log("something went wrong")
            }
        } catch (err) {
            console.log(err)
        }
    }

    const card = (_val) => {
        let photo = null
        const player1 = _val.player_ids.split("/")[0].split("-")[0]
        const player2 = _val.player_ids.split("/")[1].split("-")[0]
        return (
            <CardWrapper
                key={_val.id}
                onClick={() =>
                    router.push(`/tournaments/${router?.query?.id}/matches/${_val?.id}`)
                }
            >
                <CardText>Round {_val?.curr_round}</CardText>
                <CardContainer>
                    <CardLeft>
                        <ImgWrapper>
                            <img width={26} height={26} src={photo ? photo : "/images/tournaments.svg"} />
                        </ImgWrapper>
                        <Name>{player1}</Name>
                    </CardLeft>
                    <CardMiddle>
                        <span>v/s</span>
                    </CardMiddle>
                    <CardLeft>
                        <ImgWrapper>
                            <img width={26} height={26} src={photo ? photo : "/images/tournaments.svg"} />
                        </ImgWrapper>
                        <Name>{player2}</Name>
                    </CardLeft>
                </CardContainer>
            </CardWrapper>
        )
    }
    return (
        <>
            <Header title="Matches" hasNotificationIcon={false} />
            <Wrapper>
                <Container>
                    {matches?.map((_val) => {
                        if (!_val?.player_ids.includes("Bye"))
                            return card(_val)
                    })}
                </Container>
            </Wrapper>
        </>
    )
}

const Wrapper = styled.div``
const Container = styled.div`
    padding: 21px 16px;
`
const CardWrapper = styled.div`
    display: flex;
    border-radius: 6px;
    background: #FFF;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.20);
    margin-bottom: 20px;
    cursor: pointer;
    align-items: center;
    flex-direction:column;
`
const CardContainer = styled.div`
display: flex;
gap: 10px;
width: 100%;
align-items: center;
justify-content: space-around;
`

const CardText = styled.span`
    padding-top: 4px;
`
const ImgWrapper = styled.div`
    padding: 9px 10px;
    border-radius: 50%;
    border: 1px solid #979797;
    display: flex;
    align-items: center;
`
const CardLeft = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 0px;
    gap:12px;
`
const CardMiddle = styled.div`
    span{
        padding: 10px;
        border-radius: 50%;
        background-color: #EBEBEB;
        font-size: 14px;
    }
`
const Name = styled.span`
    font-size: 14px;
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

export default Matches;