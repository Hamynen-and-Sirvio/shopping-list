import express from 'express'

import EntryRepository from '../EntryRepository.ts'
import type { EntryUpdate } from '../types.ts'


export const createEntriesRouter = (entryRepository: EntryRepository) => {
  const entriesRouter = express.Router()

  entriesRouter.get('/', async (_, res) => {
    const entries = await entryRepository.fetchAll()
    res.json(entries)
  })

  entriesRouter.post('/', async (req, res) => {
    if (typeof req.body !== 'object') {
      res.status(400).send('Request body should be a JSON object')
      return
    }

    const entry = req.body

    if (typeof entry.content !== 'string') {
      res.status(400)
        .send('Request body should contain "content" field of string type')
      return
    }

    if (entry.content.length < 1 || entry.content.length > 1000) {
      res.status(400).send('Content should be 1-1000 characters long')
      return
    }

    const addedEntry = await entryRepository.create({ content: entry.content })

    res.status(201).json(addedEntry)
  })

  entriesRouter.delete('/:id', async (req, res) => {
    if (req.params.id.length > 6 || !/^[1-9]\d*$/.test(req.params.id)) {
      res.status(400).send('Invalid ID')
      return
    }

    const id = parseInt(req.params.id)

    const deletedEntry = await entryRepository.delete(id)

    if (deletedEntry === null) {
      res.status(404).send('Entry not found')
      return
    }

    res.status(200).json(deletedEntry)
  })

  entriesRouter.delete('/', async (req, res) => {
    if (typeof req.body !== 'object') {
      res.status(400).send('Request body should be a JSON object')
      return
    }

    if (!Array.isArray(req.body.ids)) {
      res.status(400).send('Request body should contain "ids" field of array type')
      return
    }

    const ids = req.body.ids

    for (const id of ids) {
      if (!Number.isInteger(id) || id < 1) {
        res.status(400).send('At least one ID is invalid')
        return
      }
    }

    for (const id of ids) {
      await entryRepository.delete(id)
    }

    res.status(204).end()
  })

  entriesRouter.patch('/:id', async (req, res) => {
    if (req.params.id.length > 6 || !/^[1-9]\d*$/.test(req.params.id)) {
      res.status(400).send('Invalid ID')
      return
    }

    const id = parseInt(req.params.id)

    if (typeof req.body !== 'object') {
      res.status(400).send('Request body should be a JSON object')
      return
    }

    const editedFields: EntryUpdate = {}

    if (req.body.content !== undefined) {
      if (typeof req.body.content !== 'string') {
        res.status(400).send('Content should be string')
        return
      }

      if (req.body.content.length < 1 || req.body.content.length > 1000) {
        res.status(400).send('Content should be 1-1000 characters long')
        return
      }

      editedFields.content = req.body.content
    }

    if (req.body.position !== undefined) {
      if (!Number.isInteger(req.body.position) || req.body.position < 1) {
        res.status(400).send('Position should be a positive integer')
        return
      }

      editedFields.position = req.body.position
    }

    if (req.body.checked !== undefined) {
      if (typeof req.body.checked !== 'boolean') {
        res.status(400).send('"Checked" field should have a boolean value')
        return
      }

      editedFields.checked = req.body.checked
    }

    if (Object.keys(editedFields).length === 0) {
      res.status(400).send('Should edit at least one of the fields')
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
