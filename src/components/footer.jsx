import Link from "next/link"
import { useRouter } from "next/router"
import styled from "styled-components"

const Footer = () => {
    const router = useRouter()
    const paths = ["/tournaments", "/profile"]
    return (
        paths.includes(router.pathname) && <Wrapper>
            <Container>
                <FooterIconBox>
                    <Icons src="/images/tournaments.svg" />
                    <Link href="/tournaments"><FooterText>Tournaments</FooterText></Link>
                </FooterIconBox>
                <FooterIconBox>
                    <Icons src="/images/players.svg" />
                    <Link href="/tournaments"><FooterText>Players</FooterText></Link>
                </FooterIconBox>
                <FooterIconBox>
                    <Icons src="/images/profile.svg" />
                    <Link href="/profile"> <FooterText>My profile</FooterText></Link>
                </FooterIconBox>
            </Container>
        </Wrapper>

    )
}

const Wrapper = styled.div`
    padding: 10px 0px 5px 0px;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.41);
    background: white;
    position: fixed;
    bottom: 0;
    width: 100%;
`
const Container = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0px 22px;
`
const FooterIconBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    justify-content: center;
    align-items:center;
`
const FooterText = styled.span`
    color: #ACACAC;
    text-align: center;
    font-size: 10px;
    font-weight: 700;
`
const Icons = styled.img`
`
// width: 24px;
// height: 24px;

export default Footer