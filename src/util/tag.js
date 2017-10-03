// convert subcategory tags to their parent
const tagCategory = tag => {
  if (tag === 'benches' || tag === 'chairs') {
    return 'seating'
  }

  return tag
}

// convert categories to their subcategory tags
const categoryTags = category => {
  if (category === 'seating') {
    return ['benches', 'chairs']
  }

  return [category]
}

module.exports.tagCategory = tagCategory
module.exports.categoryTags = categoryTags
