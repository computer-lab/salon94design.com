export * from './data'
export * from './path'
export * from './tag'

export const capitalize = str =>
  str
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

export const choice = arr => {
  if (!arr) return null
  return arr[Math.floor(arr.length * Math.random())]
}
