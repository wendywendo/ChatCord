import { useEffect, useRef, useState } from "react"
import {socket} from "../../socket"
import { useAuth } from "../../context/UserContext"
import axios from "axios"
import Message from "../Message"
import { ThreeDots, TailSpin } from 'react-loader-spinner'
import './Chats.css'

function Chats() {

    const { messages, setMessages, fetchMessages, loadingMessages, activeRoom } = useAuth()
    const [message, setMessage] = useState('')
    const [typing, setTyping] = useState(false)
    const [typingUser, setTypingUser] = useState("")
    const inputRef = useRef(null)
    const messagesEndRef = useRef(null)
    let typingTimeout = useRef(null)

    const apiUrl = import.meta.env.VITE_API_URL


    useEffect(() => {

        if (activeRoom) {
            setMessages([])
            fetchMessages();
        }

    }, [activeRoom])

    useEffect(() => {

        const handleMessage = (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        socket.on("message", handleMessage)

        socket.on("typing", (user) => {
            setTypingUser(user)
            setTyping(true)
            clearTimeout(typingTimeout.current)
            typingTimeout.current = setTimeout(() => setTyping(false), 2000)
        })

        socket.on("stopTyping", () => setTyping(false))

        return () => {
            socket.off("message", handleMessage)
            socket.off("typing")
            socket.off("stopTyping")
        }
    }, [])


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])


    const handleSubmit = async (e) => {
        e.preventDefault()

        socket.emit("chatMessage", message, activeRoom)

        const {data} = await axios.post(`/messages/create`, {
            messageTxt: message,
            roomName: activeRoom
        })

        if (data.error) {
            console.log(data.error)
        }
        setMessage('')

        inputRef.current.focus()
        socket.emit("stopTyping", activeRoom)
        setTypingUser('')
        window.scrollTo(0, document.body.scrollHeight);
    }

  return (
    <>

        <div className="messages-container">

            {
                loadingMessages && (
                    <div className="loading-messages">
                        <TailSpin
                            visible={true}
                            height="80"
                            width="80"
                            color="#4a90e2"
                            ariaLabel="tail-spin-loading"
                            radius="1"
                            wrapperStyle={{}}
                            wrapperClass=""
                        />
                    </div>
                )
            }
            
            { 
                !loadingMessages && messages.map(m => (
                    <>

                        {
                            typeof m === 'object' ? (
                                <Message 
                                    key={m._id}
                                    from={m.from.username}
                                    message={m.message}
                                />
                            ) : (
                                <p>{ m }</p>
                            )
                        }
                    </>
                ))
            }

            {
                !loadingMessages && messages.length < 1 && (
                    <>
                        <p className="no-messages">No messages available. Create one now</p>
                    </>
                )
            }

            {
                typing && (
                    <div className="loading-container">

                        <div className="loading">
                            <ThreeDots
                                visible={true}
                                height="30"
                                width="30"
                                color="#000"
                                radius="9"
                                ariaLabel="three-dots-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                            />
                        </div>

                        <img
                            src={ `${apiUrl}/profile-pic/${typingUser}` }
                            alt={ typingUser }
                        />
                    </div>

                )
            }

            <div ref={messagesEndRef} />

        </div>

        <form className="input-form" onSubmit={(e) => handleSubmit(e)}>
            <input 
                ref={inputRef}
                type="text" 
                placeholder="Type a message..." 
                value={message}
                onChange={(e) => {
                    setMessage(e.target.value)
                    socket.emit("typing", activeRoom)
                }}
            />

            <button type="submit">
                <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            </button>
        </form>
    </>
  )
}

export default Chats