import { reactive, ref, watch } from 'vue'
import type { VendorItem } from '@/interfaces/VendorItem'
import type { VendorListItem } from '@/interfaces/VendorListItem'
import { api } from '@/configs/Pocketbase'

const VendorsList = reactive<Record<VendorListItem['id'], VendorItem>>({})
const Vendors = ref<Array<VendorItem>>([])

watch(
  () => VendorsList,
  () => (Vendors.value = Object.values({ '-1': { id: '-1', name: 'No Vendor' }, ...VendorsList })),
  { deep: true }
)

export function useVendors() {
  /**
   * Function for subscribing to vendor table
   */
  const subscribeToVendorsTable = () => {
    api.Vendors.subscribe((payload) => {
      const databaseVendor: VendorItem = payload.record as VendorItem

      // CREATE A VENDOR ITEM
      const vendor: VendorItem = {
        id: databaseVendor?.id,
        name: databaseVendor?.name
      }

      // IF EVENT TYPE IS DELETE
      if (payload.action === 'delete') {
        // THEN CHECK IF Vendor IS IN VENDOR LIST

        if (vendor?.id) {
          if (VendorsList?.[vendor.id]) {
            // IF YES THEN DELETE THE Vendor
            delete VendorsList[vendor.id]
          }
        }
      }
      // IF VENDOR IS EDITED OR INSERTED
      else if (payload.action === 'create' || payload.action === 'update') {
        // UPDATE THE VENDOR IN THE VENDORS LIST
        updateVendorInList(vendor)
      }
    })
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
    // ADD THE VENDOR IN THE VENDORS LIST
    updateVendorInList(vendor)

    const tempVendor = {
      id: vendor?.id,
      name: vendor.name
    }

    // INSERT THE VENDOR IN THE VENDOR TABLE IN POCKETBASE
    api.Vendors.upsert(tempVendor).then((response) => {
      console.log(response)
    })
  }

  /**
   * Function to get the vendors from pocketbase
   */
  const getVendors = () => {
    // GET THE VENDORS IN THE VENDORS TABLE IN POCKETBASE
    api.Vendors.get().then((items: any) => {
      if (items?.length > 0) {
        items.forEach((vendor: VendorItem) => {
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
