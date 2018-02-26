const util = require('util')
const cloudinary = require('cloudinary')
const fs = require('fs-extra')
const yaml = require('js-yaml')
const flatmap = require('lodash.flatmapdeep')

function parseDesignerImages (file) {
  const obj = yaml.safeLoad(file)
  return obj.works.map((work) => (
    work.images ? work.images.map((workImage) => ({
      designer: obj.slug,
      data: workImage,
      tags: [obj.slug, work.slug],
      work: work.slug
    })) : []
  ))
}

function parseProjectImages (file) {
  const obj = yaml.safeLoad(file)
  return obj.images.map((image) => ({
    data: image,
    project: obj.slug,
    tags: [obj.slug]
  }))
}

let skipping = true;

function upload (image) {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(`${__dirname}/../static${image.data.file}`, { tags: image.tags, use_filename: true }, (error, result) => {
      if (error) { return reject(error) }
      console.log({
        ...image,
        result
      })
      resolve()
    })
  })
}


// __Entry point__

// Designer images

const DESIGNERS_PATH = './src/data/designers/';
fs.readdir(DESIGNERS_PATH)
  .then((paths) => Promise.all(paths.map((path) => fs.readFile(`${DESIGNERS_PATH}${path}`))))
  .then((files) => flatmap(files, parseDesignerImages))
  .then((designerImages) => {
    designerImages.reduce((acc, next) => (
      acc.then(() => upload(next)).catch((error) => console.error(error))
    ), Promise.resolve())
  })
  .catch((error) => { console.error(error) })


// Project images

const PROJECTS_PATH = './src/data/projects/';
fs.readdir(PROJECTS_PATH)
  .then((paths) => Promise.all(paths.map((path) => fs.readFile(`${PROJECTS_PATH}${path}`))))
  .then((files) => flatmap(files,parseProjectImages))
  .then((projectImages) => {
    projectImages.reduce((acc, next) => (
      acc.then(() => upload(next)).catch((error) => console.error(error))
    ), Promise.resolve())
  })
  .catch((error) => { console.error(error) })
