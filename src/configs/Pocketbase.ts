import type { BrandItem } from '@/interfaces/BrandItem'
import type { InvoiceItem } from '@/interfaces/InvoiceItem'
import type { ProductItem } from '@/interfaces/ProductItem'
import type { VendorItem } from '@/interfaces/VendorItem'
import PocketBase from 'pocketbase'

// POCKETBASE URL
const URL = import.meta.env.VITE_POCKETBASE_URL

// INITIALIZE THE POCKETBASE INSTANCE
const pb = new PocketBase(URL)

const get = async (collectionName: string, sortBy: string = '-created') =>
  await pb.collection(collectionName).getFullList({
    sort: sortBy
  })
const put = async (collectionName: string, data: any, id: any) =>
  await pb.collection(collectionName).update(id, data)
const upsert = async (collectionName: string, data: any) => {
  if (data?.id) {
    return await put(collectionName, data, data?.id)
  } else {
    return await post(collectionName, data)
  }
}

const post = async (collectionName: string, data: any) =>
  await pb.collection(collectionName).create(data)
const remove = async (collectionName: string, id: string) =>
  await pb.collection(collectionName).delete(id)
const subscribe = async (collectionName: string, onUpdate: (e: any) => void, on: string = '*') =>
  pb.collection(collectionName).subscribe(on, onUpdate)

const api = {
  Brands: {
    put: (data: BrandItem) => put('Brands', data, data?.id),
    upsert: (data: BrandItem) => upsert('Brands', data),
    get: () => get('Brands'),
    post: (data: BrandItem) => post('Brands', data),
    delete: (id: string) => remove('Brands', id),
    subscribe: (onUpdate: (e: any) => void) => subscribe('Brands', onUpdate)
  },
  Vendors: {
    put: (data: VendorItem) => put('Vendors', data, data?.id),
    upsert: (data: VendorItem) => upsert('Vendors', data),
    get: () => get('Vendors'),
    post: (data: VendorItem) => post('Vendors', data),
    delete: (id: string) => remove('Vendors', id),
    subscribe: (onUpdate: (e: any) => void) => subscribe('Vendors', onUpdate)
  },
  Products: {
    put: (data: ProductItem) => put('Products', data, data?.id),
    upsert: (data: ProductItem | Array<ProductItem>) => upsert('Products', data),
    get: () => get('Products'),
    post: (data: ProductItem) => post('Products', data),
    delete: (id: string) => remove('Products', id),
    subscribe: (onUpdate: (e: any) => void) => subscribe('Products', onUpdate)
  },
  Invoices: {
    put: (data: InvoiceItem) => put('Invoices', data, data?.id),
    upsert: (data: InvoiceItem | Array<InvoiceItem>) => upsert('Invoices', data),
    get: () => get('Invoices'),
    post: (data: InvoiceItem) => post('Invoices', data),
    delete: (id: string) => remove('Invoices', id),
    subscribe: (onUpdate: (e: any) => void) => subscribe('Invoices', onUpdate)
  }
}

export { pb, api }
