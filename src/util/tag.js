// convert categories to their subcategory tags
const categoryTags = category => {
  if (category === 'seating') {
    return ['seating', 'benches', 'chairs']
  }

  return [category]
}

const getAllTags = designers => {
  const requiredTags = [
    'beds',
    'benches',
    'ceramics',
    'chairs',
    'fashion',
    'jewelry',
    'lighting',
    'outdoor',
    'seating',
    'storage',
    'tables',
    'textiles',
    'miscellaneous'
  ]

  const tagSortValue = tag => {
    // miscellaneous should always be sorted at the bottom of the list
    return tag === 'miscellaneous' ? 'zzz' : tag
  }

  const tagSet = new Set(requiredTags)
  designers.forEach(designer => {
    const works = designer.works || []
    works.forEach(work => {
      const tags = (work.tags || [])
        .filter(t => !!t)
        .map(t => t.trim())
        .filter(t => t.length > 0)

      tags.forEach(t => tagSet.add(t))
    })
  })

  const tags = Array.from(tagSet).sort(
    (a, b) => tagSortValue(a).localeCompare(tagSortValue(b))
  )

  return tags
}

module.exports.categoryTags = categoryTags
module.exports.getAllTags = getAllTags
