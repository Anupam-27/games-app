import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import PrivateRoute from "../common/privateRoute";
import Header from "../components/header";


const Dashboard = () => {
    const [value, setValue] = useState(0)

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    return (
        <>
            <Header title="Tournaments" />
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <MuiTabs value={value} onChange={(e, newValue) => setValue(newValue)} aria-label="basic tabs example">
                    <Tab label="Ongoing" {...a11yProps(0)} />
                    <Tab label="Upcoming" {...a11yProps(1)} />
                    <Tab label="Previous" {...a11yProps(2)} />
                </MuiTabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                Item One
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                Item Two
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                Item Three
            </CustomTabPanel>
            <AddIcon><img src="/images/addIcon.svg"/></AddIcon>
        </>
    )
}

const CustomTabPanel = styled.div`
    display: ${(props) => props.value == props.index ? "block" : "none"};
`;

const MuiTabs = styled(Tabs)`
    .MuiTabs-flexContainer{
        justify-content: space-between;
        padding: 0 10px;
    }
    button{
        text-transform: capitalize;
    }
`

const AddIcon = styled.span`
    position: absolute;
    bottom: 20px;
    right: 20px;
`

export default PrivateRoute(Dashboard);