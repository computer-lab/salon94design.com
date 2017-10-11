export const imageFilepath = file => __PATH_PREFIX__ + `/images/${file}`

export const imageLargePath = image => imageFilepath(image.file)

export const imageSrcSet = image => {
  const resized = image.resized.map(
    ({ file, width }) => `${imageFilepath(file)} ${width}w`
  )
  const large = `${imageLargePath(image)} ${image.width}w`
  return resized.concat([large]).join(', ')
}
