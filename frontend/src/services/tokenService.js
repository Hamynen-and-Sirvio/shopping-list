const fetchToken = () => {
  return localStorage.getItem("token")
}

const setToken = (token) => {
  localStorage.setItem("token", token)
}

export default { fetchToken, setToken }
