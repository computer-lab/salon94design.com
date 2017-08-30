export const pieceImagePath = name => require(`../assets/images/${name}.jpg`)

export const designerLink = slug => `/designers/${slug}`

export const pieceLink = (dslug, pslug) => `/designers/${dslug}/${pslug}`
