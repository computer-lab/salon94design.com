const getAllTags = designers => {
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

  return Array.from(tagSet).sort((a, b) => a.localeCompare(b))
}

module.exports = { getAllTags }
