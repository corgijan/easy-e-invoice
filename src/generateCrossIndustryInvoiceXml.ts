import {
  AdditionalReferencedDocument,
  BillingPeriod,
  ContextParameter,
  CrossIndustryInvoice,
  DateTimeString,
  DocumentLine,
  ExchangedDocument,
  ExchangedDocumentContext,
  HeaderMonetarySummation,
  HeaderTradeAgreement,
  HeaderTradeDelivery,
  IncludedNote,
  LegalOrganization,
  LineMonetarySummation,
  PaymentMeans,
  PaymentTerms,
  PostalAddress,
  SpecifiedLineTradeAgreement,
  SpecifiedLineTradeDelivery,
  SpecifiedTradeProduct,
  SupplyChainTradeLineItem,
  TaxRegistration,
  TradeContact,
  TradeParty,
  TradeTax,
  URICommunication,
} from './types/CrossIndustryInvoice'

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
