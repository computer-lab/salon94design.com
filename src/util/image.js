export const imageFilepath = file =>
  __PATH_PREFIX__ + `${file}`

export const imageLargePath = image =>
  image ? imageFilepath(image.file) : null

export const imageMediumPath = image => {
  const mediumTransformedImageWidth = 948
  const altMediumTransformedImageWidth = 768
  const medium = image.resized.find(image => image.width === mediumTransformedImageWidth)
    || image.resized.find(image => image.width === altMediumTransformedImageWidth)
    || image.resized.sort((a, b) => a.width - b.width)[Math.floor(image.resized.length / 2)] // median

  return medium ? imageFilepath(medium.file) : null
}

export const smallestImagePath = image => {
  if (!image.resized || image.resized.length === 0) {
    return null
  }

  const sizeSortedImages = image.resized
    .sort((a, b) => a.width - b.width)

  return imageFilepath(sizeSortedImages[0].file)
}

export const imageSrcSet = image => {
  if (!image || !image.resized) {
    return ''
  }

  const resized = image.resized
    .sort((a, b) => a.width - b.width)
    .map(({ file, width }) => `${imageFilepath(file)} ${width}w`)

  const large = `${imageLargePath(image)} ${image.width}w`

  return resized.concat([large]).join(', ')
}

export const imageLargeSize = image => ({
  width: image.width,
  height: image.height,
})

export const imageInfo = image => ({
  src: imageMediumPath(image),
  srcSet: imageSrcSet(image),
  largeSrc: imageLargePath(image),
  largeSize: imageLargeSize(image),
})
