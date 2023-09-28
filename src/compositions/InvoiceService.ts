import { reactive, ref, watch } from 'vue'
import type { InvoiceItem } from '@/interfaces/InvoiceItem'
import { supabase } from '@/configs/Supabase'
import type { InvoiceListItem } from '@/interfaces/InvoicesListItem'
import { User } from './AuthService'

const InvoicesList = reactive<Record<InvoiceListItem['id'], InvoiceItem>>({})
const Invoices = ref<Array<InvoiceItem>>([])

watch(
  () => InvoicesList,
  () => (Invoices.value = Object.values(InvoicesList)),
  { deep: true }
)

export function useInvoices() {
  /**
   * Function for subscribing to products table
   */
  const subscribeToInvoicesTable = () => {
    const channel = supabase
      .channel('invoices-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Invoices'
        },
        (payload) => {
          const databaseInvoice: InvoiceListItem = payload.new as InvoiceListItem

          // CREATE A INVOICE ITEM
          const invoice: InvoiceListItem = {
            id: databaseInvoice?.id,
            customerName: databaseInvoice?.customerName,
            sellerName: databaseInvoice?.sellerName,
            items: databaseInvoice?.items,
            discount: databaseInvoice?.discount
          }

          // IF EVENT TYPE IS DELETE
          if (payload.eventType === 'DELETE') {
            // THEN CHECK IF PRODUCT IS IN PRODUCTS LIST

            if (invoice?.id) {
              if (InvoicesList?.[invoice.id]) {
                // IF YES THEN DELETE THE PRODUCT
                delete InvoicesList[invoice.id]
              }
            }
          }
          // IF INVOICE IS EDITED OR INSERTED
          else if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            // UPDATE THE INVOICE IN THE INVOICES LIST
            updateInvoiceInList(invoice)
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
   * Function for updating invoice in the Invoices List
   * @param invoice
   */
  const updateInvoiceInList = (invoice: InvoiceItem) => {
    // ADD THE INVOICE IN THE INVOICES LIST

    if (invoice.id) {
      InvoicesList[invoice.id] = invoice
    }
  }

  const addInvoice = (invoice: InvoiceItem) => {
    // ADD THE INVOICE IN THE INVOICES LIST
    updateInvoiceInList(invoice)

    const tempInvoice = {
      id: invoice?.id,
      customerName: invoice.customerName,
      sellerName: User.name,
      discount: invoice.discount,
      items: invoice.items
    }

    console.warn(tempInvoice)

    if (tempInvoice.id === null) delete tempInvoice.id

    // INSERT THE INVOICE IN THE INVOICE TABLE IN SUPABASE
    supabase
      .from('Invoices')
      .upsert(tempInvoice)
      .then((response) => {
        console.log(response)
      })
  }

  /**
   * Function to get the invoices from supabase
   */
  const getInvoices = () => {
    // GET THE INVOICES IN THE INVOICES TABLE IN SUPABASE
    supabase
      .from('Invoices')
      .select('*')
      .then((response) => {
        if (response?.data) {
          response.data.forEach((invoice: InvoiceItem) => {
            updateInvoiceInList(invoice)
          })
        }
      })
  }

  /**
   * Function for deleting a invoices from the list of invoices
   * @param invoice
   */
  const deleteInvoice = (invoice: InvoiceListItem) => {
    console.warn(invoice, 'INVOICE')
    // DELETE THE PRODUCT FROM THE PRODUCTS LIST
    delete InvoicesList[invoice.id]

    // INSERT THE PRODUCT IN THE PRODUCTS TABLE IN SUPABASE
    supabase
      .from('Invoices')
      .delete()
      .eq('id', invoice.id)
      .then((response) => {
        console.warn(response)
      })
  }

  return {
    InvoicesList,
    Invoices,
    getInvoices,
    deleteInvoice,
    subscribeToInvoicesTable,
    addInvoice
  }
}
