import { useState } from 'react'
import './Home.css'
import Chats from '../../components/Chats/Chats'
import Rooms from '../../components/Rooms/Rooms'
 
function Home() {

    const [messages, setMessages] = useState([])

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