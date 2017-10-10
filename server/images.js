const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')
const shortid = require('shortid')
const sharp = require('sharp')

const imageDir = path.join(__dirname, '../static/images')
const processedImageDir = path.join(imageDir, 'works')

processDesigners()

function processDesigners () {
  const designers = await getDesigners()
  const processedWorks = await Promise.all(designers.map(designer => processWorks(designer)))

  await Promise.all(designers.map((designer, index) =>
    updateDesigner(designer, processedWorks[index])
  ))
}

async function processWorks ({ data, file }) {
  const { works } = data
  return Promise.all(works.map(work => {
    const imagesToProcess = work.images.filter(image =>
      !image.file.includes(processedImageDir)
    )

    // move from root static folder to correct subdirectory, and rename
    const movedImages = await Promise.all(imagesToProcess.map(image =>
      moveImage(data, work, image)
    ))

    // convert other image formats to jpg
    const jpegImages = await Promise.all(movedImages.map(image =>
      makeImageJpeg(image)
    ))

    // create necessary sizes
    const processedImages = await Promise.all(jpegImages.map(jpegFilename =>
      resizeImage(jpegFilename)
    ))

    // return relevant info
    return imagesToProcess.map((image, index) => ({
      originalImageIndex: work.images.indexOf(image),
      newImage: jpegImages[index],
      resizedImages: processedImages[index]
    }))
  }))
}

async function updateDesigner ({ data, file }, processedWorks) {
  // clone the data
  const designer = JSON.parse(JSON.stringify(data))

  const workDatas = designer.works.map((work, index) => {
    const processedWorkItems = processedWorks[index]
    const images = work.images.map((image, index) => {
      // check if image was processed
      const processedWorkItem = processedWorkItems.find(item => item.originalImageIndex === index)
      if (!processedWorkItem) {
        return image
      }

      const { newImage, resizedImages } = processedWorkItem

      const { width, height } = await sharp(newImage).metadata()

      return {
        file: imageDataFilename(newImage),
        width,
        height,
        resized: resizedImages.map(resizedImage => {

        })
      }
    })
  })
}

async function getDesigners () {
  const designerDir = path.join(__dirname, '../src/data/designers')
  const designerFiles = fs.readdirSync(designerDir).map(f => path.join(designerDir, f))

  return Promise.all(designerFiles.map(designerFile => {
    return fs.readFile(designerFile, 'utf8')
      .then(str => yaml.safeLoad(str))
      .then(data => ({ data, file: designerFile}))
      .catch(err => {
        console.error('err reading yaml: ', designerFile)
        console.error(err)
      })
  }))
}

function imageDataFilename (filename) {
  // shorten filename to only include necessary info in yaml
  const imagesIndex = filename.indexOf('images')
  return filename.substr(imagesIndex)
}

function getImageDirectory (designer) {
  return path.join(processedImageDir, designer.slug)
}

function moveImage (designer, work, image) {
  // move image to correct directory
  const oldFilename = path.join(imageDir, path.basename(image.file))
  const newBasename = `${work.slug}-${shortid.generate()}${path.extname(oldFilename)}`
  const newFilename = path.join(getImageDirectory(designer), newBasename)
  return fs.move(oldFilename, newFilename)
    .catch(err => {
      console.error('err moving file: ', oldFilename)
      console.error(err)
    })
}

function makeImageJpeg (image) {
  const ext = path.extname(imageFilename)
  if (ext === '.jpg') {
    return Promise.resolve(imageFilename)
  }

  const jpegFilename = path.basename(imageFilename, ext) + '.jpg'
  return sharp(imageFilename)
    .jpeg({ quality: 90 })
    .toFile(jpegFilename)
    .then(() => jpegFilename)
    .catch(err => {
      console.error('err making image jpeg: ', imageFilename)
      console.error(err)
    })
}

async function resizeImage (jpegFilename) {
  let info
  try {
    info = await sharp(jpegFilename).metadata()
  } catch (err) {
    console.error('err reading image metadata: ', jpegFilename)
    console.error(err)
    return []
  }

  const { width, height } = info

  const sizes = []
  if (width >= height) {
    sizes.push({ width: 200 })
    sizes.push({ width: 400 })
    if (width > 1440) {
      sizes.push({ width: 1440 })
    }
  } else {
    sizes.push({ height: 300 })
    sizes.push({ height: 600 })
    if (height > 1600) {
      sizes.push({ height: 1600 })
    }
  }

  return Promise.all(sizes.map(size => {
    const ext = path.extname(jpegFilename)
    const resizedFilename = path.basename(jpegFilename, ext) +
      `-${size.width ? `w${size.width}` : `h${size.height}`}`

    return sharp(jpegFilename)
      .resize(size.width, size.height)
      .toFile(resizedFilename)
      .then(() => resizedFilename)
      .catch(err => {
        console.error('err resizing image: ', jpegFilename)
        console.error(err)
      })
  }))
}
