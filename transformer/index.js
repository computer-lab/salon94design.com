const purifyData = require('./purify')
const { processImages } = require('./images')

main()

async function main () {
  try {
    // ensure slugs, etc, are of the correct format
    await purifyData()

    // move images to correct place, generate smaller sizes
    await processImages()
  } catch (err) {
    console.error(err)
  }
}
