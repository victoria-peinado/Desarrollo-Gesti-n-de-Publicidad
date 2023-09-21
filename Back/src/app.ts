import express from 'express'
import cors from 'cors'
import { contactRouter } from './contact/contact.routes.js'
import { characterRouter } from './character/character.routes.js'
import { advertisingSpotRouter } from './advertising spot/advertisingSpot.routes.js'
import { blockRouter } from './block/block.routes.js'


const app = express()

// Configurar CORS
app.use(cors());
app.use(express.json())

app.use('/api/contacs', contactRouter)
app.use('/api/advertisingSpots', advertisingSpotRouter)
app.use('/api/characters', characterRouter)
app.use('/api/blocks', blockRouter)

app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' })
})

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})
