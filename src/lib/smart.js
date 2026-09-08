// Smart utilities: scoring-based recommendations + sorting + search

const STOP = new Set(['the', 'and', 'with', 'for', 'pro', 'max', 'mini', 'plus'])

function tokens(text) {
  return String(text || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 3 && !STOP.has(t))
}

/**
 * Score products against an anchor product using:
 * category affinity, name similarity, price proximity, favorites & view history.
 */
export function recommendProducts(products, anchor, { favorites = [], viewed = [], limit = 6 } = {}) {
  if (!anchor) return []
  const favSet = new Set(favorites)
  const viewedSet = new Set(viewed.map((v) => v.id))
  const anchorTokens = new Set(tokens(anchor.name + ' ' + (anchor.brand || '')))
  const anchorPrice = Number(anchor.price) || 0

  const scored = products
    .filter((p) => p.id !== anchor.id)
    .map((p) => {
      let score = 0
      if (p.category && p.category === anchor.category) score += 3
      const pTokens = tokens(p.name + ' ' + (p.brand || ''))
      const overlap = pTokens.filter((t) => anchorTokens.has(t)).length
      score += Math.min(overlap * 1.2, 2.4)
      const diff = Math.abs((Number(p.price) || 0) - anchorPrice) / Math.max(anchorPrice, 1)
      if (diff <= 0.25) score += 1.6
      else if (diff <= 0.6) score += 0.8
      if (favSet.has(p.id)) score += 0.9
      if (viewedSet.has(p.id)) score += 0.6
      if (p.featured) score += 0.5
      if (p.inStock === false) score -= 1.5
      return { p, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, limit).map((x) => x.p)
}

export function sortProducts(list, sort) {
  const arr = [...list]
  switch (sort) {
    case 'newest':
      return arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    case 'price-asc':
      return arr.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0))
    case 'price-desc':
      return arr.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))
    case 'name':
      return arr.sort((a, b) => String(a.name).localeCompare(String(b.name)))
    case 'featured':
    default:
      return arr.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.createdAt || 0) - (a.createdAt || 0))
  }
}

export function searchProducts(list, q) {
  const query = String(q || '').trim().toLowerCase()
  if (!query) return list
  const terms = query.split(/\s+/)
  return list.filter((p) => {
    const hay = [p.name, p.brand, p.description, p.category, ...(p.specs || []).map((s) => `${s.k} ${s.v}`)]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return terms.every((t) => hay.includes(t))
  })
}

export function filterProducts(list, { categories = [], maxPrice = null, minPrice = null, inStockOnly = false, featuredOnly = false }) {
  return list.filter((p) => {
    if (categories.length && !categories.includes(p.category)) return false
    const price = Number(p.price) || 0
    if (minPrice != null && price < minPrice) return false
    if (maxPrice != null && price > maxPrice) return false
    if (inStockOnly && p.inStock === false) return false
    if (featuredOnly && !p.featured) return false
    return true
  })
}
