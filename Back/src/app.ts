import express from 'express'
import cors from 'cors'
import { contactRouter } from './contact/contact.routes.js'
import { characterRouter } from './character/character.routes.js'
import { advertisingSpotRouter } from './advertising spot/advertisingSpot.routes.js'
import { blockRouter } from './block/block.routes.js'
import { historyRouter } from './history/history.routes.js'
import { tradeRouter } from './trade/trade.routes.js'
import { connectDB } from './config/db.js'
import { billingHolerRouter } from './billing holder/billing_holder.routes.js'

const app = express()

connectDB();

app.use(cors());
app.use(express.json())

app.use('/api/trades', tradeRouter)
app.use('/api/billingHolders', billingHolerRouter)

app.use('/api/contacs', contactRouter)
app.use('/api/advertisingSpots', advertisingSpotRouter)
app.use('/api/characters', characterRouter)
app.use('/api/blocks', blockRouter)
app.use('/api/historys', historyRouter)

app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' })
})

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})