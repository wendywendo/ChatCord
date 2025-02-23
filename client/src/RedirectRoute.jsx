import { useAuth } from './context/UserContext'
import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const RedirectRoute = ({ children }) => {

    const { user } = useAuth()

    return user ? <Navigate to='/' /> : children
}

export default RedirectRoute