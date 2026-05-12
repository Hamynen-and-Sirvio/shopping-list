import { useState } from 'react'
import userService from '../../services/userService'
import tokenService from '../../services/tokenService'
import './Login.css'

const Login = ({ setToken }) => {
  const [passwordField, setPasswordField] = useState('')

  const logIn = async (event) => {
    event.preventDefault()
    try {
      const response = await userService.login(passwordField)
      tokenService.setToken(response.token)
      setToken(response.token)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={logIn} className="login-form">
        <div className="login-title">Login</div>

        <input
          type="password"
          placeholder="Password"
          minLength="5"
          maxLength="50"
          value={passwordField}
          onChange={(e) => setPasswordField(e.target.value)}
          className="login-input"
        />

        <button type="submit" className="login-button">
          Enter
        </button>
      </form>
    </div>
  )
}

export default Login
