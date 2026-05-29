import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import EntryItem from '../../components/EntryItem/EntryItem'
import Modal from '../../components/Modal/Modal'
import Loading from '../../components/Loading/Loading'
import { DragDropProvider } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import './Content.css'

const Content = ({ entryService, entries, isLoading }) => {
  const [openModal, setOpenModal] = useState(false)
  const [currentEntry, setCurrentEntry] = useState(null)

  const queryClient = useQueryClient()

  const moveEntryMutation = useMutation({
    mutationFn: ({ entry, offset }) => entryService.moveEntry(entry, offset),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['entries'],
      })
    },
  })

  const handleDragEnd = (event) => {
    if (event.canceled) return

    const { source } = event.operation

    if (isSortable(source)) {
      const { initialIndex, index } = source

      if (initialIndex !== index) {
        moveEntryMutation.mutate({
          entry: entries[initialIndex],
          offset: index - initialIndex,
        })
      }
    }
  }

  const handleOpenModal = (entry) => {
    setCurrentEntry(entry)
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setCurrentEntry(null)
    setOpenModal(false)
  }

  if (isLoading) return <Loading />

  return (
    <div className="content">
      <div className="content-list">
        <DragDropProvider onDragEnd={handleDragEnd}>
          {entries.map((entry, index) => (
            <EntryItem
              key={entry.id}
              index={index}
              entry={entry}
              entryService={entryService}
              handleOpenModal={handleOpenModal}
            />
          ))}
        </DragDropProvider>
      </div>
      <Modal
        entryService={entryService}
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        entry={currentEntry}
      />
    </div>
  )
}

export default Content
