import { WebSocketServer } from 'ws'

export const pingSocketInterval = (wss: WebSocketServer) =>
    setInterval(() => {
        wss.clients.forEach((ws: any) => {
            if (ws.isAlive === false) return ws.terminate()

            ws.isAlive = false
            ws.ping()
        })
    }, 30000)
