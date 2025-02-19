import { useContext, useEffect, useState } from "react"
import axios from 'axios'
import { UserContext } from "../../context/UserContext";
import { useNavigate } from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'
import { socket } from "../../socket";
import './Rooms.css'
import EditRoomDialog from "../EditRoomDialog";
import { toast } from 'react-hot-toast';

function Rooms() {

  const { setMessages } = useContext(UserContext)

  const [rooms, setRooms] = useState([])
  const [members, setMembers] = useState({})
  const [admins, setAdmins] = useState({});
  const [roomName, setRoomName] = useState('')
  const [users, setUsers] = useState([])

  const { setActiveRoom, activeRoom } = useContext(UserContext)

  const navigate = useNavigate()

  // Open Dialog
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };



  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (users.length < 1) {
          const response = await axios.get('/users')
          setUsers(response.data)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchUsers()
  }, [users.length])

  async function fetchRooms() {
    try {
      const response = await axios.get("/rooms");
      setRooms(response.data);
    } catch (error) {
      console.log("Error fetching rooms:", error);
    }
  }

  useEffect(() => {
    fetchRooms();
  }, []);


  useEffect(() => {
    async function fetchMembers() {
      if (rooms.length === 0) return;

      let memberData = {};
      let adminData = {};

      for (const room of rooms) {
        let roomMembers = [];

        for (const memberId of room.members) {
          try {
            const response = await axios.get(`/users/${memberId}`);
            roomMembers.push(response.data.username);
          } catch (error) {
            console.log(`Error fetching member ${memberId}:`, error);
            roomMembers.push("Unknown");
          }
        }

        memberData[room.name] = roomMembers;

        // Fetch admin name
        if (!adminData[room.admin]) {
          try {
            const adminRes = await axios.get(`/users/${room.admin}`);
            adminData[room.admin] = adminRes.data.username;
          } catch (error) {
            console.log(`Error fetching admin ${room.admin}:`, error);
            adminData[room.admin] = "Unknown";
          }
        }
      }

      setMembers(memberData);
      setAdmins(adminData);
    }

    fetchMembers();
  }, [rooms]);


  const createRoom = async (e) => {
    e.preventDefault()

    const {data} = await axios.post('/rooms/create', { name: roomName })

    if (data.error) {
      toast.error(data.error)
      return
    }

    toast.success('Room successfully created!')
    setTimeout(() => {
      window.location.reload()
    }, 1000);

  }

  const joinRoom = async (roomName) => {
    setActiveRoom(roomName)

    setMessages([])

    // Join chat room
    socket.emit('joinRoom', roomName)

    navigate('/')
  }


  return (
    <div className="rooms">

      <div className="rooms-add">
        <h3 className="rooms-subtitle">ADD ROOM</h3>
        <form onSubmit={(e) => createRoom(e)} className="rooms-form">
          <input 
            type="text" 
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <button type="submit" className="rooms-button">Add room</button>
        </form>
      </div>


      <div className="rooms-list">
        { 
          rooms.map((room) => (
            <div key={room.id} className="rooms-item">
              {
                room.name === activeRoom ? (

                  <button 
                    className="rooms-join-button active"
                    disabled
                  >{ room.name }</button>

                ) : (

                  <button 
                    onClick={() => joinRoom(room.name)} 
                    className="rooms-join-button" 
                  >{ room.name }</button>

                )
              }


              { room.name === activeRoom &&
                <>
                  <button onClick={handleClickOpen}><FaEdit /></button>
                  <EditRoomDialog 
                    open={open} 
                    setOpen={setOpen}
                    admin={ admins[room.admin] }
                    members={ members[room.name] }
                    setRooms={ setRooms }
                    users={ users }
                    fetchRooms={fetchRooms}
                  />
                </>
              }
              
            </div>
          ))
        }
      </div>

    </div>
  )
}

export default Rooms