import axios from "axios"
import { useEffect } from "react"
import { useRouter } from "next/router"
import PrivateRoute from "../common/privateRoute"

const VerifyLink = () => {
    const router = useRouter()

    useEffect(() => {
        async function verifyToken(){
            try{
            const { checkID, string } = router.query
            if (checkID && string) {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/api/verify_link?checkID=${checkID}&string=${string}`)
                if(response?.status === 200 && response?.data?.status === 200){
                    localStorage.setItem("token",response.data.data.token)
                    router.push("/tournaments")
                }else{
                    router.push("/login")
                }
            }
        }catch(err){
            console.error(err)
            router.push("/login")
        }
        }
        verifyToken()
    }, [router.query])
    return <div>Verifying...</div>
}

export default VerifyLink