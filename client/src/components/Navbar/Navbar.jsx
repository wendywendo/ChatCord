import axios from "axios";
import { Link } from "react-router-dom";
import './Navbar.css'
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import toast from 'react-hot-toast';

export default function Navbar() {

    const handleLogout = async () => {
        await axios.post('/logout').then(() => {
            toast.success('Logged out successfully!')
            setTimeout(() => {
              window.location.href = '/login'
            }, 2000);
        })
    }

    const { user } = useContext(UserContext)

  return (
    <nav className="chat-app">
        <div className="chat-header">
          <div className="appname">
            <div className="user-avatar">
              <img src="/send.png?height=40&width=40" alt="Avatar" />
            </div>
            <h1>ChatCord</h1>
          </div>

          <div className="links">
            {
              user ? (
                <>
                  <Link to='/'>Home</Link>
                  <Link to='/profile'>Profile</Link>
                  <button onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <>
                  <Link to='/login'>Login</Link>
                  <Link to='/signup'>SignUp</Link>
                </>
              )
            }
    
          </div>
        </div>

    </nav>
  )
}
