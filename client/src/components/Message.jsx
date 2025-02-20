import { useContext } from "react"
import { UserContext } from "../context/UserContext"

// eslint-disable-next-line react/prop-types
function Message({ from, message }) {

    const { user } = useContext(UserContext)
    const apiUrl = import.meta.env.VITE_API_URL

  return (
    <div className={ `message ${ user.username !== from ? "" : "user" }` }>
        <div className="avatar">
          <img
              src= { `${apiUrl}/profile-pic/${from}` } 
              alt={ from }
          /> 
          <span className="tooltip">{ from }</span>
        </div>
        <p className="message-content">{ message }</p>
    </div>
  )
}

export default Message