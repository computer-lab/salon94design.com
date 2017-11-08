const categoryTagMap = {
  furniture: new Set([
    'furniture',
    'beds',
    'benches',
    'chairs',
    'outdoor',
    'seating',
    'storage',
    'tables',
  ]),
  lighting: new Set(['lighting']),
  miscellaneous: new Set([
    'ceramics',
    'fashion',
    'jewelry',
    'textiles',
    'miscellaneous',
  ]),
}
const categories = Object.keys(categoryTagMap)

const getTagCategory = tag => {
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i]
    if (categoryTagMap[category].has(tag)) {
      return category
    }
  }

  // default to last category (misc.)
  return categories[categories.length - 1]
}

const getCategoryTags = (designers, category) => {
  const classifiedTags = getAllTags(designers)
  const item = classifiedTags.find(item => item.category === category)
  return item ? item.tags : []
}

const getAllTags = designers => {
  const tagSortValue = tag => {
    // miscellaneous should always be sorted at the bottom of the list
    return tag === 'miscellaneous' ? 'zzz' : tag
  }

  const tagSet = new Set()
  designers.forEach(designer => {
    const works = designer.works || []
    works.forEach(work => {
      const tags = (work.tags || [])
        .filter(t => !!t)
        .map(t => t.trim().toLowerCase())
        .filter(t => t.length > 0)

      tags.forEach(t => tagSet.add(t))
    })
  })

  const tags = Array.from(tagSet).sort((a, b) =>
    tagSortValue(a).localeCompare(tagSortValue(b))
  )

  const classifiedTags = {}
  tags.forEach(tag => {
    const category = getTagCategory(tag)
    if (!classifiedTags[category]) {
      classifiedTags[category] = []
    }

    classifiedTags[category].push(tag)
  })

  return categories.map(category => ({
    category,
    tags: classifiedTags[category] || [],
  }))
}

module.exports = { categories, getTagCategory, getCategoryTags, getAllTags }
