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
}
