import { Prisma, PrismaClient } from '../generated/prisma/client.ts'

export default class EntryRepository {
  #prismaClient: PrismaClient

  constructor(prismaClient: PrismaClient) {
    this.#prismaClient = prismaClient
  }

  async fetchAll() {
    const fetchedEntries = await this.#prismaClient.entries.findMany({
      orderBy: { position: 'asc' },
    })

    return fetchedEntries
  }

  async create(entry: { content: string }) {
    const addedEntry = await this.#prismaClient.$transaction(
      async (tx) => {
        const entryCount = await tx.entries.count()

        return tx.entries.create({
          data: {
            position: entryCount + 1,
            content: entry.content,
          },
        })
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    )

    return addedEntry
  }

  async delete(id: number) {
    const deletedEntry = await this.#prismaClient.$transaction(
      async (tx) => {
        const deletedEntry = await tx.entries.delete({
          where: {
            id: id,
          },
        })

        await tx.entries.updateMany({
          where: { position: { gt: deletedEntry.position } },
          data: { position: { decrement: 1 } },
        })

        return deletedEntry
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    )

    return deletedEntry
  }

  async update(id: number, editedFields) {
    const editedEntry = await this.#prismaClient.$transaction(
      async (tx) => {
        const oldEntry = await tx.entries.findUnique({ where: { id: id } })
        if (!oldEntry) {
          return null
        }

        if (editedFields.hasOwnProperty('position')) {
          const numOfEntries = await tx.entries.count()
          if (editedFields.position > numOfEntries) {
            throw numOfEntries
          }

          const oldPos = oldEntry.position
          if (editedFields.position > oldPos) {
            await tx.entries.updateMany({
              where: {
                AND: [
                  { position: { gt: oldPos } },
                  { position: { lte: editedFields.position } },
                ],
              },
              data: { position: { decrement: 1 } },
            })
          } else {
            await tx.entries.updateMany({
              where: {
                AND: [
                  { position: { gte: editedFields.position } },
                  { position: { lt: oldPos } },
                ],
              },
              data: { position: { increment: 1 } },
            })
          }
        }

        return tx.entries.update({
          where: { id: id },
          data: editedFields,
        })
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    )

    return editedEntry
  }
}
