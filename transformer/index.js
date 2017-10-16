
const purifyData = require('./purify')
const processImages = require('./images')
const { pullRepo, pushChanges } = require('./git')

main()

async function main () {
  try {
    // pull down latest version
    // await pullRepo()

    // ensure slugs, etc, are of the correct format
    await purifyData()

    // move images to correct place, generate smaller sizes
    await processImages()

    // commit changes (if any made)
    // await pushChanges()
  } catch (err) {
    console.error(err)
  }
}
