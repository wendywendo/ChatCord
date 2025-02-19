import axios from "axios"
import { useState } from "react"
import './Login.css'
import { Link } from "react-router-dom"
import toast from 'react-hot-toast';

export default function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const loginUser = async (e) => {
        e.preventDefault()

        toast.promise(
            async () => {
                const {data} = await axios.post('/login', { email, password })
    
                if (data.error) {
                    toast.error(data.error)
                } else {
                    setEmail('')
                    setPassword('')
                    window.location.href = '/'
                }
            },
            {
                loading: 'Logging in...',
                error: 'Error logging in'
            }
        );

    }

  return (
    <div className="container">
        
        <form onSubmit={(e) => loginUser(e)} className="login-form">

            <h1 className="form-title">LOGIN</h1>

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

            <button type="submit" className="login-button">Log In</button>
            <p className="signup-link">Don&#x27;t have an account? <Link to="/signup">Sign up</Link></p>
        </form>

    </div>
  )
}
