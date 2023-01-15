import robot from 'robotjs'
import { IDrawSquareOffset } from '../inrerfaces'

const { dragMouse, mouseToggle, setMouseDelay } = robot

export const drawSquare = (arrOffset: Array<IDrawSquareOffset>) => {
    setMouseDelay(500)
    mouseToggle('down')

    for (let i = 0; i < arrOffset.length; i++) {
        mouseToggle('down')
        dragMouse(arrOffset[i]?.x, arrOffset[i]?.y)
    }
}
