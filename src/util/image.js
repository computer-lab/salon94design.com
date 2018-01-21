const MaxImageLength = 3200

const getSizeSortedImages = image =>
  image.resized.sort((a, b) => a.width - b.width)

export const imageFilepath = file =>
  __PATH_PREFIX__ + `${file}`

const getLargestImage = image => {
  if (!image) return null

  const length = Math.max(image.width, image.height)
  if (length > MaxImageLength) {
    // find the largest image that is <= max length
    const sizeSorted = getSizeSortedImages(image)
    for (let i = sizeSorted.length - 1; i >= 0; i--) {
      const resizedImage = sizeSorted[i]
      if (Math.max(resizedImage.width, resizedImage.height) <= MaxImageLength) {
        return resizedImage
      }
    }
  }

  return image // return original image
}

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

  return imageFilepath(getSizeSortedImages(image)[0].file)
}

export const imageSrcSet = image => {
  if (!image || !image.resized) {
    return ''
  }

  const resized = getSizeSortedImages(image)
    .map(({ file, width }) => `${imageFilepath(file)} ${width}w`)

  const largest = getLargestImage(image)
  if (largest) {
    const large = `${imageFilepath(largest.file)} ${largest.width}w`
    resized.push(large)
  }

  return resized.join(', ')
}

export const imageLargeSize = image => ({
  width: image.width,
  height: image.height,
})

export const imageInfo = image => {
  const largest = getLargestImage(image)
  return {
    src: imageMediumPath(image),
    src: largest ? imageFilepath(largest.file) : null,
    srcSet: imageSrcSet(image),
    largeSrc: largest ? imageFilepath(largest.file) : null,
    largeSize: imageLargeSize(image),
  }
}
