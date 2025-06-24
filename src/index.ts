import { generateCrossIndustryInvoiceXml } from '../src/generateCrossIndustryInvoiceXml'
import { EInvoice } from '../src/types/convertEInvoiceToCII'
import { simpleConvertEInvoiceToCII } from '../src/simpleConvertEInvoiceToCII'
import { CrossIndustryInvoice} from "./types/CrossIndustryInvoice";
export * from './types/CrossIndustryInvoice'
export * from './types/convertEInvoiceToCII'
export * from './generateCrossIndustryInvoiceXml'
export * from './simpleConvertEInvoiceToCII'

// XML Generation Function
export function generateEInvoiceXML(einvoice: EInvoice): string {
  return generateCrossIndustryInvoiceXml(simpleConvertEInvoiceToCII(einvoice))
}
