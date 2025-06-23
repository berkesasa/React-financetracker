import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear,
  subMonths,
  subYears,
  isToday,
  isYesterday,
  isThisMonth,
  isThisYear
} from 'date-fns'
import { tr } from 'date-fns/locale'

export const formatDate = (date, formatStr = 'dd MMMM yyyy') => {
  return format(new Date(date), formatStr, { locale: tr })
}

export const formatDateShort = (date) => {
  return format(new Date(date), 'dd.MM.yyyy')
}

export const getRelativeDate = (date) => {
  const dateObj = new Date(date)
  
  if (isToday(dateObj)) return 'Bugün'
  if (isYesterday(dateObj)) return 'Dün'
  if (isThisMonth(dateObj)) return formatDate(dateObj, 'dd MMMM')
  if (isThisYear(dateObj)) return formatDate(dateObj, 'dd MMMM')
  
  return formatDate(dateObj, 'dd.MM.yyyy')
}

export const getCurrentMonth = () => {
  const now = new Date()
  return {
    start: startOfMonth(now),
    end: endOfMonth(now),
    label: formatDate(now, 'MMMM yyyy')
  }
}

export const getCurrentYear = () => {
  const now = new Date()
  return {
    start: startOfYear(now),
    end: endOfYear(now),
    label: formatDate(now, 'yyyy')
  }
}

export const getLastMonth = () => {
  const lastMonth = subMonths(new Date(), 1)
  return {
    start: startOfMonth(lastMonth),
    end: endOfMonth(lastMonth),
    label: formatDate(lastMonth, 'MMMM yyyy')
  }
}

export const getLastYear = () => {
  const lastYear = subYears(new Date(), 1)
  return {
    start: startOfYear(lastYear),
    end: endOfYear(lastYear),
    label: formatDate(lastYear, 'yyyy')
  }
}

export const getDateRange = (period) => {
  switch (period) {
    case 'thisMonth':
      return getCurrentMonth()
    case 'lastMonth':
      return getLastMonth()
    case 'thisYear':
      return getCurrentYear()
    case 'lastYear':
      return getLastYear()
    default:
      return getCurrentMonth()
  }
} 