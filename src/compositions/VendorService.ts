import { reactive, ref, watch } from 'vue'
import type { VendorItem } from '@/interfaces/VendorItem'
import type { VendorListItem } from '@/interfaces/VendorListItem'
import { supabase } from '@/configs/Supabase'

const VendorsList = reactive<Record<VendorListItem['id'], VendorItem>>({})
const Vendors = ref<Array<VendorItem>>([])

watch(
  () => VendorsList,
  () => (Vendors.value = Object.values({ '-1': { id: -1, name: 'No Vendor' }, ...VendorsList })),
  { deep: true }
)

export function useVendors() {
  /**
   * Function for subscribing to vendor table
   */
  const subscribeToVendorsTable = () => {
    const channel = supabase
      .channel('vendors-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Vendors'
        },
        (payload) => {
          const databaseVendor: VendorItem = payload.new as VendorItem

          // CREATE A VENDOR ITEM
          const vendor: VendorItem = {
            id: databaseVendor?.id,
            name: databaseVendor?.name
          }

          // IF EVENT TYPE IS DELETE
          if (payload.eventType === 'DELETE') {
            // THEN CHECK IF Vendor IS IN VENDOR LIST

            if (vendor?.id) {
              if (VendorsList?.[vendor.id]) {
                // IF YES THEN DELETE THE Vendor
                delete VendorsList[vendor.id]
              }
            }
          }
          // IF VENDOR IS EDITED OR INSERTED
          else if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            // UPDATE THE VENDOR IN THE VENDORS LIST
            updateVendorInList(vendor)
            // // SET THE GIT OPTIONS
            // gitrows.options(options)

            // // ADD THE Vendor IN THE GIT ROWS
            // gitrows.put(VendorPath, [payload.new])
          }
        }
      )
      .subscribe()
  }

  /**
   * Function for updating vendor in the Vendors List
   * @param vendor
   */
  const updateVendorInList = (vendor: VendorItem) => {
    // ADD THE VENDOR IN THE VENDORS LIST

    if (vendor.id) {
      VendorsList[vendor.id] = vendor
    }
  }

  const addVendor = (vendor: VendorItem) => {
    console.log(vendor.name, 'ADD')

    // ADD THE VENDOR IN THE VENDORS LIST
    updateVendorInList(vendor)

    const tempVendor = {
      id: vendor?.id,
      name: vendor.name
    }

    // INSERT THE VENDOR IN THE VENDOR TABLE IN SUPABASE
    supabase
      .from('Vendors')
      .upsert(tempVendor)
      .then((response) => {
        console.log(response)
      })
  }

  /**
   * Function to get the vendors from supabase
   */
  const getVendors = () => {
    // GET THE VENDORS IN THE VENDORS TABLE IN SUPABASE
    supabase
      .from('Vendors')
      .select('*')
      .then((response) => {
        if (response?.data) {
          response.data.forEach((vendor: VendorItem) => {
            updateVendorInList(vendor)
          })
        }
      })
  }

  return {
    VendorsList,
    Vendors,
    getVendors,
    subscribeToVendorsTable,
    addVendor
  }
}
