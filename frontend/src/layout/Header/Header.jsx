import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LuTrash } from 'react-icons/lu'
import './Header.css'

const Header = ({ entryService, checkedEntries }) => {
  const queryClient = useQueryClient()

  const deleteEntriesMutation = useMutation({
    mutationFn: (entriesToDelete) =>
      entryService.deleteEntries(entriesToDelete),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['entries'],
      })
    },
  })

  const deleteCheckedEntries = (event) => {
    event.preventDefault()
    if (!confirm(`Delete ${checkedEntries.length} checked entries?`)) {
      return
    }
    deleteEntriesMutation.mutate(checkedEntries)
  }

  return (
    <div className="header">
      <div className="header-title">
        <h1 className="title">
          <a href="/" className="title-link">
            Shopping list
          </a>
        </h1>
      </div>
      <div className="header-buttons">
        <button
          className={`delete-button ${checkedEntries.length === 0 ? 'disabled' : ''}`}
          onClick={deleteCheckedEntries}
          disabled={checkedEntries.length === 0}
        >
          <LuTrash size={18} />
        </button>
      </div>
    </div>
  )
}

export default Header
