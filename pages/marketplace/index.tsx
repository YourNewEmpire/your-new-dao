import React from "react";
import { GetServerSideProps } from "next";
import { GraphQLClient, gql } from "graphql-request";
import { ethers } from "ethers";
import { IMarketplace, IContractSaleData } from "../../interfaces/marketplace";
import ContractCard from "../../components/Cards/ContractCard";
import AlertCard from "../../components/Cards/AlertCard";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
export const getServerSideProps: GetServerSideProps = async () => {
  const NODE_URL_MATIC = `https://rpc-mainnet.maticvigil.com/v1/${process.env.MATIC_NODE}`;
  const NODE_URL_MUMBAI = `https://rpc-mumbai.maticvigil.com/v1/${process.env.MATIC_NODE}`;
  const cmsURL = process.env.GRAPH_CMS;
  const client = new GraphQLClient(cmsURL ? cmsURL : "");
  const query = gql`
    query MyQuery {
      daoContracts(orderBy: createdAt_ASC) {
        addressSlug
        addressUrl
        chain
        daoVersion
      }
    }
  `;

  let contractData: any = {};

  let contractMaticData: IContractSaleData = {
    contractSoldArr: [],
    contractPriceArr: [],
  };
  let contractMumbaiData: IContractSaleData = {
    contractSoldArr: [],
    contractPriceArr: [],
  };
  const contractAbi = [
    "function contractSold() view returns(bool)",
    "function salePrice() view returns(uint256)",
  ];
  const maticProvider = new ethers.providers.JsonRpcProvider(NODE_URL_MATIC);
  const mumbaiProvider = new ethers.providers.JsonRpcProvider(NODE_URL_MUMBAI);

  async function getSoldData(data: any) {
    const maticArray = data.daoContracts.filter(
      (dao: any) => dao.chain === "matic"
    );
    const mumbaiArray = data.daoContracts.filter(
      (dao: any) => dao.chain === "mumbai"
    );

    for (let i = 0; i <= mumbaiArray.length - 1; i++) {
      const contract = new ethers.Contract(
        mumbaiArray[i].addressSlug,
        contractAbi,
        mumbaiProvider
      );
      await contract
        .contractSold()
        .then((res: any) => contractMumbaiData.contractSoldArr.push(res))
        .catch((err: any) => console.log(err));
      await contract
        .salePrice()
        .then((res: any) =>
          contractMumbaiData.contractPriceArr.push(
            ethers.utils.formatEther(res)
          )
        )
        .catch((err: any) => console.log(err));
    }
    for (let i = 0; i <= maticArray.length - 1; i++) {
      const contract = new ethers.Contract(
        maticArray[i].addressSlug,
        contractAbi,
        maticProvider
      );
      await contract
        .contractSold()
        .then((res: any) => contractMaticData.contractSoldArr.push(res))
        .catch((err: any) => console.log(err));
      await contract
        .salePrice()
        .then((res: any) =>
          contractMaticData.contractPriceArr.push(ethers.utils.formatEther(res))
        )
        .catch((err: any) => console.log(err));
    }
  }

  //? After the CMS query, pass response into getSoldData to check if contract is sold.
  await client
    .request(query)
    .then(async (data: any) => {
      contractData = data;
      await getSoldData(data);
    })
    .catch((err: any) => console.log(err));

  return {
    props: {
      daoContracts: contractData.daoContracts,
      contractSaleData: { contractMaticData, contractMumbaiData },
    },
  };
};
const Marketplace = ({ daoContracts, contractSaleData }: IMarketplace) => {
  //todo - could do this in the server side instead
  const maticArray = daoContracts.filter((dao) => dao.chain === "matic");
  const mumbaiArray = daoContracts.filter((dao) => dao.chain === "mumbai");
  return (
    <div className="min-h-screen">
      <div className="flex flex-col justify-center items-center space-y-24">
        <h1 className="text-6xl text-center font-semibold">Marketplace</h1>
        <AlertCard
          info
          title="Important"
          icon={<ExclamationCircleIcon className="w-10 h-10" />}
          body="
        Please note that this project is currently on Polygon Mainnet/Mumbai 
        and I am planning to launch on other EVM L2 chains in the future, avoiding L1 for the foreseeable.
        You can choose from testnet or mainnet contracts. Contracts on both will be valued at 0.1 matic for now.
        "
        />
        <div
          id="maticdaos"
          className="flex flex-col items-center justify-center"
        >
          <h1 className="text-center text-3xl xl:text-6xl ">Matic Contracts</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-8 xl:gap-14 grid-flow-row">
            {maticArray.map((item, index) => (
              <div key={index}>
                <ContractCard
                  cmsDao={item}
                  contractSold={
                    contractSaleData.contractMaticData.contractSoldArr[index]
                  }
                  contractPrice={
                    contractSaleData.contractMaticData.contractPriceArr[index]
                  }
                />
              </div>
            ))}
          </div>
        </div>
        <div
          id="mumbaidaos"
          className="flex flex-col items-center justify-center"
        >
          <h1 className="text-center text-3xl xl:text-6xl ">
            Mumbai Contracts
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-8 xl:gap-14 grid-flow-row">
            {mumbaiArray.map((item, index) => (
              <div key={index}>
                <ContractCard
                  cmsDao={item}
                  contractSold={
                    contractSaleData.contractMumbaiData.contractSoldArr[index]
                  }
                  contractPrice={
                    contractSaleData.contractMumbaiData.contractPriceArr[index]
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
