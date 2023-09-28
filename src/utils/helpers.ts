import type { CartItem } from '@/interfaces/CartItem'
import type { InvoiceItem } from '@/interfaces/InvoiceItem'

import moment from 'moment'

export enum InvoicesMode {
  DAY,
  MONTH,
  YESTERDAY
}

export const getTotalInvoices = (invoices: Array<InvoiceItem>, mode?: InvoicesMode) => {
  if (invoices.length <= 0) return 0

  switch (mode) {
    case InvoicesMode.YESTERDAY:
      return invoices.filter((invoice) =>
        moment(invoice.created).isSame(moment().subtract(1, 'day'), 'day')
      ).length
      break
    case InvoicesMode.DAY:
      return invoices.filter((invoice) => moment(invoice.created).isSame(new Date(), 'day')).length
      break
    case InvoicesMode.MONTH:
      return invoices.filter((invoice) => moment(invoice.created).isSame(new Date(), 'month'))
        .length
      break
  }

  return 0
}

export const getTotal = (items: Array<CartItem>) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0)

export const getProfit = (items: Array<CartItem>) => {
  return items.reduce((total, item) => {
    let itemProfits =
      item.price * item.quantity - (item.purchasingPrice / item.unitsPerBox) * item.quantity
    itemProfits += total

    return itemProfits
  }, 0)
}

export const getTotalEarnings = (invoices: Array<InvoiceItem>, mode?: InvoicesMode) => {
  if (invoices.length <= 0) return 0

  let filteredItems = []
  switch (mode) {
    case InvoicesMode.YESTERDAY:
      filteredItems = invoices.filter((invoice) =>
        moment(invoice.created).isSame(moment().subtract(1, 'day'), 'day')
      )
      return filteredItems.reduce((total, item) => total + getTotal(item.items), 0)
      break
    case InvoicesMode.DAY:
      filteredItems = invoices.filter((invoice) =>
        moment(invoice.created).isSame(new Date(), 'day')
      )
      return filteredItems.reduce((total, item) => total + getTotal(item.items), 0)
      break
    case InvoicesMode.MONTH:
      filteredItems = invoices.filter((invoice) =>
        moment(invoice.created).isSame(new Date(), 'month')
      )
      return filteredItems.reduce((total, item) => total + getTotal(item.items), 0)
      break
  }

  return invoices?.reduce((total, item) => total + getTotal(item.items), 0)
}

export const getTotalProfit = (invoices: Array<InvoiceItem>, mode?: InvoicesMode) => {
  if (invoices.length <= 0) return 0

  let filteredItems = []

  switch (mode) {
    case InvoicesMode.YESTERDAY:
      filteredItems = invoices.filter((invoice) =>
        moment(invoice.created).isSame(moment().subtract(1, 'day'), 'day')
      )

      return filteredItems.reduce((total, item) => total + getProfit(item.items), 0)
      break
    case InvoicesMode.DAY:
      filteredItems = invoices.filter((invoice) =>
        moment(invoice.created).isSame(new Date(), 'day')
      )
      return filteredItems.reduce((total, item) => total + getProfit(item.items), 0)
      break
    case InvoicesMode.MONTH:
      filteredItems = invoices.filter((invoice) =>
        moment(invoice.created).isSame(new Date(), 'month')
      )
      return filteredItems.reduce((total, item) => total + getProfit(item.items), 0)
      break
  }

  return invoices?.reduce((total, item) => total + getProfit(item.items), 0)
}

export function formatCompactNumber(no: number) {
  const formatter = Intl.NumberFormat('en', { notation: 'compact' })
  return formatter.format(no)
}
