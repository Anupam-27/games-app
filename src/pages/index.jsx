import Link from 'next/link';
import styled from 'styled-components';
import PrivateRoute from '../common/privateRoute'

const Home = () => {
  return (
    <Container>
      <img src={"/images/home_banner.jpg"} />
      <AuthBtnWrapper>
        <BtnLink href={"/login"}><LoginBtn>Login</LoginBtn></BtnLink>
        <BtnLink href={"/signup"}><SignupBtn>Sign up</SignupBtn></BtnLink>
      </AuthBtnWrapper>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 2rem;
  margin:8px;
`;

const AuthBtnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  padding: 20px;
`;

const BtnLink = styled(Link)`
  color: black;
  text-decoration: none;
`

const LoginBtn = styled.span`
  padding: 13px 75px;
  color: white;
  border-radius: 6px;
  background: #5983E3;
  box-shadow: 0px 2px 4px 0px rgba(114, 114, 114, 0.50);
  font-size: 16px;
  font-weight: 700;
`
const SignupBtn = styled.span`
  color: #5983E3;
  text-align: center;
  font-size: 16px;
`

export default PrivateRoute(Home)