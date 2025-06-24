import { EInvoice } from './types/convertEInvoiceToCII'
import {
  AdditionalReferencedDocument,
  BillingPeriod,
  CrossIndustryInvoice,
  DocumentLine,
  ExchangedDocument,
  ExchangedDocumentContext,
  FinancialAccount,
  FinancialInstitution,
  HeaderMonetarySummation,
  HeaderTradeAgreement,
  HeaderTradeDelivery,
  HeaderTradeSettlement,
  IncludedNote,
  LineMonetarySummation,
  PaymentMeans,
  PaymentTerms,
  PostalAddress,
  SpecifiedLineTradeAgreement,
  SpecifiedLineTradeDelivery,
  SpecifiedLineTradeSettlement,
  SpecifiedTradeProduct,
  SupplyChainTradeLineItem,
  SupplyChainTradeTransaction,
  TradeParty,
  TradeTax,
} from './types/CrossIndustryInvoice'

export function simpleConvertEInvoiceToCII(
  inv: EInvoice
): CrossIndustryInvoice {
  // 1. Context
  const ctx: ExchangedDocumentContext = {
    businessProcessSpecifiedDocumentContextParameter: {
      id: 'urn:fdc:peppol.eu:2017:poacc:billing:01:1.0',
    },
    guidelineSpecifiedDocumentContextParameter: {
      id: 'urn:cen.eu:en16931:2017#compliant',
    },
  }

  // 2. Document
  const doc: ExchangedDocument = {
    id: inv.id,
    typeCode: '380',
    issueDateTime: { format: '102', value: inv.issueDate },
    includedNotes: (inv.notes || []).map(
      (n): IncludedNote => ({ content: n, subjectCode: 'NOTE' })
    ),
  }

  // 3. Line items
  const lines: SupplyChainTradeLineItem[] = inv.lineItems.map(
    (item): SupplyChainTradeLineItem => ({
      associatedDocumentLineDocument: { lineID: item.id } as DocumentLine,
      specifiedTradeProduct: {
        sellerAssignedID: item.id,
        buyerAssignedID: item.id,
        name: item.name,
        description: item.description,
      } as SpecifiedTradeProduct,
      specifiedLineTradeAgreement: {
        buyerOrderReferencedDocument: { lineID: '' } as DocumentLine,
        netPriceProductTradePrice: {
          chargeAmount: (
            item.unitPrice *
            (1 - inv.taxTotal.taxPercentage)
          ).toString(),
        },
      } as SpecifiedLineTradeAgreement,
      specifiedLineTradeDelivery: {
        billedQuantity: {
          unitCode: 'C62',
          value: item.quantity.toString(),
        },
      } as SpecifiedLineTradeDelivery,
      specifiedLineTradeSettlement: {
        applicableTradeTax: {
          typeCode: 'VAT',
          categoryCode: 'S',
          rateApplicablePercent: inv.taxTotal.taxPercentage.toString(),
        } as TradeTax,
        billingSpecifiedPeriod: {
          endDateTime: {
            format: '102',
            value: inv.dueDate || inv.issueDate,
          },
        } as BillingPeriod,
        specifiedTradeSettlementLineMonetarySummation: {
          lineTotalAmount: item.lineTotal.toString(),
        } as LineMonetarySummation,
        additionalReferencedDocument: {
          issuerAssignedID: '',
          typeCode: '',
        } as AdditionalReferencedDocument,
      } as SpecifiedLineTradeSettlement,
    })
  )

  // 4. Parties helper
  const makeParty = (
    name: string,
    country: string,
    street = '',
    postal = '',
    city = '',
    taxNo?: string
  ): TradeParty =>
    ({
      name,
      postalTradeAddress: {
        postcodeCode: postal,
        lineOne: street,
        cityName: city,
        countryID: country,
      } as PostalAddress,
      specifiedTaxRegistrations: taxNo ? [{ id: taxNo, schemeID: 'VA' }] : [],
    } as TradeParty)

  const seller = makeParty(
    inv.supplier.name,
    inv.supplier.country,
    inv.supplier.street || '',
    inv.supplier.postalCode || '',
    inv.supplier.city || '',
    inv.supplier.taxNumber
  )
  const buyer = makeParty(
    inv.customer.name,
    inv.customer.country,
    inv.customer.street || '',
    inv.customer.postalCode || '',
    inv.customer.city || '',
    inv.customer.taxNumber
  )

  // 5. Header agreement, delivery, settlement
  const agreement: HeaderTradeAgreement = {
    buyerReference: inv.customer.name,
    sellerTradeParty: seller,
    buyerTradeParty: buyer,
    sellerOrderReferencedDocument: { issuerAssignedID: '' },
    buyerOrderReferencedDocument: { issuerAssignedID: '' },
    contractReferencedDocument: { issuerAssignedID: '' },
    additionalReferencedDocument: { issuerAssignedID: '', typeCode: '' },
  }

  const delivery: HeaderTradeDelivery = {
    shipToTradeParty: buyer,
  }

  const payMeans: PaymentMeans = {
    typeCode: inv.paymentDetails?.paymentMeansCode || '31',
    payeePartyCreditorFinancialAccount: {
      iBANID: inv.paymentDetails?.bankDetails.iban || '',
    } as FinancialAccount,
    payeeSpecifiedCreditorFinancialInstitution: {
      bICID: inv.paymentDetails?.bankDetails.bic || '',
    } as FinancialInstitution,
  }

  const settlement: HeaderTradeSettlement = {
    paymentReference: inv.id,
    invoiceCurrencyCode: inv.currency,
    specifiedTradeSettlementPaymentMeans: payMeans,
    applicableTradeTax: {
      typeCode: 'VAT',
      categoryCode: 'S',
      rateApplicablePercent: inv.taxTotal.taxPercentage.toString(),
      calculatedAmount: inv.taxTotal.taxAmount.toString(),
      basisAmount: inv.totalNetPrice.toString(),
    } as TradeTax,
    billingSpecifiedPeriod: {
      startDateTime: { format: '102', value: inv.issueDate },
      endDateTime: { format: '102', value: inv.dueDate || inv.issueDate },
    } as BillingPeriod,
    specifiedTradePaymentTerms: {
      description: 'Due upon receipt',
    } as PaymentTerms,
    specifiedTradeSettlementHeaderMonetarySummation: {
      lineTotalAmount: inv.totalNetPrice.toString(),
      taxBasisTotalAmount: inv.totalNetPrice.toString(),
      taxTotalAmount: inv.taxTotal.taxAmount.toString(),
      taxTotalCurrencyID: inv.currency || 'EUR',
      grandTotalAmount: (inv.totalNetPrice + inv.taxTotal.taxAmount).toString(),
      duePayableAmount: (inv.totalNetPrice + inv.taxTotal.taxAmount).toString(),
    } as HeaderMonetarySummation,
  }
  // 6. Assemble
  const supply: SupplyChainTradeTransaction = {
    includedSupplyChainTradeLineItems: lines,
    applicableHeaderTradeAgreement: agreement,
    applicableHeaderTradeDelivery: delivery,
    applicableHeaderTradeSettlement: settlement,
  }

  const cii: CrossIndustryInvoice = {
    exchangedDocumentContext: ctx,
    exchangedDocument: doc,
    supplyChainTradeTransaction: supply,
  }

  return cii
}
