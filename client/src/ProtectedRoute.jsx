import { useAuth } from './context/UserContext'
import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {

    const { user } = useAuth()

    return user ? children : <Navigate to='/login' />
}

export default ProtectedRoute