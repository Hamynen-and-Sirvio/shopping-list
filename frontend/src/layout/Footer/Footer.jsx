import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import './Footer.css'

const Footer = ({ entryService }) => {
  const [newEntryField, setNewEntryField] = useState('')

  const queryClient = useQueryClient()

  const addEntryMutation = useMutation({
    mutationFn: (content) => entryService.addEntry(content),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['entries'],
      })

      setNewEntryField('')
    },
  })

  const addEntry = (event) => {
    event.preventDefault()
    if (newEntryField.trim() === '') return
    addEntryMutation.mutate(newEntryField.trim())
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
