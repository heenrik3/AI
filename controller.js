import { AI, image, TYPE_REGEX } from './config.js'

const { PROMPT } = process.env

const sendFile = async (req, res) => {
	try {
		const { file } = req

		if (!file || !TYPE_REGEX.test(file.mimetype)) throw new Error('')

		const img = image(file)

		res.setHeader('Content-Type', 'text/plain')

		const content = await AI.generateContent([PROMPT, img])

		const text = content.response.text()

		if (!text) throw new Error('')

		res.end(text)
	} catch (error) {
		// console.log(error)

		res.end(`Não consigo analisar a imagem 😐`)
	}
}

export default { sendFile }

// const response = await ai.generateContentStream([prompt, img])

// for await (const chunk of response.stream) {
// 	res.write(chunk.text())
// }
