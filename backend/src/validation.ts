import * as z from 'zod'


export const EntryPosition = z.int().positive()
export const EntryContent = z.string().min(1).max(1000)
export const EntryChecked = z.boolean()

export const Entry = z.object({
  id: z.int().positive(),
  position: EntryPosition,
  content: EntryContent,
  checked: EntryChecked,
})

export const Entries = z.array(Entry)

export const NewEntry = z.object({
  content: EntryContent,
})

export const EntryUpdate = z.object({
  position: EntryPosition.exactOptional(),
  content: EntryContent.exactOptional(),
  checked: EntryChecked.exactOptional(),
})

export const EntryId = z.coerce.number().int()

export const EntryIds = z.object({
  ids: z.array(z.int().positive()).min(1),
})

export const LoginPassword = z.object({
  password: z.string().min(5).max(50),
})

export const LoginToken = z.object({
  token: z.jwt(),
})
