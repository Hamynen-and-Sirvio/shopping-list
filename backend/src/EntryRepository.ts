import { Prisma, PrismaClient } from '../generated/prisma/client.ts'
import type { Entry } from '../generated/prisma/client.ts'
import type { EntryUpdate } from './types.ts'
import ArgumentError from './errors/ArgumentError.ts'

export default class EntryRepository {
  #prismaClient: PrismaClient

  constructor(prismaClient: PrismaClient) {
    this.#prismaClient = prismaClient
  }

  async fetchAll() {
    const fetchedEntries = await this.#prismaClient.entry.findMany({
      orderBy: { position: 'asc' },
    })

    return fetchedEntries
  }

  async create(entry: {
    content: string
    quantity: number
    unit: string
    additionalInfo: string
  }) {
    const addedEntry = await this.#prismaClient.$transaction(
      async (tx) => {
        const entryCount = await tx.entry.count()

        return tx.entry.create({
          data: {
            position: entryCount + 1,
            content: entry.content,
            quantity: entry.quantity,
            unit: entry.unit,
            additionalInfo: entry.additionalInfo,
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
        let deletedEntry: Entry

        try {
          deletedEntry = await tx.entry.delete({
            where: {
              id: id,
            },
          })
        } catch (error) {
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025'
          ) {
            return null
          }

          throw error
        }

        await tx.entry.updateMany({
          where: { position: { gt: deletedEntry.position } },
          data: { position: { decrement: 1 } },
        })

        return deletedEntry
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    )

    return deletedEntry
  }

  async deleteMany(ids: number[]) {
    await this.#prismaClient.$transaction(
      async (tx) => {
        await tx.entry.deleteMany({
          where: {
            id: {
              in: ids,
            },
          },
        })

        await tx.$executeRaw`
          WITH ordered AS (
            SELECT
              id,
              ROW_NUMBER() OVER (ORDER BY position) AS new_position
            FROM "Entry"
          )
          UPDATE "Entry"
          SET position = ordered.new_position
          FROM ordered
          WHERE "Entry".id = ordered.id
        `
      }
    )
  }

  async update(id: number, editedFields: EntryUpdate) {
    const editedEntry = await this.#prismaClient.$transaction(
      async (tx) => {
        const oldEntry = await tx.entry.findUnique({ where: { id: id } })
        if (!oldEntry) {
          return null
        }

        if (editedFields.position !== undefined) {
          const numOfEntries = await tx.entry.count()
          if (editedFields.position > numOfEntries) {
            throw new ArgumentError(
              'position',
              `<= ${String(numOfEntries)}`,
              String(editedFields.position),
            )
          }

          const oldPos = oldEntry.position
          if (editedFields.position > oldPos) {
            await tx.entry.updateMany({
              where: {
                AND: [
                  { position: { gt: oldPos } },
                  { position: { lte: editedFields.position } },
                ],
              },
              data: { position: { decrement: 1 } },
            })
          } else {
            await tx.entry.updateMany({
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

        return tx.entry.update({
          where: { id: id },
          data: editedFields,
        })
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    )

    return editedEntry
  }
}
