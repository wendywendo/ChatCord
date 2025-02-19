import { io } from 'socket.io-client'
import Cookies from 'js-cookie'

const SOCKET_URL = 'https://chatcord-kyyy.onrender.com'

export const socket = io(SOCKET_URL, {
    transports: ["websocket"],
    withCredentials: true,
    auth: {
        token: Cookies.get('token'),
    }
});