import { useContext, useEffect, useState } from 'react'
import './Home.css'
import { useNavigate } from 'react-router-dom'
import Chats from '../../components/Chats/Chats'
import Rooms from '../../components/Rooms/Rooms'
import { UserContext } from '../../context/UserContext'
 
function Home() {

    const navigate = useNavigate()
    const { user } = useContext(UserContext)

    const [messages, setMessages] = useState([])

    useEffect(() => {
        if (!user) {
            navigate('/login', { replace: true })
        }
    }, [user])


    return (
        <div className='home'>  
            <div className="rooms">
                <Rooms messages={messages} setMessages={setMessages} />
            </div>
            <div className="chats">
                <Chats setMessages={setMessages} />
            </div>
        </div>
    )
}

export default Home