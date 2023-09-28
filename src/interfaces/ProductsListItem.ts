export interface ProductsListItem {
  id: any
  name: string // NAME OF PRODUCT
  unitsPerBox: number // NUMBER OF ITEMS IN A BOX
  unitPrice?: number | string // PRICE OF A SINGLE ITEM AT WHICH YOU SELLED
  brand_id?: any // ID of the product brand
  vendor_id?: any // ID OF THE VENDOR FROM WHICH THE PRODUCT IS PURCHASED
  quantity: number // TOTAL QUANTITY OF THE PRODUCT
  price: number // PRICE OF A SINGLE PRODUCT AT WHICH IT WAS PURCHASED
  purchasingPrice?: number // PRICE OF A SINGLE PRODUCT AT WHICH IT WAS PURCHASED
  created_at?: any // DATE
}
