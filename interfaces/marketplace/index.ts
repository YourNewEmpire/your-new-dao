import { ICMSDao } from "../cmscontract";
export interface IMarketplace {
    cmsDaos: ICMSDao[];
    contractSaleData: boolean[];
}