import { reactive, ref, watch } from 'vue'
import type { BrandItem } from '@/interfaces/BrandItem'
import type { BrandListItem } from '@/interfaces/BrandListItem'
import { api } from '@/configs/Pocketbase'

const BrandsList = reactive<Record<BrandListItem['id'], BrandItem>>({})
const Brands = ref<Array<BrandItem>>([])

watch(
  () => BrandsList,
  () => (Brands.value = Object.values({ '-1': { id: -1, name: 'No Brand' }, ...BrandsList })),
  { deep: true }
)

export function useBrands() {
  /**
   * Function for subscribing to products table
   */
  const subscribeToBrandsTable = () => {
    api.Brands.subscribe((payload) => {
      const databaseBrand: BrandItem = payload.record as BrandItem

      // CREATE A BRAND ITEM
      const brand: BrandItem = {
        id: databaseBrand?.id,
        name: databaseBrand?.name
      }

      // IF EVENT TYPE IS DELETE
      if (payload.action === 'delete') {
        // THEN CHECK IF PRODUCT IS IN PRODUCTS LIST

        if (brand?.id) {
          if (BrandsList?.[brand.id]) {
            // IF YES THEN DELETE THE PRODUCT
            delete BrandsList[brand.id]
          }
        }
      }
      // IF BRAND IS EDITED OR INSERTED
      else if (payload.action === 'create' || payload.action === 'update') {
        // UPDATE THE BRAND IN THE BRANDS LIST
        updateBrandInList(brand)
      }
    })
  }

  /**
   * Function for updating brand in the Brands List
   * @param brand
   */
  const updateBrandInList = (brand: BrandItem) => {
    // ADD THE BRAND IN THE BRANDS LIST

    if (brand.id) {
      BrandsList[brand.id] = brand
    }
  }

  const addBrand = (brand: BrandItem) => {
    // ADD THE BRAND IN THE BRANDS LIST
    updateBrandInList(brand)

    const tempBrand = {
      id: brand?.id,
      name: brand.name
    }

    // INSERT THE BRAND IN THE BRAND TABLE IN POCKETBASE
    api.Brands.upsert(tempBrand).then((response) => {
      console.log(response)
    })
  }

  /**
   * Function to get the brands from pocketbase
   */
  const getBrands = () => {
    // GET THE BRANDS IN THE BRANDS TABLE IN POCKETBASE
    api.Brands.get().then((items: any) => {
      if (items?.length > 0) {
        items.forEach((brand: BrandItem) => {
          updateBrandInList(brand)
        })
      }
    })
  }

  return {
    BrandsList,
    Brands,
    getBrands,
    subscribeToBrandsTable,
    addBrand
  }
}
