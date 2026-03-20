import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { executeHandler } from './api/execute'
import { simulateHandler } from './api/simulate'
import { recipesHandler } from './api/recipes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Allow CORS from the Next.js frontend
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }))
app.use(express.json())
app.set('json replacer', (key: string, value: any) =>
  typeof value === 'bigint' ? value.toString() : value
)

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

// Register API Routes
app.post('/execute', executeHandler)
app.post('/simulate', simulateHandler)
app.get('/recipes', recipesHandler)

app.listen(PORT, () => {
  console.log(`🚀 Automata Backend running on http://localhost:${PORT}`)
})
