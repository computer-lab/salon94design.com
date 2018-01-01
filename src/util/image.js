export const imageFilepath = file =>
  `__PATH_PREFIX__${file}`

export const imageLargePath = image =>
  image ? imageFilepath(image.file) : null

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
  src: imageLargePath(image),
  srcSet: imageSrcSet(image),
  largeSize: imageLargeSize(image),
})
