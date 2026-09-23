import { useState } from 'react'
import { LuArrowRight } from 'react-icons/lu'
import './Login.css'

const Login = ({ userService, tokenService, setToken }) => {
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
        <h1 className="login-title">Log in</h1>

        <div className="login-field">
          <label htmlFor="login-password" className="login-label">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            placeholder="Enter password"
            minLength="5"
            maxLength="50"
            value={passwordField}
            onChange={(e) => setPasswordField(e.target.value)}
            className="login-input"
            autoComplete="current-password"
            autoFocus
          />
        </div>

        <button
          type="submit"
          className="login-button"
          disabled={passwordField === ''}
        >
          Log in
          <LuArrowRight size={24} />
        </button>
      </form>
    </div>
  )
}

export default Login
