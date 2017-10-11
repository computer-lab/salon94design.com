
const purifyData = require('./purify')
const processImages = require('./images')

main()

async function main () {
  // ensure slugs, etc, are of the correct format
  await purifyData()

  // move images to correct place, generate smaller sizes
  // await processImages()
}
