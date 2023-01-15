import { createReadStream } from 'fs'
import { resolve, dirname } from 'path'
import { createServer } from 'http'
import { IncomingMessage, ServerResponse } from 'http'
import { pipeline } from 'stream/promises'

export const httpServer = createServer(
    async (req: IncomingMessage, res: ServerResponse) => {
        try {
            const __dirname = resolve(dirname(''))
            const file_path =
                __dirname +
                (req.url === '/' ? '/front/index.html' : '/front' + req.url)

            res.writeHead(200)

            await pipeline(createReadStream(file_path), res)
        } catch (error) {
            res.writeHead(404)
            res.end(JSON.stringify(error))
        }
    }
)
