import { useState } from "react"
import "../App.css"

const Footer = ({ reloadEntries, token }) => {
  const [newEntryField, setNewEntryField] = useState("")
  const addEntry = async (event) => {
    event.preventDefault()
    if (newEntryField === "") {
      return
    }
    await fetch("/api/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ content: newEntryField }),
    })
    setNewEntryField("")
    reloadEntries()
  }
  return (
    <div className="footer">
      <div className="add-content-container">
        <form onSubmit={addEntry}>
          <input
            value={newEntryField}
            onChange={(event) => setNewEntryField(event.target.value)}
            placeholder="New entry"
          />
          <button type="submit" hidden>
            +
          </button>
        </form>
      </div>
    </div>
  )
}

export default Footer
