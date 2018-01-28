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
      const newFilename = getWorkImageFilename(designer, work, image, idx)
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
  try {
    // move from root static folder to correct subdirectory, and rename
    const movedImage = await moveImage(image, newFilename)

    // convert other image formats to jpg
    const jpegImage = await makeImageJpeg(movedImage)

    // create necessary sizes
    const resizedImages = await resizeImage(jpegImage)

    // return relevant info
    return {
      newImage: jpegImage,
      resizedImages
    }
  } catch (err) {
    console.error('err processing file:', image.file)
    console.error(err)

    return null
  }
}

function moveImage (image, newFilename) {
  // move image to correct directory
  const oldFilename = path.join(baseDir, imageDataFilename(image.file))
  return fs.copy(oldFilename, newFilename)
    .then(() => newFilename)
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
    const ext = path.extname(jpegFilename)
    let resizedFilename = `resized-${size.width ? `w${size.width}` : `h${size.height}`}${ext}`
    resizedFilename = path.join(path.dirname(jpegFilename), resizedFilename)

    // TODO / rob note: I removed this check for existing files becuase if images are re-ordered then
    // there will be collisions in the filenames. I think a potential solution (if the builds are too slow) is to have a
    // modified_timestamp in the image directory name as well.

    // if resized file exists, don't overwrite
    // if (fs.existsSync(resizedFilename)) {
    //   return Promise.resolve(resizedFilename)
    // }

    return sharp(jpegFilename)
      .resize(size.width, size.height)
      .toFile(resizedFilename)
      .then(() => resizedFilename)
  }))
}
