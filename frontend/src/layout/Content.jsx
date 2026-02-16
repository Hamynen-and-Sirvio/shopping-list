import EntryItem from "../components/EntryItem"
import "../App.css"

const Content = ({ entries, editMode, reloadEntries }) => {
  return (
    <div className="content">
      <div className="content-header">
        <h1 className="title">
          <a href="/" className="title-link">
            Shopping list
          </a>
        </h1>
      </div>
      <div className="content-list">
        {entries.map((entry) => (
          <EntryItem
            key={entry.id}
            entry={entry}
            entriesLength={entries.length}
            editMode={editMode}
            reloadEntries={reloadEntries}
          />
        ))}
      </div>
    </div>
  )
}

export default Content
