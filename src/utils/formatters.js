export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(amount)
}

export const formatNumber = (number) => {
  return new Intl.NumberFormat('tr-TR').format(number)
}

export const formatCompactCurrency = (amount) => {
  const formatter = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    notation: 'compact',
    maximumFractionDigits: 1,
  })
  return formatter.format(amount)
}

export const parseAmount = (value) => {
  const cleaned = value.toString().replace(/[^\d,-]/g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
} 