import { reactive, ref, watch } from 'vue'
import type { BrandItem } from '@/interfaces/BrandItem'
import { supabase } from '@/configs/Supabase'
import type { BrandListItem } from '@/interfaces/BrandListItem'

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
    console.log('SUBSC')

    const channel = supabase
      .channel('brands-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Brands'
        },
        (payload) => {
          const databaseBrand: BrandItem = payload.new as BrandItem

          // CREATE A BRAND ITEM
          const brand: BrandItem = {
            id: databaseBrand?.id,
            name: databaseBrand?.name
          }

          // IF EVENT TYPE IS DELETE
          if (payload.eventType === 'DELETE') {
            // THEN CHECK IF PRODUCT IS IN PRODUCTS LIST

            if (brand?.id) {
              if (BrandsList?.[brand.id]) {
                // IF YES THEN DELETE THE PRODUCT
                delete BrandsList[brand.id]
              }
            }
          }
          // IF BRAND IS EDITED OR INSERTED
          else if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            // UPDATE THE BRAND IN THE BRANDS LIST
            updateBrandInList(brand)

            // // SET THE GIT OPTIONS
            // gitrows.options(options)

            // // ADD THE PRODUCT IN THE GIT ROWS
            // gitrows.put(ProductsPath, [payload.new])
          }
        }
      )
      .subscribe()
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

    // INSERT THE BRAND IN THE BRAND TABLE IN SUPABASE
    supabase
      .from('Brands')
      .upsert(tempBrand)
      .then((response) => {
        console.log(response)
      })
  }

  /**
   * Function to get the brands from supabase
   */
  const getBrands = () => {
    // GET THE BRANDS IN THE BRANDS TABLE IN SUPABASE
    supabase
      .from('Brands')
      .select('*')
      .then((response) => {
        if (response?.data) {
          response.data.forEach((brand: BrandItem) => {
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
