import express from 'express'

import EntryRepository from '../EntryRepository.ts'


export const createEntriesRouter = (entryRepository: EntryRepository) => {
  const entriesRouter = express.Router()

  entriesRouter.get('/', async (req, res) => {
    const entries = await entryRepository.fetchAll()
    res.json(entries)
  })

  entriesRouter.post('/', async (req, res) => {
    const entry = req.body

    const addedEntry = await entryRepository.create(entry)

    res.status(201).json(addedEntry)
  })

  entriesRouter.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id)

    const deletedEntry = await entryRepository.delete(id)

    res.status(200).json(deletedEntry)
  })

  entriesRouter.patch('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const editedFields = req.body

    if (!editedFields.hasOwnProperty('content') &&
        !editedFields.hasOwnProperty('position') &&
        !editedFields.hasOwnProperty('checked')) {
      res.status(400).send('Should edit at least one of the fields')
      return
    }

    if (editedFields.hasOwnProperty('position') && editedFields.position < 1) {
        res.status(400).send('Position should be >= 1')
        return
    }

    try {
      const editedEntry = await entryRepository.update(id, editedFields)

      if (editedEntry === null) {
        res.status(404).send('Entry not found')
        return
      }

      res.json(editedEntry)
    } catch (error) {
      if (typeof error === 'number') {
        res.status(400).send(`Position should be <= ${error}`)
      } else {
        throw error
      }
    }
  })

  return entriesRouter
}
