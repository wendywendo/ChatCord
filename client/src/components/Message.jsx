import { useContext } from "react"
import { UserContext } from "../context/UserContext"

// eslint-disable-next-line react/prop-types
function Message({ from, message }) {

    const { user, BACKEND_URL } = useContext(UserContext)

  return (
    <div className={ `message ${ user.username !== from ? "" : "user" }` }>
        <div className="avatar">
          <img
              src= { `${BACKEND_URL}/profile-pic/${from}` } 
              alt={ from }
          /> 
          <span className="tooltip">{ from }</span>
        </div>
        <p className="message-content">{ message }</p>
    </div>
  )
}

export default Message