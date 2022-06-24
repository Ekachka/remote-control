import robot from 'robotjs'
import { WebSocketServer, createWebSocketStream } from 'ws'
import { constants } from './src/constants/constants'
import { drawCircle } from './src/commands/drawCircle'
import { drawSquare } from './src/commands/drawSquare'
import { printScreen } from './src/commands/printScreen'
import { offsetRectangle, offsetSquare } from './src/helpers/getOffset'
import { pingSocketInterval } from './src/helpers/pingSocket'
import { httpServer } from './src/http_server'
import 'dotenv/config'


const HTTP_PORT = process.env.PORT || 5000
const WEBSOCKET_PORT = Number(process.env.WS_PORT) || 8080

if (!process.env.PORT) {
  process.exit(1)
}

console.log(`Start static http server on the ${HTTP_PORT} port!`)
httpServer.listen(HTTP_PORT)

const wss = new WebSocketServer({ port: WEBSOCKET_PORT })

const onConnection = async (ws: any) => {
  try {
    ws.isAlive = true
    ws.on(constants.pong, () => (ws.isAlive = true))

    console.log('connection accepted!')

    let stream = createWebSocketStream(ws, { encoding: 'utf8' })
    stream._write = (chunk) => ws.send(chunk)

    ws.on(constants.message, (data: any) => {
      console.log('received: %s', data)

      const [command, width, height] = data.toString().split(' ')
      const offsetWidth = Number(width)
      const offsetHeight = Number(height)

      let { x, y } = robot.getMousePos()

      switch (command) {
        case constants.mouseUp:
          robot.moveMouse(x, y - offsetWidth)
          break
        case constants.mouseDown:
          robot.moveMouse(x, y + offsetWidth)
          break
        case constants.mouseLeft:
          robot.moveMouse(x - offsetWidth, y)
          break
        case constants.mouseRight:
          robot.moveMouse(x + offsetWidth, y)
          break
        case constants.mousePosition:
          stream._write(
            `${constants.mousePosition} ${x},${y}\0`,
            'utf8',
            () => null
          )
          break
        case constants.drawCircle:
          drawCircle(offsetWidth, x, y)
          break
        case constants.drawSquare:
          drawSquare(offsetSquare(x, y, offsetWidth))
          break
        case constants.drawRectangle:
          drawSquare(offsetRectangle(x, y, offsetWidth, offsetHeight))
          break
        case constants.prntScrn:
          const result = printScreen(x, y)
          stream._write(
            `${constants.prntScrn} ${result}\0`,
            'utf8',
            () => null
          )
          break
        default:
          console.log('invalid command')
      }

      if (command !== constants.mousePosition) {
        if (command !== constants.prntScrn) {
          stream._write(`${command}\0`, 'utf8', () => null)
        }
      }
    })

    ws.on(constants.close, () => {
      console.log('User disconnected')
      stream.emit('close')
      ws.close()
    })
  } catch (error) {
    console.log(error)
  }
}

wss.on(constants.connection, onConnection)
wss.on(constants.close, () => clearInterval(pingSocketInterval(wss)))
