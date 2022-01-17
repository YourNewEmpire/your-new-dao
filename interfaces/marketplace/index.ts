import { ICMSDao } from "../cmscontract";

export type IContractSaleData = {
    contractSoldArr: boolean[]
    contractPriceArr: string[]
}
export type IContractChainData ={
    contractMaticData: IContractSaleData
    contractMumbaiData: IContractSaleData
}
export interface IMarketplace {
    daoContracts: ICMSDao[]

    contractSaleData: IContractChainData;
}