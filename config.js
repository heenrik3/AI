import { GoogleGenerativeAI } from '@google/generative-ai'

import dotenv from 'dotenv'
dotenv.config()

const { API, MODEL } = process.env

export const image = file => {
	const data = file.buffer.toString('base64')
	const mimeType = file.mimetype

	return {
		inlineData: {
			data,
			mimeType,
		},
	}
}

export const TYPE_REGEX = /^image\/(jpg|jpeg|png|gif|bmp|webp|svg)$/i

export const AI = new GoogleGenerativeAI(API).getGenerativeModel({
	model: MODEL,
})
