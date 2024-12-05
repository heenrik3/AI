import { describe, it, beforeEach, vi, expect } from 'vitest'
import controller from './controller.js'
import { AI, image, TYPE_REGEX } from './config.js'

vi.mock('./config.js', () => ({
	AI: { generateContent: vi.fn() },
	image: vi.fn(),
	TYPE_REGEX: { test: vi.fn() },
}))

describe('sendFile', () => {
	let req, res

	beforeEach(() => {
		req = { file: null }
		res = {
			setHeader: vi.fn(),
			end: vi.fn(),
		}
	})

	it('deve retornar erro se nenhum arquivo for enviado', async () => {
		await controller.sendFile(req, res)

		expect(res.setHeader).not.toHaveBeenCalled()
		expect(res.end).toHaveBeenCalledWith('Não consigo analisar a imagem 😐')
	})

	it('deve retornar erro se o mimetype do arquivo for inválido', async () => {
		req.file = { mimetype: 'invalid/type' }
		TYPE_REGEX.test.mockReturnValue(false)

		await controller.sendFile(req, res)

		expect(TYPE_REGEX.test).toHaveBeenCalledWith('invalid/type')
		expect(res.end).toHaveBeenCalledWith('Não consigo analisar a imagem 😐')
	})

	it('deve retornar o texto gerado se tudo estiver correto', async () => {
		req.file = { mimetype: 'image/png' }
		TYPE_REGEX.test.mockReturnValue(true)
		image.mockReturnValue('mockedImageData')
		AI.generateContent.mockResolvedValue({
			response: {
				text: () => 'Texto gerado',
			},
		})

		await controller.sendFile(req, res)

		expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain')
		expect(res.end).toHaveBeenCalledWith('Texto gerado')
	})

	it('deve retornar erro se a geração de conteúdo falhar', async () => {
		req.file = { mimetype: 'image/png' }
		TYPE_REGEX.test.mockReturnValue(true)
		image.mockReturnValue('mockedImageData')
		AI.generateContent.mockResolvedValue({
			response: {
				text: () => null,
			},
		})

		await controller.sendFile(req, res)

		expect(res.end).toHaveBeenCalledWith('Não consigo analisar a imagem 😐')
	})

	it('deve retornar erro se AI.generateContent lançar uma exceção', async () => {
		req.file = { mimetype: 'image/png' }
		TYPE_REGEX.test.mockReturnValue(true)
		image.mockReturnValue('mockedImageData')
		AI.generateContent.mockRejectedValue(new Error('Erro na IA'))

		await controller.sendFile(req, res)

		expect(res.end).toHaveBeenCalledWith('Não consigo analisar a imagem 😐')
	})
})
