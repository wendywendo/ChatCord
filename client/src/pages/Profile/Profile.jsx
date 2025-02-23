import { useState } from 'react'
import './Profile.css'
import { useAuth } from '../../context/UserContext'
import axios from 'axios'
import toast from 'react-hot-toast'

function Profile() {

    const { user } = useAuth()
    const [file, setFile] = useState(null)

    const apiUrl = import.meta.env.VITE_API_URL

    const handleUpload = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append("profilePic", file)
        formData.append("userId", user._id)

        try {
            const {data} = await axios.post(`/upload-profile-pic`, formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            })

            if (data.error) {
                return toast.error(data.error)
            }
            toast.success('File uploaded successfully!')
            setTimeout(() => {
                window.location.reload()
            }, 2000);

        } catch {
            toast.error("File upload failed!")
        }
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]

        const maxSize = 16 * 1024 * 1024 // 16MB
        if (selectedFile.size > maxSize) {
            toast.error("File exceeds 16MB")
            setFile(null)
        } else {
            setFile(selectedFile)
        }

    }

  return (
    <div className="profile-page">

        {
            user && (
                <div className="card">
                    <h1 className='profile-title'>PROFILE</h1>

                    <img 
                        src={ `${apiUrl}/profile-pic/${user.username}` } 
                        alt={ user.username }
                        className='profile-pic'
                    />
                    <h1>{ user.username }</h1>
                    <p className="profile-email">{ user.email }</p>

                    <form onSubmit={(e) => handleUpload(e)}>
                        <input 
                            type="file" 
                            onChange={(e) => handleFileChange(e)}
                            required
                        />
                        <p><button type='submit'>Upload Profile</button></p>
                    </form>
                </div>
            )
        }

    </div>
  )
}

export default Profile