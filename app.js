import express from 'express'
import cors from 'cors'
import multer from 'multer'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'

dotenv.config()

const { API, MODEL } = process.env

const app = express()
app.use(cors())

const storage = multer.memoryStorage()
const upload = multer({ storage })

const ai = new GoogleGenerativeAI(API).getGenerativeModel({ model: MODEL })
const prompt = 'descreva essa imagem em português com detalhe'

app.route('/')
	.get((req, res) => res.end(''))
	.post(upload.single('file'), onFile)

app.listen(8080, () => {
	console.log('server ready')
})

function image(file) {
	const data = file.buffer.toString('base64')
	const mimeType = file.mimetype

	return {
		inlineData: {
			data,
			mimeType,
		},
	}
}

async function onFile(req, res) {
	const { file } = req

	if (!file) return res.status(400)

	res.setHeader('Content-Type', 'text/plain')

	const img = image(file)

	try {
		const response = await ai.generateContentStream([prompt, img])

		for await (const chunk of response.stream) {
			res.write(chunk.text())
		}
	} catch (error) {
		console.log(error)

		res.end('error')
	} finally {
		res.end()
	}
}
