import { useState } from "react"
import userService from "../services/userService"
import tokenService from "../services/tokenService"
import "../App.css"

const Login = ({ setToken }) => {
  const [passwordField, setPasswordField] = useState("")

  const logIn = async (event) => {
    event.preventDefault()
    const response = await userService.login(passwordField)
    const loginData = await response.json()
    tokenService.setToken(loginData.token)
    setToken(loginData.token)
  }

  return (
    <div className="login-container">
      <form onSubmit={logIn}>
        <input
          type="password"
          placeholder="Password"
          minLength="5"
          maxLength="50"
          value={passwordField}
          onChange={(event) => setPasswordField(event.target.value)}
          className="password-field"
        />
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
