import express from 'express'
import cors from 'cors'
import multer from 'multer'
import controller from './controller.js'

const { PORT } = process.env

const storage = multer.memoryStorage()
const upload = multer({ storage })

const app = express()

app.use(cors())

app.route('/').post(upload.single('file'), controller.sendFile)

app.listen(PORT, () => console.log('server ready at ' + PORT))
