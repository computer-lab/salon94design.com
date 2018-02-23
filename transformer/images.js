const fs = require('fs-extra')
const path = require('path')
const sharp = require('sharp')

const {
  getDesigners,
  getProjects,
  getInfo,
} = require('./data')

module.exports = {
  processImages: main,
  getImageData,
  getWorkImageFilename,
  getProjectImageFilename,
  getInfoImageFilename,
}

const baseDir = path.join(__dirname, '../static')
const imageDir = path.join(baseDir, 'images')

async function main () {
  await Promise.all([
    processDesigners(),
    processProjects(),
    processInfo(),
  ])
}

async function processDesigners () {
  const designers = await getDesigners()

  // process works of all designers
  await Promise.all(designers.map(designer =>
    processDesignerWorks(designer)
  ))
}

async function processProjects () {
  const projects = await getProjects()

  // process project images
  await Promise.all(projects.map(project =>
    processProjectImages(project)
  ))
}

async function processInfo () {
  const info = await getInfo()
  await processInfoImages(info)
}

async function processDesignerWorks (designer) {
  const { works } = designer
  return Promise.all(works.map(async (work) => {
    // find images that need processing
    const images = work.images || []
    const imagesToProcess = images.filter(image =>
      image.file
    )

    // process them
    const processedImages = await Promise.all(imagesToProcess.map((image, idx) => {
      const newFilename = getWorkImageFilename(designer, work, image, idx, '.jpg')
      return processImage(image, newFilename)
    }))
  }))
}

async function processProjectImages (project) {
  // find images that need processing
  const images = project.images || []
  const imagesToProcess = images.filter(image =>
    image.file
  )

  // process them
  const processedImages = await Promise.all(imagesToProcess.map((image, idx) => {
    const newFilename = getProjectImageFilename(project, image, idx)
    return processImage(image, newFilename)
  }))
}

async function processInfoImages (info) {
  // find images that need processing
  const images = info.images || []
  const imagesToProcess = images.filter(image =>
    image.file
  )

  // process them
  const processedImages = await Promise.all(imagesToProcess.map((image, idx) => {
    const newFilename = getInfoImageFilename(image, idx)
    return processImage(image, newFilename)
  }))
}

async function getProcessedImageData (image, processedImageItem) {
  const { newImage } = processedImageItem
  return Object.assign({}, image, {
    file: imageDataFilename(newImage)
  })
}

async function getImageData (filename) {
  const { width, height } = await sharp(filename).metadata()
  return {
    file: imageDataFilename(filename),
    width,
    height
  }
}

function imageDataFilename (filename) {
  const prefix = '/images/';
  return filename.substr(filename.indexOf(prefix))
}

function getWorkImageFilename (designer, work, image, idx, extname) {
  return getNewFilename(image, ['works', designer.slug, work.slug], idx, extname)
}

function getProjectImageFilename (project, image, idx, extname) {
  return getNewFilename(image, ['projects', project.slug], idx, extname)
}

function getInfoImageFilename (image, idx, extname) {
  return getNewFilename(image, ['info'], idx, extname)
}

function getNewFilename (image, pathComponents, index, extname) {
  if (!extname) {
    extname = path.extname(image.file)
  }

  const newDirectory = path.resolve(imageDir, ...pathComponents, String(index))
  return path.join(newDirectory, `large${extname}`)
}

async function processImage (image, newFilename) {
  const originalFilename = path.join(baseDir, imageDataFilename(image.file))

  try {
    // read image & ensure jpg
    const jpegImage = {
      buf: await makeImageJpeg(originalFilename),
      filename: newFilename
    }

    // create necessary sizes
    const resizedImages = await resizeImage(jpegImage, originalFilename)

    // write images to disk
    await writeImages(jpegImage, resizedImages)

    // return relevant info
    return {
      newImage: jpegImage.filename,
      resizedImages: resizedImages.map((image) => image.filename)
    }
  } catch (err) {
    console.error('err processing file:', originalFilename)
    console.error(err)

    return null
  }
}

async function makeImageJpeg (originalFilename) {
  return sharp(originalFilename)
    .jpeg({ quality: 90 })
    .toBuffer()

    /*
    .then(() =>
      fs.remove(imageFilename) // remove old non-jpeg file
        .catch() // ignore non-critical error
    )
    .then(() => jpegFilename)
    */
}

async function resizeImage (jpegImage, originalFilename) {
  let info
  try {
    info = await sharp(jpegImage.buf).metadata()
  } catch (err) {
    console.error('err reading image metadata: ', originalFilename)
    console.error(err)
    return []
  }

  const { width, height } = info

  const sizes = [{ width: 200 }, { width: 400 }]

  const mediumWidths = [768, 948, 1068]
  mediumWidths.forEach(mediumWidth => {
    if (width > mediumWidth) sizes.push({ width: mediumWidth })
  })

  if (width >= height) {
    const largeWidths = [1440, 2400, 3200]
    largeWidths.forEach(largeWidth => {
      if (width > largeWidth) sizes.push({ width: largeWidth })
    })
  } else {
    sizes.push({ height: 300 })

    const largeHeights = [600, 1600, 2400, 3200]
    largeHeights.forEach(largeHeight => {
      if (height > largeHeight) sizes.push({ height: largeHeight })
    })
  }

  return Promise.all(sizes.map(size => {
    const ext = path.extname(jpegImage.filename)
    let resizedFilename = `resized-${size.width ? `w${size.width}` : `h${size.height}`}${ext}`
    resizedFilename = path.join(path.dirname(jpegImage.filename), resizedFilename)

    return sharp(jpegImage.buf)
      .resize(size.width, size.height)
      .toBuffer()
      .then((resizedImage) => (
        { buf: resizedImage, filename: resizedFilename }
      ))
  }))
}

async function writeImages(jpegImage, resizedImages) {
  function writeImage(image) {
    return sharp(image.buf).toFile(image.filename)
  }

  return (
    fs.ensureFile(jpegImage.filename)
      .then(() => writeImage(jpegImage))
      .then(() => Promise.all(resizedImages.map(writeImage)))
  )
}
