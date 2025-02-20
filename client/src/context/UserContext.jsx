import axios from 'axios'
import { createContext, useEffect, useState } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext()

// eslint-disable-next-line react/prop-types
export function UserContextProvider({ children }) {
    
    const [user, setUser] = useState(null)
    const [activeRoom, setActiveRoom] = useState('')
    const [messages, setMessages] = useState([])
    const [loadingMessages, setLoadingMessages] = useState(false)

    const fetchMessages = async () => {
        setLoadingMessages(true)
        if (!activeRoom) return;

        const {data} = await axios.post('/messages', {
            roomName: activeRoom
        })

        // Check for duplications
        setMessages(prevMessages => {
            const newMessages = data.filter(newMsg => 
                !prevMessages.some(prevMsg => prevMsg._id === newMsg._id)
            );
            return [...prevMessages, ...newMessages];
        });
        setLoadingMessages(false)
    }

    useEffect(() => {
        if (!user) {
            axios.get('/profile').then(({data}) => {
                setUser(data)
            })
        }
    }, [user])

    return (
        <UserContext.Provider value={{ 
                user, 
                setUser, 
                activeRoom, 
                setActiveRoom, 
                messages, 
                setMessages, 
                fetchMessages, 
                loadingMessages
        }}>
            { children }
        </UserContext.Provider>
    )

}