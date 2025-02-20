import { useAuth } from "../context/UserContext"

// eslint-disable-next-line react/prop-types
function Message({ from, message }) {

    const { user } = useAuth()
    const apiUrl = import.meta.env.VITE_API_URL
    const imageUrl = `${apiUrl}/profile-pic/${from}`


  return (
    <div className={ `message ${ user.username !== from ? "" : "user" }` }>
        <div className="avatar">
          <img
              src= { imageUrl } 
              alt={ from }
              onError={(e) => (e.target.src = "./profile.png")}
          /> 
          <span className="tooltip">{ from }</span>
        </div>
        <p className="message-content">{ message }</p>
    </div>
  )
}

export default Message