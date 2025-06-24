export interface CrossIndustryInvoice {
  exchangedDocumentContext: ExchangedDocumentContext
  exchangedDocument: ExchangedDocument
  supplyChainTradeTransaction: SupplyChainTradeTransaction
}

export interface ExchangedDocumentContext {
  businessProcessSpecifiedDocumentContextParameter: ContextParameter
  guidelineSpecifiedDocumentContextParameter: ContextParameter
}

export interface ContextParameter {
  id: string
}

export interface ExchangedDocument {
  id: string
  typeCode: string
  issueDateTime: DateTimeString
  includedNotes: IncludedNote[]
}

export interface DateTimeString {
  format: string
  value: string
}

export interface IncludedNote {
  content: string
  subjectCode: string
}

export interface SupplyChainTradeTransaction {
  includedSupplyChainTradeLineItems: SupplyChainTradeLineItem[]
  applicableHeaderTradeAgreement: HeaderTradeAgreement
  applicableHeaderTradeDelivery: HeaderTradeDelivery
  applicableHeaderTradeSettlement: HeaderTradeSettlement
}

export interface SupplyChainTradeLineItem {
  associatedDocumentLineDocument: DocumentLine
  specifiedTradeProduct: SpecifiedTradeProduct
  specifiedLineTradeAgreement: SpecifiedLineTradeAgreement
  specifiedLineTradeDelivery: SpecifiedLineTradeDelivery
  specifiedLineTradeSettlement: SpecifiedLineTradeSettlement
}

export interface DocumentLine {
  lineID: string
}

export interface SpecifiedTradeProduct {
  sellerAssignedID: string
  buyerAssignedID: string
  name: string
  description: string
}

export interface SpecifiedLineTradeAgreement {
  buyerOrderReferencedDocument: DocumentLine
  netPriceProductTradePrice: NetPriceProductTradePrice
}

export interface NetPriceProductTradePrice {
  chargeAmount: string
}

export interface SpecifiedLineTradeDelivery {
  billedQuantity: BilledQuantity
}

export interface BilledQuantity {
  unitCode: string
  value: string
}

export interface SpecifiedLineTradeSettlement {
  applicableTradeTax: TradeTax
  billingSpecifiedPeriod: BillingPeriod
  specifiedTradeSettlementLineMonetarySummation: LineMonetarySummation
  additionalReferencedDocument: AdditionalReferencedDocument
}

export interface TradeTax {
  typeCode: string
  categoryCode: string
  rateApplicablePercent: string
  calculatedAmount: string
  basisAmount?: string
}

export interface BillingPeriod {
  startDateTime?: DateTimeString
  endDateTime: DateTimeString
}

export interface LineMonetarySummation {
  lineTotalAmount: string
}

export interface AdditionalReferencedDocument {
  issuerAssignedID: string
  typeCode: string
}

export interface HeaderTradeAgreement {
  buyerReference: string
  sellerTradeParty: TradeParty
  buyerTradeParty: TradeParty
  sellerOrderReferencedDocument: SimpleDocument
  buyerOrderReferencedDocument: SimpleDocument
  contractReferencedDocument: SimpleDocument
  additionalReferencedDocument: AdditionalReferencedDocument
}

export interface SimpleDocument {
  issuerAssignedID: string
}

export interface TradeParty {
  id?: string
  name: string
  description?: string
  specifiedLegalOrganization?: LegalOrganization
  definedTradeContact?: TradeContact
  postalTradeAddress: PostalAddress
  uriUniversalCommunication?: URICommunication
  specifiedTaxRegistrations?: TaxRegistration[]
}

export interface LegalOrganization {
  id: string
  tradingBusinessName: string
}

export interface TradeContact {
  personName: string
  telephoneUniversalCommunication: URICommunication
  emailURIUniversalCommunication: URICommunication
}

export interface PostalAddress {
  postcodeCode: string
  lineOne: string
  cityName: string
  countryID: string
  countrySubDivisionName?: string
}

export interface URICommunication {
  uriID: string
  schemeID?: string
}

export interface TaxRegistration {
  id: string
  schemeID: string
}

export interface HeaderTradeDelivery {
  shipToTradeParty: TradeParty
}

export interface HeaderTradeSettlement {
  paymentReference: string
  invoiceCurrencyCode: string
  specifiedTradeSettlementPaymentMeans: PaymentMeans
  applicableTradeTax: TradeTax
  billingSpecifiedPeriod: BillingPeriod
  specifiedTradePaymentTerms: PaymentTerms
  specifiedTradeSettlementHeaderMonetarySummation: HeaderMonetarySummation
}

export interface PaymentMeans {
  typeCode: string
  payeePartyCreditorFinancialAccount: FinancialAccount
  payeeSpecifiedCreditorFinancialInstitution: FinancialInstitution
}

export interface FinancialAccount {
  iBANID: string
}

export interface FinancialInstitution {
  bICID: string
}

export interface PaymentTerms {
  description: string
}

export interface HeaderMonetarySummation {
  lineTotalAmount: string
  taxBasisTotalAmount: string
  taxTotalAmount: string
  taxTotalCurrencyID: string
  grandTotalAmount: string
  duePayableAmount: string
}
