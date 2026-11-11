import { prisma } from '../../lib/prisma.ts'

import EntryRepository from '../database/EntryRepository.ts'


export const createRepositories = () => {
  const entryRepository = new EntryRepository(prisma)

  return { entryRepository }
}
