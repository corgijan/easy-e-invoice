import { AdditionalReferencedDocument, BillingPeriod, ContextParameter, CrossIndustryInvoice, DateTimeString, DocumentLine, ExchangedDocument, ExchangedDocumentContext, FinancialAccount, FinancialInstitution, HeaderMonetarySummation, HeaderTradeAgreement, HeaderTradeDelivery, HeaderTradeSettlement, IncludedNote, LegalOrganization, LineMonetarySummation, PaymentMeans, PaymentTerms, PostalAddress, SpecifiedLineTradeAgreement, SpecifiedLineTradeDelivery, SpecifiedLineTradeSettlement, SpecifiedTradeProduct, SupplyChainTradeLineItem, SupplyChainTradeTransaction, TaxRegistration, TradeContact, TradeParty, TradeTax, URICommunication } from "./types/CrossIndustryInvoice"
import { EInvoice } from "./types/Einvoice"

// XML Generation Function

export function generateCrossIndustryInvoiceXml(
  invoice: CrossIndustryInvoice
): string {
  const escapeXml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')

  const renderDateTime = (dt: DateTimeString) =>
    `<udt:DateTimeString format="${escapeXml(dt.format)}">${escapeXml(
      dt.value
    )}</udt:DateTimeString>`

  const renderContextParameter = (param: ContextParameter, tag: string) =>
    `<ram:${tag}><ram:ID>${escapeXml(param.id)}</ram:ID></ram:${tag}>`

  const renderIncludedNotes = (notes: IncludedNote[]) =>
    notes
      .map(
        (note) => `
      <ram:IncludedNote>
        <ram:Content>${escapeXml(note.content)}</ram:Content>
        <ram:SubjectCode>${escapeXml(note.subjectCode)}</ram:SubjectCode>
      </ram:IncludedNote>`
      )
      .join('')

  const renderExchangedDocumentContext = (ctx: ExchangedDocumentContext) => `
    <rsm:ExchangedDocumentContext>
      ${renderContextParameter(
        ctx.businessProcessSpecifiedDocumentContextParameter,
        'BusinessProcessSpecifiedDocumentContextParameter'
      )}
      ${renderContextParameter(
        ctx.guidelineSpecifiedDocumentContextParameter,
        'GuidelineSpecifiedDocumentContextParameter'
      )}
    </rsm:ExchangedDocumentContext>`

  const renderExchangedDocument = (doc: ExchangedDocument) => `
    <rsm:ExchangedDocument>
      <ram:ID>${escapeXml(doc.id)}</ram:ID>
      <ram:TypeCode>${escapeXml(doc.typeCode)}</ram:TypeCode>
      <ram:IssueDateTime>
        ${renderDateTime(doc.issueDateTime)}
      </ram:IssueDateTime>
      ${renderIncludedNotes(doc.includedNotes)}
    </rsm:ExchangedDocument>`

  const renderDocumentLine = (line: DocumentLine) =>
    `<ram:LineID>${escapeXml(line.lineID)}</ram:LineID>`

  const renderSpecifiedTradeProduct = (prod: SpecifiedTradeProduct) => `
    <ram:SpecifiedTradeProduct>
      <ram:SellerAssignedID>${escapeXml(
        prod.sellerAssignedID
      )}</ram:SellerAssignedID>
      <ram:BuyerAssignedID>${escapeXml(
        prod.buyerAssignedID
      )}</ram:BuyerAssignedID>
      <ram:Name>${escapeXml(prod.name)}</ram:Name>
      <ram:Description>${escapeXml(prod.description)}</ram:Description>
    </ram:SpecifiedTradeProduct>`

  const renderSpecifiedLineTradeAgreement = (
    agr: SpecifiedLineTradeAgreement
  ) => `
    <ram:SpecifiedLineTradeAgreement>
      <ram:BuyerOrderReferencedDocument>
        ${renderDocumentLine(agr.buyerOrderReferencedDocument)}
      </ram:BuyerOrderReferencedDocument>
      <ram:NetPriceProductTradePrice>
        <ram:ChargeAmount>${escapeXml(
          agr.netPriceProductTradePrice.chargeAmount
        )}</ram:ChargeAmount>
      </ram:NetPriceProductTradePrice>
    </ram:SpecifiedLineTradeAgreement>`

  const renderSpecifiedLineTradeDelivery = (
    del: SpecifiedLineTradeDelivery
  ) => `
    <ram:SpecifiedLineTradeDelivery>
      <ram:BilledQuantity unitCode="${escapeXml(
        del.billedQuantity.unitCode
      )}">${escapeXml(del.billedQuantity.value)}</ram:BilledQuantity>
    </ram:SpecifiedLineTradeDelivery>`

  const renderTradeTax = (tax: TradeTax) => `
    <ram:ApplicableTradeTax>
      ${
        tax.calculatedAmount
          ? `<ram:CalculatedAmount>${escapeXml(
              tax.calculatedAmount
            )}</ram:CalculatedAmount>`
          : ''
      }
      <ram:TypeCode>${escapeXml(tax.typeCode)}</ram:TypeCode>
      ${
        tax.basisAmount
          ? `<ram:BasisAmount>${escapeXml(tax.basisAmount)}</ram:BasisAmount>`
          : ''
      }
      <ram:CategoryCode>${escapeXml(tax.categoryCode)}</ram:CategoryCode>
      <ram:RateApplicablePercent>${escapeXml(
        tax.rateApplicablePercent
      )}</ram:RateApplicablePercent>
    </ram:ApplicableTradeTax>`

  const renderBillingPeriod = (period: BillingPeriod) => `
    <ram:BillingSpecifiedPeriod>
      ${
        period.startDateTime
          ? `<ram:StartDateTime>${renderDateTime(
              period.startDateTime
            )}</ram:StartDateTime>`
          : ''
      }
      <ram:EndDateTime>${renderDateTime(period.endDateTime)}</ram:EndDateTime>
    </ram:BillingSpecifiedPeriod>`

  const renderLineMonetarySummation = (sum: LineMonetarySummation) => `
    <ram:SpecifiedTradeSettlementLineMonetarySummation>
      <ram:LineTotalAmount>${escapeXml(
        sum.lineTotalAmount
      )}</ram:LineTotalAmount>
    </ram:SpecifiedTradeSettlementLineMonetarySummation>`

  const renderAdditionalReferencedDocument = (
    doc: AdditionalReferencedDocument
  ) => `
    <ram:AdditionalReferencedDocument>
      <ram:IssuerAssignedID>${escapeXml(
        doc.issuerAssignedID
      )}</ram:IssuerAssignedID>
      <ram:TypeCode>${escapeXml(doc.typeCode)}</ram:TypeCode>
    </ram:AdditionalReferencedDocument>`

  const renderSupplyChainTradeLineItem = (item: SupplyChainTradeLineItem) => `
    <ram:IncludedSupplyChainTradeLineItem>
      <ram:AssociatedDocumentLineDocument>
        ${renderDocumentLine(item.associatedDocumentLineDocument)}
      </ram:AssociatedDocumentLineDocument>
      ${renderSpecifiedTradeProduct(item.specifiedTradeProduct)}
      ${renderSpecifiedLineTradeAgreement(item.specifiedLineTradeAgreement)}
      ${renderSpecifiedLineTradeDelivery(item.specifiedLineTradeDelivery)}
      <ram:SpecifiedLineTradeSettlement>
        ${renderTradeTax(item.specifiedLineTradeSettlement.applicableTradeTax)}
        ${renderBillingPeriod(
          item.specifiedLineTradeSettlement.billingSpecifiedPeriod
        )}
        ${renderLineMonetarySummation(
          item.specifiedLineTradeSettlement
            .specifiedTradeSettlementLineMonetarySummation
        )}
        ${renderAdditionalReferencedDocument(
          item.specifiedLineTradeSettlement.additionalReferencedDocument
        )}
      </ram:SpecifiedLineTradeSettlement>
    </ram:IncludedSupplyChainTradeLineItem>`

  const renderLegalOrganization = (org: LegalOrganization) => `
    <ram:SpecifiedLegalOrganization>
      <ram:ID>${escapeXml(org.id)}</ram:ID>
      <ram:TradingBusinessName>${escapeXml(
        org.tradingBusinessName
      )}</ram:TradingBusinessName>
    </ram:SpecifiedLegalOrganization>`

  const renderTradeContact = (c: TradeContact) => `
    <ram:DefinedTradeContact>
      <ram:PersonName>${escapeXml(c.personName)}</ram:PersonName>
      <ram:TelephoneUniversalCommunication>
        <ram:CompleteNumber>${escapeXml(
          c.telephoneUniversalCommunication.uriID
        )}</ram:CompleteNumber>
      </ram:TelephoneUniversalCommunication>
      <ram:EmailURIUniversalCommunication>
        <ram:URIID>${escapeXml(
          c.emailURIUniversalCommunication.uriID
        )}</ram:URIID>
      </ram:EmailURIUniversalCommunication>
    </ram:DefinedTradeContact>`

  const renderPostalAddress = (a: PostalAddress) => `
    <ram:PostalTradeAddress>
      <ram:PostcodeCode>${escapeXml(a.postcodeCode)}</ram:PostcodeCode>
      <ram:LineOne>${escapeXml(a.lineOne)}</ram:LineOne>
      <ram:CityName>${escapeXml(a.cityName)}</ram:CityName>
      <ram:CountryID>${escapeXml(a.countryID)}</ram:CountryID>
      ${
        a.countrySubDivisionName
          ? `<ram:CountrySubDivisionName>${escapeXml(
              a.countrySubDivisionName
            )}</ram:CountrySubDivisionName>`
          : ''
      }
    </ram:PostalTradeAddress>`

  const renderURICommunication = (u: URICommunication, tag: string) => `
    <ram:${tag}>
      <ram:URIID${
        u.schemeID ? ` schemeID="${escapeXml(u.schemeID)}"` : ''
      }>${escapeXml(u.uriID)}</ram:URIID>
    </ram:${tag}>`

  const renderTaxRegistrations = (regs: TaxRegistration[] = []) =>
    regs
      .map(
        (r) => `
    <ram:SpecifiedTaxRegistration>
      <ram:ID schemeID="${escapeXml(r.schemeID)}">${escapeXml(r.id)}</ram:ID>
    </ram:SpecifiedTaxRegistration>`
      )
      .join('')

  const renderTradeParty = (p: TradeParty, tag: string) => `
    <ram:${tag}>
      ${p.id ? `<ram:ID>${escapeXml(p.id)}</ram:ID>` : ''}
      <ram:Name>${escapeXml(p.name)}</ram:Name>
      ${
        p.description
          ? `<ram:Description>${escapeXml(p.description)}</ram:Description>`
          : ''
      }
      ${
        p.specifiedLegalOrganization
          ? renderLegalOrganization(p.specifiedLegalOrganization)
          : ''
      }
      ${p.definedTradeContact ? renderTradeContact(p.definedTradeContact) : ''}
      ${renderPostalAddress(p.postalTradeAddress)}
      ${
        p.uriUniversalCommunication
          ? renderURICommunication(
              p.uriUniversalCommunication,
              'URIUniversalCommunication'
            )
          : ''
      }
      ${renderTaxRegistrations(p.specifiedTaxRegistrations)}
    </ram:${tag}>`

  const renderHeaderTradeAgreement = (h: HeaderTradeAgreement) => `
    <ram:ApplicableHeaderTradeAgreement>
      <ram:BuyerReference>${escapeXml(h.buyerReference)}</ram:BuyerReference>
      ${renderTradeParty(h.sellerTradeParty, 'SellerTradeParty')}
      ${renderTradeParty(h.buyerTradeParty, 'BuyerTradeParty')}
      <ram:SellerOrderReferencedDocument>
        <ram:IssuerAssignedID>${escapeXml(
          h.sellerOrderReferencedDocument.issuerAssignedID
        )}</ram:IssuerAssignedID>
      </ram:SellerOrderReferencedDocument>
      <ram:BuyerOrderReferencedDocument>
        <ram:IssuerAssignedID>${escapeXml(
          h.buyerOrderReferencedDocument.issuerAssignedID
        )}</ram:IssuerAssignedID>
      </ram:BuyerOrderReferencedDocument>
      <ram:ContractReferencedDocument>
        <ram:IssuerAssignedID>${escapeXml(
          h.contractReferencedDocument.issuerAssignedID
        )}</ram:IssuerAssignedID>
      </ram:ContractReferencedDocument>
      ${renderAdditionalReferencedDocument(h.additionalReferencedDocument)}
    </ram:ApplicableHeaderTradeAgreement>`

  const renderHeaderTradeDelivery = (d: HeaderTradeDelivery) => `
    <ram:ApplicableHeaderTradeDelivery>
      ${renderTradeParty(d.shipToTradeParty, 'ShipToTradeParty')}
    </ram:ApplicableHeaderTradeDelivery>`

  const renderPaymentMeans = (pm: PaymentMeans) => `
    <ram:SpecifiedTradeSettlementPaymentMeans>
      <ram:TypeCode>${escapeXml(pm.typeCode)}</ram:TypeCode>
      <ram:PayeePartyCreditorFinancialAccount>
        <ram:IBANID>${escapeXml(
          pm.payeePartyCreditorFinancialAccount.iBANID
        )}</ram:IBANID>
      </ram:PayeePartyCreditorFinancialAccount>
      <ram:PayeeSpecifiedCreditorFinancialInstitution>
        <ram:BICID>${escapeXml(
          pm.payeeSpecifiedCreditorFinancialInstitution.bICID
        )}</ram:BICID>
      </ram:PayeeSpecifiedCreditorFinancialInstitution>
    </ram:SpecifiedTradeSettlementPaymentMeans>`

  const renderPaymentTerms = (pt: PaymentTerms) => `
    <ram:SpecifiedTradePaymentTerms>
      <ram:Description>${escapeXml(pt.description)}</ram:Description>
    </ram:SpecifiedTradePaymentTerms>`

  const renderHeaderMonetarySummation = (s: HeaderMonetarySummation) => {
    return `
    <ram:SpecifiedTradeSettlementHeaderMonetarySummation>
      <ram:LineTotalAmount>${escapeXml(s.lineTotalAmount)}</ram:LineTotalAmount>
      <ram:TaxBasisTotalAmount>${escapeXml(
        s.taxBasisTotalAmount
      )}</ram:TaxBasisTotalAmount>
      <ram:TaxTotalAmount  currencyID="${escapeXml(
        s.taxTotalCurrencyID
      )}">${escapeXml(s.taxTotalAmount)}</ram:TaxTotalAmount>
      <ram:GrandTotalAmount>${escapeXml(
        s.grandTotalAmount
      )}</ram:GrandTotalAmount>
      <ram:DuePayableAmount>${escapeXml(
        s.duePayableAmount
      )}</ram:DuePayableAmount>
    </ram:SpecifiedTradeSettlementHeaderMonetarySummation>`
  }

  // Build the full XML
  let xml = `
<rsm:CrossIndustryInvoice xmlns:rsm="urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100" xmlns:qdt="urn:un:unece:uncefact:data:standard:QualifiedDataType:100" xmlns:ram="urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:100" xmlns:udt="urn:un:unece:uncefact:data:standard:UnqualifiedDataType:100">
  ${renderExchangedDocumentContext(invoice.exchangedDocumentContext)}
  ${renderExchangedDocument(invoice.exchangedDocument)}
  <rsm:SupplyChainTradeTransaction>
    ${invoice.supplyChainTradeTransaction.includedSupplyChainTradeLineItems
      .map(renderSupplyChainTradeLineItem)
      .join('')}
    ${renderHeaderTradeAgreement(
      invoice.supplyChainTradeTransaction.applicableHeaderTradeAgreement
    )}
    ${renderHeaderTradeDelivery(
      invoice.supplyChainTradeTransaction.applicableHeaderTradeDelivery
    )}
    <ram:ApplicableHeaderTradeSettlement>
      <ram:PaymentReference>${escapeXml(
        invoice.supplyChainTradeTransaction.applicableHeaderTradeSettlement
          .paymentReference
      )}</ram:PaymentReference>
      <ram:InvoiceCurrencyCode>${escapeXml(
        invoice.supplyChainTradeTransaction.applicableHeaderTradeSettlement
          .invoiceCurrencyCode
      )}</ram:InvoiceCurrencyCode>
      ${renderPaymentMeans(
        invoice.supplyChainTradeTransaction.applicableHeaderTradeSettlement
          .specifiedTradeSettlementPaymentMeans
      )}
      ${renderTradeTax(
        invoice.supplyChainTradeTransaction.applicableHeaderTradeSettlement
          .applicableTradeTax
      )}
      ${renderBillingPeriod(
        invoice.supplyChainTradeTransaction.applicableHeaderTradeSettlement
          .billingSpecifiedPeriod
      )}
      ${renderPaymentTerms(
        invoice.supplyChainTradeTransaction.applicableHeaderTradeSettlement
          .specifiedTradePaymentTerms
      )}
      ${renderHeaderMonetarySummation(
        invoice.supplyChainTradeTransaction.applicableHeaderTradeSettlement
          .specifiedTradeSettlementHeaderMonetarySummation
      )}
    </ram:ApplicableHeaderTradeSettlement>
  </rsm:SupplyChainTradeTransaction>
</rsm:CrossIndustryInvoice>`
  //remove multiple whitespaces
  return xml
}

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
      basisAmount: inv.totalAmount.toString(),
    } as TradeTax,
    billingSpecifiedPeriod: {
      startDateTime: { format: '102', value: inv.issueDate },
      endDateTime: { format: '102', value: inv.dueDate || inv.issueDate },
    } as BillingPeriod,
    specifiedTradePaymentTerms: {
      description: 'Due upon receipt',
    } as PaymentTerms,
    specifiedTradeSettlementHeaderMonetarySummation: {
      lineTotalAmount: inv.taxTotal.taxAmount.toString(),
      taxBasisTotalAmount: inv.totalAmount.toString(),
      taxTotalAmount: inv.taxTotal.taxAmount.toString(),
      taxTotalCurrencyID: inv.currency || 'EUR',
      grandTotalAmount: (inv.totalAmount + inv.taxTotal.taxAmount).toString(),
      duePayableAmount: (inv.totalAmount + inv.taxTotal.taxAmount).toString(),
    } as HeaderMonetarySummation,
  }
  // 6. Assemble
  const supply: SupplyChainTradeTransaction = {
    includedSupplyChainTradeLineItems: lines,
    applicableHeaderTradeAgreement: agreement,
    applicableHeaderTradeDelivery: delivery,
    applicableHeaderTradeSettlement: settlement,
  }

  let cii: CrossIndustryInvoice = {
    exchangedDocumentContext: ctx,
    exchangedDocument: doc,
    supplyChainTradeTransaction: supply,
  }

  return cii
}
