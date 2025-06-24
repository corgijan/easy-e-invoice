import { generateCrossIndustryInvoiceXml } from '../src/generateCrossIndustryInvoiceXml'
import {EInvoice} from "../src/types/convertEInvoiceToCII";
import {simpleConvertEInvoiceToCII} from "../src/simpleConvertEInvoiceToCII";

test('simpleEInvoiceTest', () => {
  const fullprice = 100 // Assuming a static full price, might need to be dynamic
  const tax_amount = 0.19

  const supplier = {
    name: 'Musterfirma GmbH',
    country: 'DE',
    street: 'Musterstraße 2',
    postalCode: '78713',
    city: 'Schramberg',
    taxNumber: 'USTID2', // Assuming a static tax number, might need to be dynamic,
  }

  const customer = {
    name: 'Max Mustermann',
    country: 'DE', // Assuming Germany, might need to be dynamic
    street: 'Musterstraße 1',
    postalCode: '12345',
    city: 'Musterstadt',
    taxNumber: 'USTID1',
  }

  let items = [
    {
      quantity: 1,
      id: 'ID',
      description: 'Thing',
      unitPrice: 10,
      billedUnitName: 'Stück',
      name: 'Test Item',
      lineTotal: 100,
    },
  ]

  const einvoice: EInvoice = {
    id: '1234567890', // Assuming a static ID, might need to be dynamic
    issueDate: '20200201',
    currency: 'EUR',
    totalAmount: fullprice,
    supplier: supplier,
    customer: customer,
    lineItems: items,
    paymentDetails: {
      paymentMeansCode: '31', // Assuming a static payment means code, might need to be dynamic
      bankDetails: {
        iban: 'DE12500105344470648489890', // Assuming a static IBAN, might need to be dynamic
        bic: 'DRESDEFF10', // Assuming a static BIC, might need to be dynamic
        accountName: 'Account Name', // Assuming a static account name, might need to be dynamic
        bankName: 'Deutsche Bank', // Assuming a static bank name, might need to be dynamic
      },
    },
    taxTotal: {
      taxAmount: fullprice * tax_amount, // Assuming no tax for simplicity, adjust as needed
      taxPercentage: tax_amount, // Assuming no tax for simplicity, adjust as needed}
    },
  }
  // if you read that validate at https://www.epoconsulting.com/einvoice-sap/e-rechnung-viewer
  let result_xml = generateCrossIndustryInvoiceXml(
    simpleConvertEInvoiceToCII(einvoice)
  )
  console.log(result_xml)
})
