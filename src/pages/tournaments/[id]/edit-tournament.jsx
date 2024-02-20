import { Button, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, TextField } from "@mui/material"
import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import styled from "styled-components"
import PrivateRoute from "../../../common/privateRoute"
import Header from "../../../components/header"
import { generateTimeOptions } from "../../../utils"

const defaultInfo = {
    name: "",
    start_date: "",
    reg_end_date: "",
    type: "",
    photo: {},
}

const CreateTournaments = () => {
    const router = useRouter()
    const [tourInfo, setTourInfo] = useState(defaultInfo)
    const [errors, setErrors] = useState(defaultInfo)
    const [loading, setLoading] = useState(false)
    const [preview,setPreview] = useState(null)
    const [selectedTime, setSelectedTime] = useState('');

    const utcToMain = (_val) => {
        const inputDate = new Date(_val);

        const day = String(inputDate.getUTCDate()).padStart(2, '0');
        const month = String(inputDate.getUTCMonth() + 1).padStart(2, '0');
        const year = inputDate.getUTCFullYear();

        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate
    }

    useEffect(() => {
        if (localStorage) {
            const data = JSON.parse(localStorage.getItem(`tournament-${router.query.id}`))
            if (data) {
                let photo = `${process.env.NEXT_PUBLIC_S3_BASE_URL}tournament/${data?.photo}_sm`
                const payload = {
                    name: data?.name,
                    start_date: utcToMain(data?.start_date),
                    reg_end_date: utcToMain(data?.registration_end_date),
                    type: data?.type.toLowerCase(),
                    photo: photo,
                }
                setSelectedTime(data?.start_time)
                setTourInfo(payload)
            }
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const data = new FormData();
            data.append("name", tourInfo?.name);
            data.append("photo", tourInfo?.photo);
            data.append("start_date", tourInfo?.start_date);
            data.append("reg_end_date", tourInfo?.reg_end_date);
            data.append("type", tourInfo?.type);
            data.append("start_time",selectedTime)

            const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/tournaments/api/updateTournaments/${router.query.id}`, data, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            if (res.status === 202) {
                setErrors(defaultInfo)
                router.push(`/tournaments/${router.query.id}`)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }
    const handleTimeChange = (event) => {
        setSelectedTime(event.target.value);
    };

    return (
        <>
            <Header title="Edit Tournament" hasNotificationIcon={false}  />
            <Wrapper>
                <Container>
                    <Form variant="standard">
                        <label style={{ cursor: "pointer" }}>
                            <ImgBox>
                                <img width={90} height={90} src={preview || tourInfo?.photo} />
                                <img
                                    style={{
                                        position: "absolute",
                                        bottom: "15px",
                                        right: "20px"
                                    }}
                                    src="/images/upload.png"
                                />
                            </ImgBox>
                            <input
                                name="photo"
                                id="file-input"
                                type="file"
                                hidden
                                onChange={(e) => {
                                    setTourInfo({ ...tourInfo, [e.target.name]: e.target.files[0] })
                                    setPreview(URL.createObjectURL(e.target.files[0]))
                                }}
                            />
                        </label>
                        <TextField
                            onChange={(e) => setTourInfo({ ...tourInfo, [e.target.name]: e.target.value })}
                            error={errors?.name ? true : false}
                            id="outlined-basic"
                            label="Tournament name"
                            variant="outlined"
                            helperText={errors?.name}
                            name="name"
                            // required
                            fullWidth
                            autoFocus
                            value={tourInfo?.name}
                        />
                        <TextField
                            value={tourInfo?.start_date}
                            onChange={(e) => setTourInfo({ ...tourInfo, [e.target.name]: e.target.value })}
                            error={errors?.start_date ? true : false}
                            id="outlined-basic"
                            label="Start date (DD/MM/YY)"
                            variant="outlined"
                            helperText={errors?.start_date}
                            name="start_date"
                            type="date"
                            InputLabelProps={{
                                shrink: true
                            }}
                            // required
                            fullWidth
                        />
                        <TextField
                            select
                            label="Select Time"
                            value={selectedTime}
                            onChange={handleTimeChange}
                            variant="outlined"
                            fullWidth
                            defaultValue={selectedTime}
                        >
                            {generateTimeOptions().map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            value={tourInfo?.reg_end_date}
                            onChange={(e) => setTourInfo({ ...tourInfo, [e.target.name]: e.target.value })}
                            error={errors?.reg_end_date ? true : false}
                            id="outlined-basic"
                            label="Registration end date"
                            variant="outlined"
                            helperText={errors?.reg_end_date}
                            name="reg_end_date"
                            required
                            type="date"
                            InputLabelProps={{
                                shrink: true
                            }}
                            fullWidth
                        />
                        <div style={{
                            display: "flex",
                            width: "100%",
                            flexDirection: "column",
                            alignItems: "flex-start"
                        }}>
                            <FormLabel id="demo-row-radio-buttons-group-label">Choose tournament type</FormLabel>
                            <RadioGroup
                                value={tourInfo?.type}
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="type"
                                onChange={(e) => setTourInfo({ ...tourInfo, [e.target.name]: e.target.value })}
                            >
                                <FormControlLabel value="public" control={<Radio />} label="Public" />
                                <FormControlLabel value="private" control={<Radio />} label="Private" />
                            </RadioGroup>
                        </div>
                        <Button
                            onClick={handleSubmit}
                            fullWidth
                            size="large"
                            variant="contained"
                            disabled={loading}
                        >
                            Save
                        </Button>
                    </Form>
                </Container>
            </Wrapper>
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
`
const Container = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 0px 16px;
`

const ImgBox = styled.div`
    width: 130px;
    height: 130px;
    border-radius: 50%;
    border: 1px solid #E2E2E2;
    background: #FFF;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.50);
    z-index: 10;
    object-fit: none;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
    position: relative;
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2.3rem;
    align-items: center;
    margin: 37px 0px;
    width: 100%;
    // z-index: -1;
`

export default PrivateRoute(CreateTournaments)