import express from 'express'

import EntryRepository from '../EntryRepository.ts'
import { EntryId, EntryIds, EntryUpdate, NewEntry } from '../validation.ts'
import ArgumentError from '../errors/ArgumentError.ts'


export const createEntriesRouter = (entryRepository: EntryRepository) => {
  const entriesRouter = express.Router()

  entriesRouter.get('/', async (_, res) => {
    const entries = await entryRepository.fetchAll()
    res.json(entries)
  })

  entriesRouter.post('/', async (req, res) => {
    const validatedBody = NewEntry.safeParse(req.body)

    if (!validatedBody.success) {
      res.status(400).json({
        error: 'Invalid request body',
        details: validatedBody.error.issues.map(issue => ({
          field: ['body', ...issue.path].join('.'),
          message: issue.message,
        })),
      })
      return
    }

    const addedEntry = await entryRepository.create(validatedBody.data)

    res.status(201).json(addedEntry)
  })

  entriesRouter.delete('/:id', async (req, res) => {
    const validatedId = EntryId.safeParse(req.params.id)

    if (!validatedId.success) {
      res.status(400).json({ error: 'Invalid ID' })
      return
    }

    const deletedEntry = await entryRepository.delete(validatedId.data)

    if (deletedEntry === null) {
      res.status(404).json({ error: 'Entry not found' })
      return
    }

    res.status(200).json(deletedEntry)
  })

  entriesRouter.delete('/', async (req, res) => {
    const validatedBody = EntryIds.safeParse(req.body)

    if (!validatedBody.success) {
      res.status(400).json({
        error: 'Invalid request body',
        details: validatedBody.error.issues.map(issue => ({
          field: ['body', ...issue.path].join('.'),
          message: issue.message,
        })),
      })
      return
    }

    for (const id of validatedBody.data.ids) {
      await entryRepository.delete(id)
    }

    res.status(204).end()
  })

  entriesRouter.patch('/:id', async (req, res) => {
    const validatedId = EntryId.safeParse(req.params.id)

    if (!validatedId.success) {
      res.status(400).json({ error: 'Invalid ID' })
      return
    }

    const validatedBody = EntryUpdate.safeParse(req.body)

    if (!validatedBody.success) {
      res.status(400).json({
        error: 'Invalid request body',
        details: validatedBody.error.issues.map(issue => ({
          field: ['body', ...issue.path].join('.'),
          message: issue.message,
        })),
      })
      return
    }

    try {
      const editedEntry = await entryRepository.update(
        validatedId.data,
        validatedBody.data,
      )

      if (editedEntry === null) {
        res.status(404).json({ error: 'Entry not found' })
        return
      }

      res.json(editedEntry)
    } catch (error) {
      if (error instanceof ArgumentError) {
        res.status(400).send({ error: `Position should be ${error.expectedValue}` })
      } else {
        throw error
      }
    }
  })

  return entriesRouter
}
