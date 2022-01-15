import React from "react";
import { GetServerSideProps } from "next";
import { GraphQLClient, gql } from "graphql-request";
import { ethers } from "ethers";
import ContractCard from "../../components/ContractCard";
import { ICMSDao } from "../../interfaces/cmscontract";
import { IMarketplace } from "../../interfaces/marketplace";

export const getServerSideProps: GetServerSideProps = async () => {
  const cmsURL = process.env.GRAPH_CMS;
  const NODE_URL_MUMBAI = `https://speedy-nodes-nyc.moralis.io/${process.env.MORALIS_NODE}/polygon/mumbai`;
  const client = new GraphQLClient(cmsURL ? cmsURL : "");
  if (!cmsURL || process.env.MORALIS_NODE) {
    return {
      props: {},
    };
  }
  const query = gql`
    query MyQuery {
      daos(orderBy: createdAt_ASC) {
        addressSlug
        addressUrl
      }
    }
  `;

  let contractData: any = {};
  let contractSoldArr: boolean[] = [];
  const contractAbi = ["function contractSold() view returns(bool)"];
  const provider = new ethers.providers.JsonRpcProvider(NODE_URL_MUMBAI);

  async function getSoldData(data: any) {
    for (let i = 0; i <= data.daos.length - 1; i++) {
      console.log(i);
      console.log(data.daos[i].addressSlug);

      const contract = new ethers.Contract(
        data.daos[i].addressSlug,
        contractAbi,
        provider
      );
      await contract
        .contractSold()
        .then((res: any) => contractSoldArr.push(res))
        .catch((err: any) => console.log(err));
    }
  }
  await client
    .request(query)
    .then(async (data: any) => {
      console.log("DATA from CMS" + data);
      contractData = data;
      await getSoldData(data);
      console.log(contractSoldArr);
    })
    .catch((err: any) => console.log(err));

  return {
    props: { cmsDaos: contractData.daos, contractSaleData: contractSoldArr },
  };
};
const Marketplace = ({
  cmsDaos,
  contractSaleData,
}: IMarketplace) => {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col justify-center items-center space-y-24">
        <h1 className="text-6xl text-center font-semibold">marketplace</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-8 xl:gap-14 grid-flow-row">
          {cmsDaos.map((item, index) => (
            <div key={index} >
                <ContractCard cmsDao={item} contractSaleData={contractSaleData[index]} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
