import { PrismaClient } from '../generated/prisma/client.ts'

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
}
