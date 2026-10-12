import { Prisma, PrismaClient } from '../generated/prisma/client.ts'
import type { Entry } from '../generated/prisma/client.ts'
import type { EntryUpdate } from './types.ts'
import ArgumentError from './errors/ArgumentError.ts'

type TransactionHandler = Parameters<PrismaClient['$transaction']>[0]
type Transaction = Parameters<TransactionHandler>[0]
type TransactionCreator = <T>(func: (tx: Transaction) => Promise<T>) => Promise<T>

export default class EntryRepository {
  #lockedTransaction: TransactionCreator

  constructor(prismaClient: PrismaClient) {
    this.#lockedTransaction = func =>
      prismaClient.$transaction(async tx => {
        await tx.$executeRaw`LOCK TABLE "Entry" IN ACCESS EXCLUSIVE MODE`
        return func(tx)
      })
  }

  async reset() {
    await this.#lockedTransaction(async tx => {
      await tx.$executeRaw`
        TRUNCATE TABLE "Entry"
        RESTART IDENTITY CASCADE
      `
    })
  }

  async fetchAll() {
    const fetchedEntries = await this.#lockedTransaction(tx =>
      tx.entry.findMany({
        orderBy: { position: 'asc' },
      }),
    )

    return fetchedEntries
  }

  async create(entry: {
    content: string
    quantity: number
    unit: string
    additionalInfo: string
  }) {
    const addedEntry = await this.#lockedTransaction(async (tx) => {
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
    })

    return addedEntry
  }

  async delete(id: number) {
    const deletedEntry = await this.#lockedTransaction(async (tx) => {
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
    })

    return deletedEntry
  }

  async deleteMany(ids: number[]) {
    await this.#lockedTransaction(async (tx) => {
      await tx.entry.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      })

      await tx.$executeRaw`
        UPDATE "Entry" E
        SET position = (
          SELECT COUNT(*)
          FROM "Entry"
          WHERE position <= E.position
        )
      `
    })
  }

  async update(id: number, editedFields: EntryUpdate) {
    const editedEntry = await this.#lockedTransaction(async (tx) => {
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
    })

    return editedEntry
  }
}
