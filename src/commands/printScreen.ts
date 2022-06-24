import { Bitmap, screen } from 'robotjs'
import Jimp from 'jimp'
import jimp from 'jimp'

const swapRedAndBlueChannel = (bmp: Bitmap) => {
    for (let i = 0; i < bmp.width * bmp.height * 4; i += 4) {
        ;[bmp.image[i], bmp.image[i + 2]] = [bmp.image[i + 2], bmp.image[i]]
    }
}

export const printScreen = (x: number, y: number) => {
    const size = 200
    const bitmap = screen.capture(x - 100, y - 100, size, size)
    let result

    swapRedAndBlueChannel(bitmap)

    const image = new Jimp({
        data: bitmap.image,
        width: bitmap.width,
        height: bitmap.height,
    })

    image.getBase64(jimp.MIME_PNG, function (err, src) {
        result = src.slice(src.indexOf('base64') + 7)
    })
    return result
}
