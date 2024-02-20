import Header from "../../../components/header"
import styled from "styled-components"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import PrivateRoute from "../../../common/privateRoute"
import socket from "../../../../socket"

const CreateDraws = () => {
    const router = useRouter()
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUsers] = useState([])
    const [searchText, setValue] = useState("")

    const fetchUsers = async () => {
        try {
            const tourDate = JSON.parse(localStorage.getItem(`tournament-${router.query.id}`))
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/api/get_users_list?type=player&date=${tourDate?.start_date}`, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            if (res.status === 200 && res.data.status === 200) {
                setUsers(res.data.data)
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if(localStorage)
        fetchUsers()
    }, [router.isReady])

    useEffect(() => {
        const handlePlayerListUpdate = ({user_id}) => {
            // Handle the "player_list_update" event
            const filteredData = users.filter((_val) => _val?.id != user_id)
            setUsers(filteredData)
        };

        socket.on("player_list_update", handlePlayerListUpdate);

        // Clean up the event listener when the component unmounts
        return () => {
            socket.off("player_list_update", handlePlayerListUpdate);
        };
    }, [])

    const handleAddPlayer = (id) => {
        let data = []
        if (selectedUser.includes(id)) {
            data = selectedUser.filter((_val) => _val != id)
        } else {
            data = [...selectedUser, id]
        }
        setSelectedUsers(data)
    }

    const debouncedSetSearchTerm = useMemo(() => {
        const delay = 50; // Adjust the delay as needed
        let timeoutId;

        return (value) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => setValue(value), delay);
        };
    }, []);

    // Memoize the filtered data
    const filteredData = useMemo(() => {
        return users.filter(item => item.fullname.toLowerCase().includes(searchText));
    }, [users, searchText]);


    const UserCard = ({ data }) => {
        const { id, fullname, age, gender, photo } = data
        // const user_image = photo ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}profile/${photo}_sm` : "/images/profile.svg"

        return (
            <CardWrapper>
                <Image>
                    {
                        photo ?
                            <img width={50} height={50} src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}profile/${photo}_sm`} />
                            :
                            <img width={30} height={30} src="/images/profile.svg" />
                    }
                </Image>
                <Details>
                    <UName>{fullname}</UName>
                    <ul>
                        <li>{age}</li>
                        <li>{gender}</li>
                    </ul>
                </Details>
                <AddIcon onClick={() => handleAddPlayer(data.id)}><img src={`/images/${selectedUser.includes(id) ? "minus.svg" : "plus.svg"}`} /></AddIcon>
            </CardWrapper>
        )
    }

    const handleCreateDraws = async () => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/tournaments/api/createDraws/${router.query.id}`, { userIds: selectedUser }, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            if (res.status === 200 && res.data.status === 200) {
                // setUsers(res.data.data)
            }
        } catch (err) {
            console.error(err)
        }
    }
    return (
        <>
            <Header title="Create draws" hasNotificationIcon={false} />
            <Upper>
                <Wrapper>
                    <Container>
                        <SearchContainer>
                            <Icon><img width={16} height={16} src="/images/search.svg" /></Icon>
                            <Input>
                                <input value={searchText} onChange={(e) => debouncedSetSearchTerm(e.target.value)} placeholder="Search players to add" type="text" />
                            </Input>
                        </SearchContainer>
                        <UserList>
                            {
                                filteredData.map((_val) => {
                                    return <UserCard key={_val.id} data={_val} />
                                })
                            }
                        </UserList>
                    </Container>
                    <Button onClick={handleCreateDraws}>Generate draws</Button>
                </Wrapper>
            </Upper>
        </>
    )
}

const Upper = styled.div`
background: #F4F4F4;

`

const Wrapper = styled.div`
max-width: 375px;
margin: 0 auto;
text-align: center;
height: 90vh;
font-family: "Nunito", "sans-serif";
position: relative;
background:white;
`

const Container = styled.div`
margin:8px;
display: flex;
justify-content: center;
flex-direction: column;
padding: 0px 16px;  
`

const SearchContainer = styled.div`
    margin: 21px 0px;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 10px 12px;
    border-radius: 3px;
    border: 1px solid #DEDEDE;
    background: #FFF;
`

const Icon = styled.div`

`

const Input = styled.div`
    display: flex;
    width: 100%;
    input{
        border: none;
        width: 90%;
        // padding: 10px;
        &:focus-visible{
            outline: none;
        }
        font-size: 14px;
        &:placeholder{
            opacity: 0.5;
            font-size: 14px;
        }
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
const UserList = styled.div`
    margin-bottom: 60px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`

const CardWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 15px;
    gap: 1rem;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.20);
    border-radius: 6px;
`

const Image = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid #979797;
    display: flex;
    align-items: center;
    justify-content: center;
`

const Details = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 65%;
    gap: 7px;
    ul{
        display: flex;
        gap: 14px;
        li{
            font-size: 12px;
        }
    }
`

const UName = styled.span`
    font-size: 16px;
    font-weight: 700;
`

const AddIcon = styled.span``

export default PrivateRoute(CreateDraws);