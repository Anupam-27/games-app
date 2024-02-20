import { useRouter } from "next/router"
import { useState } from "react"
import styled from "styled-components"

const Header = ({
    title,
    hasNotificationIcon = true,
    hasBackbtn = true,
    hasMenuIcon = false,
    menuOptions = []
}) => {
    const router = useRouter()
    const [isMenuOpen, setMenuState] = useState(false)

    const handleBackAction = () => {
        const prevRoute = router.asPath.split("/").slice(0, -1).join("/")
        router.push(prevRoute)
    }

    return (
        <Wrapper hasNotificationIcon={hasNotificationIcon}>
            <Container>
                {hasBackbtn && <img onClick={handleBackAction} src="/images/back.svg" />}
                <Heading>{title}</Heading>
                {hasNotificationIcon && <img src="/images/bell.svg" />}
                <MenuWrapper>
                    {hasMenuIcon && <img onClick={() => setMenuState(!isMenuOpen)} src="/images/menu.svg" />}
                    {isMenuOpen && <MenuBox>
                        {menuOptions?.length && menuOptions?.map((_val, idx) => {
                            if (_val.visible)
                                return (
                                    <MenuItems key={_val + idx} onClick={() => _val?.action(() => {
                                        setMenuState(!menuOptions)
                                        handleBackAction()
                                    })
                                    }>
                                        <img src={_val?.icon} />
                                        <span>{_val?.title}</span>
                                    </MenuItems>
                                )
                        })}
                    </MenuBox>}
                </MenuWrapper>

            </Container>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    padding: ${({ hasNotificationIcon }) => hasNotificationIcon ? "10px 22px 5px 22px" : "20px 22px 15px 22px"};
    box-shadow: 0px 1px 4px 0px rgba(134, 134, 134, 0.50);
    position: sticky;
    z-index: 1001;
`
const Container = styled.div`
    display: flex;
    align-items: center;
    font-family: "Nunito", "sans-serif";
`
const Heading = styled.span`
    text-align: center;
    font-size: 18px;
    font-weight: 700;
    flex-basis: 100%;
`
const MenuWrapper = styled.div`
    position: relative;
    img{
        cursor: pointer;
    }
`

const MenuBox = styled.div`
    padding: 9px 11px;
    background: #FFF;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.28);
    position: absolute;
    right: 0px;
    width: 168px;
    z-index: 1000;
`

const MenuItems = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    span{
        font-size: 14px;
        line-height: 37px;
    }
`

export default Header