import { reactive, ref, watch } from 'vue'
import type { ProductItem } from '@/interfaces/ProductItem'
import { api } from '@/configs/Pocketbase'

export const ProductsList = reactive<Record<ProductItem['id'], ProductItem>>({})
const Products = ref<Array<ProductItem>>([])

watch(
  () => ProductsList,
  () => (Products.value = Object.values(ProductsList)),
  { deep: true }
)

export function useProducts() {
  /**
   * Function for subscribing to products table
   */
  const subscribeToProductsTable = () => {
    api.Products.subscribe((payload) => {
      const databaseProduct: ProductItem = payload.record as ProductItem

      // CREATE A PRODUCT ITEM
      const product: ProductItem = {
        id: databaseProduct?.id,
        name: databaseProduct?.name,
        price: databaseProduct?.price,
        quantity: databaseProduct?.quantity,
        unitsPerBox: databaseProduct?.unitsPerBox,
        brand_id: databaseProduct?.brand_id,
        vendor_id: databaseProduct?.vendor_id,
        unitPrice: databaseProduct?.unitPrice,
        purchasingPrice: databaseProduct?.purchasingPrice
      }

      // IF EVENT TYPE IS DELETE
      if (payload.action === 'delete') {
        // THEN CHECK IF PRODUCT IS IN PRODUCTS LIST
        if (ProductsList?.[product.id]) {
          // IF YES THEN DELETE THE PRODUCT
          delete ProductsList[product.id]
        }
      }
      // IF PRODUCT IS EDITED OR INSERTED
      else if (payload.action === 'create' || payload.action === 'update') {
        // UPDATE THE PRODUCT IN THE PRODUCTS LIST
        updateProductInList(product)
      }
    })
  }

  /**
   * Function to get the products from pocketbase
   */
  const getProducts = () => {
    // GET THE PRODUCT IN THE PRODUCTS TABLE IN POCKETBASE
    api.Products.get().then((items: any) => {
      if (items?.length > 0) {
        items.forEach((product: ProductItem) => {
          ProductsList[product.id] = product
        })
      }
    })
  }

  /**
   * Function for updating Product in the Product List
   * @param product
   */
  const updateProductInList = (product: ProductItem) => {
    // ADD THE PRODUCT IN THE PRODUCTS LIST

    if (product?.id) {
      ProductsList[product.id] = product
    }
  }

  /**
   * FUNCTION TO UPDATE THE PRODUCT IN POCKETBASE AND PRODUCT LIST
   * @param product
   */
  const updateProduct = (product: ProductItem) => {
    // ADD THE PRODUCT IN THE PRODUCTS LIST
    updateProductInList(product)

    // INSERT THE PRODUCT IN THE PRODUCTS TABLE IN POCKETBASE
    api.Products.upsert(product).then((response: any) => {})
  }

  /**
   * FUNCTION TO UPDATE THE PRODUCT
   * @param product
   */
  const updateMultipleProducts = (products: Array<ProductItem>) => {
    // INSERT THE PRODUCT IN THE PRODUCTS TABLE IN POCKETBASE

    products.map((product: ProductItem) =>
      api.Products.upsert(product).then((response: any) => {
        console.log(response)
      })
    )
  }

  /**
   * Function for deleting a product from the list of products
   * @param product
   */
  const deleteProduct = (product: ProductItem) => {
    // DELETE THE PRODUCT FROM THE PRODUCTS LIST
    delete ProductsList[product.id]

    // INSERT THE PRODUCT IN THE PRODUCTS TABLE IN POCKETBASE
    api.Products.delete(product.id).then((response: any) => {})
  }

  // GET THE PRODUCTS FROM THE PRODUCTS TABLE IN POCKETBASE
  return {
    Products,
    ProductsList,
    getProducts,
    updateProduct,
    updateProductInList,
    updateMultipleProducts,
    deleteProduct,
    subscribeToProductsTable
  }
}
