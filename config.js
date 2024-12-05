import { GoogleGenerativeAI } from '@google/generative-ai'

import dotenv from 'dotenv'
dotenv.config()

const { API, MODEL } = process.env

const image = file => {
	const data = file.buffer.toString('base64')
	const mimeType = file.mimetype

	return {
		inlineData: {
			data,
			mimeType,
		},
	}
}

const TYPE_REGEX = /^image\/(jpg|jpeg|png|gif|bmp|webp|svg)$/i

const AI = new GoogleGenerativeAI(API).getGenerativeModel({ model: MODEL })

export default { image, TYPE_REGEX, AI }
