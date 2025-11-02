import { useEffect, useState } from 'react'

const App = () => {
  const [count, setCount] = useState(0)
  const [entries, setEntries] = useState([])

  useEffect(() => {
    (async () => {
      setEntries(await (await fetch('/api/entries')).json())
    })()
  }, [])

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <ul>
        {entries.map(entry =>
          <li key={entry.id}>
            {entry.content}
          </li>
        )}
      </ul>
    </>
  )
}

export default App
