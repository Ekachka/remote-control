import robot from 'robotjs'

const { dragMouse, mouseToggle, moveMouse, setMouseDelay } = robot

export const drawCircle = (offset: number, x: number, y: number) => {
    setMouseDelay(2)
    moveMouse(x + offset, y)

    for (let i = 0; i <= Math.PI * 2; i += 0.01) {
        mouseToggle('down')
        const xx = x + offset * Math.cos(i)
        const yy = y + offset * Math.sin(i)

        dragMouse(xx, yy)
    }
    mouseToggle('up')
}
