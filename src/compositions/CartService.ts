import type { CartItem } from '@/interfaces/CartItem'
import { CartActions } from '@/interfaces/CartActions'
import { reactive } from 'vue'
import type { CartDetails } from '@/interfaces/CartDetails'
import type { CartTotals } from '@/interfaces/CartTotals'
import { useProducts } from './ProductsService'
import type { ProductsListItem } from '@/interfaces/ProductsListItem'
import { useInvoices } from './InvoiceService'

const CartItems = reactive<Record<CartItem['id'], CartItem>>({})

export function useCart() {
  const { ProductsList, updateProductInList, updateMultipleProducts } = useProducts()
  const { addInvoice } = useInvoices()

  const updateCart = (product: CartItem, action: CartActions) => {
    switch (action) {
      case CartActions.ADD_TO_CART:
        addToCart(product)
        break
      case CartActions.REMOVE_FROM_CART:
        removeFromCart(product)
        break
      case CartActions.DELETE_FROM_CART:
        deleteFromCart(product)
        break
    }
  }

  const addToCart = (product: CartItem) => {
    if (product.totalQuantity > 0) {
      if (CartItems[product.id]) {
        CartItems[product.id].quantity = parseInt(`${CartItems[product.id].quantity}`) + 1
      } else {
        CartItems[product.id] = product
      }
    }
  }

  const removeFromCart = (product: CartItem) => {
    if (CartItems[product.id]?.quantity > 1) {
      CartItems[product.id].quantity -= 1
    } else {
      deleteFromCart(product)
    }
  }

  const deleteFromCart = (product: CartItem) => {
    if (CartItems[product.id]) {
      delete CartItems[product.id]
    }
  }

  const resetCart = () => {
    const keys = Object.keys(CartItems)

    keys.forEach((key: any) => {
      delete CartItems[key]
    })
  }

  const handleCheckout = (details: CartDetails, totals: CartTotals) => {
    // CREATE A PRODUCT ITEM
    const productsToUpdate: Array<ProductsListItem> = []

    const items = Object.values(CartItems)
    items.forEach((product) => {
      const productToUpdate = ProductsList[product.id]

      // Calculate remaining units and boxes
      const totalUnits = Math.floor(productToUpdate.quantity * productToUpdate.unitsPerBox)
      const remainingUnits = Math.max(totalUnits - product.quantity, 0)
      const remainingBoxes = remainingUnits / productToUpdate.unitsPerBox
      productToUpdate.quantity = remainingBoxes

      // PUSH THE PRODUCT IN THE ARRAY OF PRODUCTS TO UPDATE
      productsToUpdate.push(productToUpdate)

      // UPDATE THE PRODUCT IN PRODUCTS LIST
      updateProductInList(productToUpdate)
    })

    resetCart()

    updateMultipleProducts(productsToUpdate)
    addInvoice({
      items: items,
      customerName: details.customerName,
      discount: details.discount
    })
  }

  return {
    CartItems,
    updateCart,
    resetCart,
    handleCheckout
  }
}
