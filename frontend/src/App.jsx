import { useEffect, useState } from "react"
import Header from "./layout/Header"
import Content from "./layout/Content"
import Footer from "./layout/Footer"
import Login from "./layout/Login"
import "./App.css"

const App = () => {
  const [entries, setEntries] = useState([])
  const [checkedEntries, setCheckedEntries] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [token, setToken] = useState("")

  const reloadEntries = async () => {
    const response = await fetch("/api/entries", {
      headers: { "Authorization": `Bearer ${token}` },
    })
    const fetchedEntries = await response.json()
    setEntries(fetchedEntries)
    setCheckedEntries(
      fetchedEntries.filter((entry) => entry.checked).map((entry) => entry.id),
    )
  }

  useEffect(() => {
    const curToken = localStorage.getItem("token")
    if (curToken) {
      setToken(curToken)
    }
  }, [])

  useEffect(() => {
    if (token) {
      reloadEntries()
    }
  }, [token])

  if (token) {
    return (
      <div className="app-container">
        <Header
          checkedEntries={checkedEntries}
          setCheckedEntries={setCheckedEntries}
          editMode={editMode}
          setEditMode={setEditMode}
          reloadEntries={reloadEntries}
          token={token}
        />
        <Content
          entries={entries}
          editMode={editMode}
          reloadEntries={reloadEntries}
          token={token}
        />
        <Footer reloadEntries={reloadEntries} token={token} />
      </div>
    )
  } else {
    return <Login reloadEntries={reloadEntries} setToken={setToken} />
  }
}

export default App
