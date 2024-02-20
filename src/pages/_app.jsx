import '../styles/globals.css'
// import type { AppProps } from 'next/app'
import Head from 'next/head'
import axios from "axios"
import { GoogleOAuthProvider } from '@react-oauth/google';
import Footer from '../components/footer';
import { useEffect, useState } from 'react';
import socket from "../../socket"
import handleSocketEvents from "../components/socket"
import InvitationModel from '../components/models/invitation';

axios.defaults.withCredentials = true

export default function App({ Component, pageProps }) {
  const [showInviteModel, setShowInviteModel] = useState(false)
  const [modelData, setModelData] = useState(null)
  useEffect(() => {
    const sessionID = localStorage.getItem('token');
    if (sessionID) {
      socket.auth = { sessionID: sessionID.split(" ")[1] };
      socket.connect();

      socket.on('session', ({ sessionID, userID }) => {
        // attach the session ID to the next reconnection attempts
        socket.auth = { sessionID };
        // store it in the localStorage
        // localStorage.setItem('sessionID', sessionID);
        // save the ID of the user
        socket.userID = userID;
      });

      socket.on('connect_error', (err) => {
        console.log(err,"connect_error")
        if (err.message) {
          console.error('Socket connection failed');
        }
      });
      handleSocketEvents({setShowInviteModel,setModelData})
    }
    // return () => {
    //   socket.disconnect();
    // };
  }, [])
  return (
    <>
      <Head>
        <title>TT</title>
        <meta name="description" content="Table Tenis web app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.jpeg" />
        <script src="https://kit.fontawesome.com/3b7d6f831a.js" crossorigin="anonymous"></script>
      </Head>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <Component {...pageProps} />
        <Footer />
        {showInviteModel && <InvitationModel open={showInviteModel} setOpen={setShowInviteModel} modelData={modelData} />}
      </GoogleOAuthProvider>
    </>
  )
}
