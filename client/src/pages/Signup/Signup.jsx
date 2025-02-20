import axios from "axios"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import './Signup.css'
import toast from "react-hot-toast"

export default function Signup() {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const registerUser = async (e) => {
        e.preventDefault()

        toast.promise(
            async () => {
                const {data} = await axios.post('/register', { username, email, password })

                if (data.error) {
                    alert(data.error)
                } else {
                    setUsername('')
                    setEmail('')
                    setPassword('')
                    toast.success('Created user successfully')
                    navigate('/login')
                }
            },
            {
                loading: 'Creating user...',
                error: 'Error creating user'
            }
        );

    }

  return (
    <div className="container">
        
        <form onSubmit={(e) => registerUser(e)} className="signup-form">

            <h1 className="form-title">SIGNUP</h1>

            <div className="input-group">
                <label>Username:</label>
                <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div className="input-group">
                <label>Email:</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="input-group">
                <label>Password:</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button type="submit" className="signup-button">Sign Up</button>
            <p className="login-link">Have an account? <Link to="/login">Log In</Link></p>
        </form>
    </div>
  )
}
