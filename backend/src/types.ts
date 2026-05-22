import { Entry } from '../generated/prisma/client.ts'


export type EntryUpdate = Partial<Omit<Entry, 'id'>>
