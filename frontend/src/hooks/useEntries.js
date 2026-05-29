import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useServices } from '../contexts/ServiceContext.jsx'

export const useEntries = (token) => {
  const { entryService } = useServices()

  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['entries'],
    queryFn: () => entryService.getEntries(),
    enabled: !!token,
  })

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ['entries'],
    })
  }

  const addEntryMutation = useMutation({
    mutationFn: (content) => entryService.addEntry(content),

    onSuccess: invalidate,
  })

  const editEntryMutation = useMutation({
    mutationFn: ({ entry, content }) => entryService.editEntry(entry, content),

    onSuccess: invalidate,
  })

  const deleteEntriesMutation = useMutation({
    mutationFn: (entries) => entryService.deleteEntries(entries),

    onSuccess: invalidate,
  })

  const checkEntryMutation = useMutation({
    mutationFn: (entry) => entryService.checkEntry(entry),

    onSuccess: invalidate,
  })

  const moveEntryMutation = useMutation({
    mutationFn: ({ entry, offset }) => entryService.moveEntry(entry, offset),

    onSuccess: invalidate,
  })

  return {
    entries: query.data || [],
    isLoading: query.isLoading,
    error: query.error,

    addEntry: (content) => addEntryMutation.mutate(content),

    editEntry: (entry, content) =>
      editEntryMutation.mutate({
        entry,
        content,
      }),

    deleteEntries: (entries) => deleteEntriesMutation.mutate(entries),

    checkEntry: (entry) => checkEntryMutation.mutate(entry),

    moveEntry: (entry, offset) =>
      moveEntryMutation.mutate({
        entry,
        offset,
      }),
  }
}
