import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { AI, image, TYPE_REGEX } from './config.js'

const { PROMPT } = process.env

const app = express()
app.use(cors())

const storage = multer.memoryStorage()
const upload = multer({ storage })

app.route('/')
	.get((req, res) => res.end(''))
	.post(upload.single('file'), onFile)

app.listen(8080, () => console.log('server ready'))

async function onFile(req, res) {
	const { file } = req

	try {
		if (!file || !TYPE_REGEX.test(file.mimetype)) throw new Error('')

		console.log(file.mimetype)

		const img = image(file)

		res.setHeader('Content-Type', 'text/plain')

		const content = await AI.generateContent([PROMPT, img])

		const text = content.response.text()

		if (!text) throw new Error('')

		res.end(text)
	} catch (error) {
		console.log(error)

		res.end(`Não consigo analisar a imagem 😐`)
	}
}

// const response = await ai.generateContentStream([prompt, img])

// for await (const chunk of response.stream) {
// 	res.write(chunk.text())
// }
