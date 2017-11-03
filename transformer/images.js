const fs = require('fs-extra')
const path = require('path')
const shortid = require('shortid')
const sharp = require('sharp')

const { getDesigners, updateDesignerFile, getProjects, updateProjectFile, updateInfoFile } = require('./data')

module.exports = {
  processImages: main,
  getImageData
}

const imageDir = path.join(__dirname, '../static/images')

async function main () {
  await Promise.all([
    processDesigners(),
    processProjects(),
    processInfo(),
  ])
}

async function processInfo () {
  const info = await getInfo()
  const processedInfo = await processInfoImages(info)
  await updateInfo(info, processedInfo)
}

async function processInfoImages (info) {
  // find images that need processing
  const images = info.photos || []
  const imagesToProcess = images.filter(image =>
    !image.file.includes('static/images/info')
  )

  // process them
  const processedImages = await Promise.all(imagesToProcess.map(image => {
    const newFilename = infoImageFilename(project, image)
    return processImage(image, newFilename)
  }))

  // return relevant info
  return processedImages.map((item, i) => Object.assign({}, item, {
    originalImageIndex: images.indexOf(imagesToProcess[i])
  }))

}

function infoImageFilename (image) {
  const newDirectory = path.resolve(imageDir, 'info', shortid.generate())
  const newFilename = path.join(newDirectory, `large${path.extname(image.file)}`)
  return newFilename
}

async function updateInfo (info, processedImages) {
  if (processedImages.length === 0) {
    return
  }

  const images = await Promise.all(info.photos.map(async (image, index) => {
    const processedItem = processedImages.find(item => item.originalImageIndex === index)
    return processedItem ? getProcessedImageData(image, processedItem) : image
  }))

  // write updated project to same file
  const updatedInfo = Object.assign({}, info, { images })
  await updateInfoFile(updatedInfo)
}

async function processDesigners () {
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

async function processProjects () {
  const projects = await getProjects()

  // process project images
  const processedProjectImages = await Promise.all(projects.map(project =>
    processProjectImages(project)
  ))

  // update yaml files of all designers
  await Promise.all(projects.map((project, index) =>
    updateProject(project, processedProjectImages[index])
  ))
}

async function processDesignerWorks (data) {
  const { works } = data
  return Promise.all(works.map(async (work) => {
    // find images that need processing
    const images = work.images || []
    const imagesToProcess = images.filter(image =>
      !image.file.includes('static/images/works')
    )

    // process them
    const processedImages = await Promise.all(imagesToProcess.map(image => {
      const newFilename = workImageFilename(data, work, image)
      return processImage(image, newFilename)
    }))

    // return relevant info
    return processedImages.map((item, i) => Object.assign({}, item, {
      originalImageIndex: images.indexOf(imagesToProcess[i])
    }))
  }))
}

async function processProjectImages (project) {
  // find images that need processing
  const images = project.images || []
  const imagesToProcess = images.filter(image =>
    !image.file.includes('static/images/projects')
  )

  // process them
  const processedImages = await Promise.all(imagesToProcess.map(image => {
    const newFilename = projectImageFilename(project, image)
    return processImage(image, newFilename)
  }))

  // return relevant info
  return processedImages.map((item, i) => Object.assign({}, item, {
    originalImageIndex: images.indexOf(imagesToProcess[i])
  }))
}

async function updateDesigner (data, processedWorks) {
  const dataWorks = data.works || []
  const works = await Promise.all(dataWorks.map(async (work, index) => {
    const processedWorkItems = processedWorks[index]
    const workImages = work.images || []
    const images = await Promise.all(workImages.map(async (image, index) => {
      const processedWorkItem = processedWorkItems.find(item => item.originalImageIndex === index)
      return processedWorkItem ? getProcessedImageData(image, processedWorkItem) : image
    }))

    return Object.assign({}, work, { images })
  }))

  // write updated designer to same file
  const updatedDesigner = Object.assign({}, data, { works })
  await updateDesignerFile(updatedDesigner)
}

async function updateProject (project, processedImages) {
  if (!project.images || processedImages.length === 0) {
    return
  }

  const images = await Promise.all(project.images.map(async (image, index) => {
    const processedItem = processedImages.find(item => item.originalImageIndex === index)
    return processedItem ? getProcessedImageData(image, processedItem) : image
  }))

  // write updated project to same file
  const updatedProject = Object.assign({}, project, { images })
  await updateProjectFile(updatedProject)
}

async function getProcessedImageData (image, processedImageItem) {
  const { newImage, resizedImages } = processedImageItem
  const primaryImageData = await getImageData(newImage)
  return Object.assign({}, image, primaryImageData, {
    resized: await Promise.all(resizedImages.map(getImageData))
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
  // References to images in the data need to be prefixed with /public/static/ to show up in the CMS
  const prefix = 'images/'
  return path.join('/public/static', filename.substr(filename.indexOf(prefix)))
}

function workImageFilename (designer, work, image) {
  const newDirectory = path.resolve(imageDir, 'works', designer.slug,  `${work.slug}-${shortid.generate()}`)
  const newFilename = path.join(newDirectory, `large${path.extname(image.file)}`)
  return newFilename
}

function projectImageFilename (project, image) {
  const newDirectory = path.resolve(imageDir, 'projects', project.slug, shortid.generate())
  const newFilename = path.join(newDirectory, `large${path.extname(image.file)}`)
  return newFilename
}

async function processImage (image, newFilename) {
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
}

function moveImage (image, newFilename) {
  // move image to correct directory
  const oldFilename = path.join(imageDir, path.basename(image.file))
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
    if (width > 800) sizes.push({ width: 800 })
    if (width > 1440) sizes.push({ width: 1440 })
  } else {
    sizes.push({ height: 300 })
    if (height > 600) sizes.push({ height: 600 })
    if (height > 900) sizes.push({ height: 900 })
    if (height > 1600) sizes.push({ height: 1600 })
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
