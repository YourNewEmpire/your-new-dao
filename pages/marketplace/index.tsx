import React from "react";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { GraphQLClient, gql } from "graphql-request";
import { ethers } from "ethers";
import { ICMSDao } from "../../interfaces/cmscontract";
export const getServerSideProps: GetServerSideProps = async () => {
  const cmsURL = process.env.GRAPH_CMS;
  const NODE_URL_MUMBAI = `https://speedy-nodes-nyc.moralis.io/${process.env.MORALIS_NODE}/polygon/mumbai`;
  const client = new GraphQLClient(cmsURL ? cmsURL : "");
  if (!cmsURL) {
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

  //todo - Call contractSold getter on contract and pass data to props
  return {
    props: { cmsDaos: contractData.daos, contractSaleData: contractSoldArr },
  };
};
const Marketplace = ({
  cmsDaos,
  contractSaleData,
}: {
  cmsDaos: ICMSDao[];
  contractSaleData: boolean[];
}) => {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col justify-center items-center space-y-24">
        <h1 className="text-6xl text-center font-semibold">marketplace</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-8 xl:gap-14 grid-flow-row">
          {cmsDaos.map((item, index) => (
            <div key={index} className="rounded-lg ring-4 ring-cyan-600">
              <div className="m-4 lg:space-y-2 xl:space-y-4 text-lg  text-center">
                <h1 className=" overflow-hidden overflow-ellipsis">
                  {item.addressSlug}
                </h1>

                <h1
                  className={`
  
                  ${
                    contractSaleData[index]
                      ? " text-orange-500"
                      : "text-teal-500"
                  }`}
                >
                  {" "}
                  {contractSaleData[index]
                    ? "Contract Sold"
                    : "Contract Available"}
                </h1>
              </div>

              <div className="rounded-lg flex flex-row items-end justify-center text-xl text-center">
                <a
                  rel="noopener noreferrer"
                  target="blank"
                  href={item.addressUrl}
                  className=" w-1/2 flex flex-row justify-center items-center rounded-tr-md rounded-bl-md transition duration-300 ease-in-out hover:bg-cyan-800"
                >
                  <p> View On PolygonScan</p>{" "}
                </a>
                <Link href={`/marketplace/${item.addressSlug}`}>
                  <a className="w-1/2 flex flex-row justify-center items-center rounded-tl-md rounded-br-md transition duration-300 ease-in-out hover:bg-cyan-800">
                    View Here
                  </a>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
