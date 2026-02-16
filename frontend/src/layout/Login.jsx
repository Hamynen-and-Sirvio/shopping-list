import { useState } from "react"
import "../App.css"

const Login = ({ reloadEntries, setToken }) => {
  const [passwordField, setPasswordField] = useState("")

  const logIn = async (event) => {
    event.preventDefault()
    const response = await fetch(`/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: passwordField }),
    })
    const loginData = await response.json()
    localStorage.setItem("token", loginData.token)
    setToken(loginData.token)
    await reloadEntries()
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
