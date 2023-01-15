export const offsetRectangle = (
    x: number,
    y: number,
    offsetWidth: number,
    offsetHeight: number
) => [
    { x: x + offsetWidth, y: y },
    { x: x + offsetWidth, y: y + offsetHeight },
    { x: x, y: y + offsetHeight },
    { x, y },
]

export const offsetSquare = (x: number, y: number, offsetWidth: number) => [
    { x: x + offsetWidth, y: y },
    { x: x + offsetWidth, y: y + offsetWidth },
    { x: x, y: y + offsetWidth },
    { x, y },
]
