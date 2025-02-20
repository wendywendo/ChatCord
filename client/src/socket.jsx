import { io } from 'socket.io-client'
import Cookies from 'js-cookie'

const SOCKET_URL = import.meta.env.VITE_API_URL

export const socket = io(SOCKET_URL, {
    transports: ["websocket"],
    withCredentials: true,
    auth: {
        token: Cookies.get('token'),
    }
});