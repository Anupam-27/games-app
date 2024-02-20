import { io } from 'socket.io-client';

const URL = process.env.NEXT_PUBLIC_BASE_URL;
const socket = io(URL, { autoConnect: true });

export default socket;