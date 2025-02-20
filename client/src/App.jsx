import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import axios from 'axios'
import { UserContextProvider } from './context/UserContext'
import Navbar from './components/Navbar/Navbar'
import Profile from './pages/Profile/Profile'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './ProtectedRoute'

axios.defaults.baseURL = import.meta.env.VITE_API_URL
axios.defaults.withCredentials = true

function App() {

  return (
    <UserContextProvider>
      <Navbar />

      <Toaster 
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 2000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />

      <Routes>
        <Route path='/' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />

        <Route path='/profile' element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </UserContextProvider>
  )
}

export default App
