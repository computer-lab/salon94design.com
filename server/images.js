const fs = require('fs-extra')
const path = require('path')
const shortid = require('shortid')
const sharp = require('sharp')

const { getDesigners, updateDesignerFile } = require('./data')

module.exports = main

const imageDir = path.join(__dirname, '../static/images')
const processedImageDir = path.join(imageDir, 'works')

async function main () {
  const designers = await getDesigners()

  // process works of all designers
  const processedWorks = await Promise.all(designers.map(designer =>
    processDesignerWorks(designer)
  ))

  // update yaml files of all designers
  await Promise.all(designers.map((designer, index) =>
    updateDesigner(designer, processedWorks[index])
  ))
}

async function processDesignerWorks (data) {
  const { works } = data
  return Promise.all(works.map(async (work) => {
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

async function updateDesigner (data, processedWorks) {
  const getImageData = async (filename) => {
    const { width, height } = await sharp(filename).metadata()
    return {
      file: imageDataFilename(filename),
      width,
      height
    }
  }

  const works = await Promise.all(data.works.map(async (work, index) => {
    const processedWorkItems = processedWorks[index]
    const images = await Promise.all(work.images.map(async (image, index) => {
      // check if image was processed
      const processedWorkItem = processedWorkItems.find(item => item.originalImageIndex === index)
      if (!processedWorkItem) {
        return image
      }

      // rewrite images list to include width, height, and resized files
      const { newImage, resizedImages } = processedWorkItem
      const primaryImageData = await getImageData(newImage)
      return Object.assign({}, primaryImageData, {
        resized: await Promise.all(resizedImages.map(getImageData))
      })
    }))

    return Object.assign({}, work, { images })
  }))

  // write updated designer to same file
  const updatedDesigner = Object.assign({}, data, { works })
  await updateDesignerFile(updatedDesigner)
}

function imageDataFilename (filename) {
  // shorten filename to only include necessary info in yaml
  const prefix = 'images/'
  return filename.substr(filename.indexOf(prefix) + prefix.length)
}

function getImageDirectory (designer) {
  return path.join(processedImageDir, designer.slug)
}

function moveImage (designer, work, image) {
  // move image to correct directory
  const oldFilename = path.join(imageDir, path.basename(image.file))
  const newDirectory = path.join(getImageDirectory(designer), `${work.slug}-${shortid.generate()}`)
  const newFilename = path.join(newDirectory, `large${path.extname(oldFilename)}`)
  return fs.move(oldFilename, newFilename)
    .then(() => newFilename)
    .catch(err => {
      console.error('err moving file: ', oldFilename)
      console.error(err)
    })
}

function makeImageJpeg (imageFilename) {
  const ext = path.extname(imageFilename)
  if (ext === '.jpg') {
    return Promise.resolve(imageFilename)
  }

  let jpegFilename = path.basename(imageFilename, ext) + '.jpg'
  jpegFilename = path.join(path.dirname(imageFilename), jpegFilename)
  return sharp(imageFilename)
    .jpeg({ quality: 90 })
    .toFile(jpegFilename)
    .then(() =>
      fs.remove(imageFilename) // remove old non-jpeg file
        .catch() // ignore non-critical error
    )
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
    sizes.push({ width: 800 })
    if (width > 1440) {
      sizes.push({ width: 1440 })
    }
  } else {
    sizes.push({ height: 300 })
    sizes.push({ height: 600 })
    sizes.push({ height: 900 })
    if (height > 1600) {
      sizes.push({ height: 1600 })
    }
  }

  return Promise.all(sizes.map(size => {
    const ext = path.extname(jpegFilename)
    let resizedFilename = `resized-${size.width ? `w${size.width}` : `h${size.height}`}${ext}`
    resizedFilename = path.join(path.dirname(jpegFilename), resizedFilename)

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
