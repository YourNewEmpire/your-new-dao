import React, { useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { GraphQLClient, gql } from "graphql-request";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import { ICMSDao } from "../../interfaces/cmscontract";
import AlertCard from "../../components/Cards/AlertCard";
import contractInterface from "../../public/DAO.sol/DAO.json";
import { motion } from "framer-motion";
import axios from "axios";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import useHovered from "../../hooks/useHovered";
import AuthButton from "../../components/Buttons/AuthButton";
const cmsURL = process.env.GRAPH_CMS;
const client = new GraphQLClient(cmsURL ? cmsURL : "");

const Dao = ({ dao }: { dao: ICMSDao }) => {
  //todo - use moralis to get metamask user address and call buyOwnership tx with ethers passing in user address
  //todo - Refactor this for when new chains are added
  //* moralis state/hook
  const { Moralis, authenticate, isAuthenticated, user, network } =
    useMoralis();
  const [formData, setFormData] = useState({
    ownerName: "",
    contractName: "",
  });
  const handleFormChange = (e: any) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(newFormData);
  };
  const { isHovered, onEnter, onLeave } = useHovered(false);
  const [purchaseData, setPurchaseData] = useState({
    error: "",
    loading: false,
    success: "",
  });

  const buyContract = async () => {
    //? Here I am using Ethers.js for user metamask transactions as oppose to Moralis.
    setPurchaseData({ ...purchaseData, loading: true });
    const formattedPrice = Moralis.Units.Token("1", 18);
    //@ts-ignore
    const { ethereum } = window;
    if (!ethereum) {
      return setPurchaseData({
        ...purchaseData,
        loading: false,
        error: "No metamask detected",
      });
    }
    //todo - check for authentication and signer
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    if (!signer)
      return setPurchaseData({
        ...purchaseData,
        loading: false,
        success: "no",
        error: "No signer detected from Metamask",
      });
    const factory = new ethers.ContractFactory(
      contractInterface.abi,
      contractInterface.bytecode,
      signer
    );
    const contract = factory.attach(dao.addressSlug);
    const contractPurchase = await contract.buyOwnership(
      formData.ownerName,
      formData.contractName,
      { value: formattedPrice }
    );
    return await contractPurchase
      .wait()
      .then(() => {
        setPurchaseData({
          ...purchaseData,
          loading: false,
          success: "yes",
          error: "",
        });
      })
      .catch((err: any) => {
        console.log(err);
        setPurchaseData({
          ...purchaseData,
          loading: false,
          success: "no",
          error: "Error when attempting tx: " + err,
        });
      });
  };
  const linkOwner = async () => {
    //? chain param is for validating user ownership in api route
    //? need to check if they are authenticated
    if (!isAuthenticated || !user) {
      await authenticate().then(async () => {
        await axios
          .post("/api/linkAccount", {
            userAddress: user?.get("ethAddress"),
            daoAddress: dao.addressSlug,
            chain: dao.chain,
            version: dao.daoVersion,
          })
          .then((result: any) => {
            console.log(result);
          })
          .catch((err: any) => {
            console.log(err);
          });
      });
    } else {
      await axios
        .post("/api/linkAccount", {
          ownerAddress: user?.get("ethAddress"),
          daoAddress: dao.addressSlug,
          chain: dao.chain,
          version: dao.daoVersion,
        })
        .then((result: any) => {
          //todo - set ui state to notify user of dao link
          console.log(result);
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  };
  return (
    <div className="min-h-screen">
      <div className="flex flex-col items-center justify-center space-y-4 lg:space-y-12 xl:space-y-20">
        {!isAuthenticated && (
          <div className="flex flex-col items-center justify-center space-y-4 lg:space-y-12 xl:space-y-20">
            <AlertCard
              warning
              title="Metamask Auth"
              body="You're needing to authenticate to buy this DAO contract on this frontend. If you do not trust this frontend, you can use PolygonScan."
            />
            <AuthButton />
          </div>
        )}

        <h1 className="lg:text-xl xl:text-3xl text-center font-semibold">
          {dao.addressSlug}
        </h1>

        {isAuthenticated && (
          <div className="flex flex-col items-center justify-center space-y-4 lg:space-y-8 xl:space-y-12">
            <div className="flex flex-row items-center justify-center space-x-4 ">
              <h1 className="lg:text-xl xl:text-3xl text-center font-semibold">
                Fill the contract with your new information
              </h1>
              <div className="flex flex-col items-center  relative">
                <QuestionMarkCircleIcon
                  onMouseEnter={() => onEnter()}
                  onMouseLeave={() => onLeave()}
                  className="rounded-lg hover:cursor-pointer animate-spin w-8 h-8"
                />
                <div
                  className={` ${isHovered ? "opacity-100" : "opacity-0"} 
                  hover:opacity-100
                  p-2 break-words w-72
                  bg-indigo-800 
                  transition-opacity duration-300 
                  absolute bottom-10 
                  text-base lg:text-lg xl:text-xl
                  rounded-lg ring-2 ring-cyan-600 `}
                >
                  The inputs are necessary for new ownership. This will save gas
                  by setting your new owner and dao names at purchase time
                </div>
              </div>
            </div>
            <p className="text-base text-th-accent-warning-medium">
              Ensure your wallet is on{" "}
              <span className="uppercase">{dao.chain}</span> network.{" "}
            </p>

            <input
              onChange={(e) => {
                handleFormChange(e);
              }}
              className=" p-2 text-xl bg-cyan-800 focus:bg-indigo-800 rounded-lg ring-cyan-600 focus:outline-none focus:ring-4"
              type="text"
              name="ownerName"
              id=""
              placeholder="owner nick or real name"
            />
            <input
              onChange={(e) => {
                handleFormChange(e);
              }}
              className="p-2 text-xl bg-cyan-800 focus:bg-indigo-800 rounded-lg ring-cyan-600 focus:outline-none focus:ring-4"
              type="text"
              name="contractName"
              id=""
              placeholder="name of contract"
            />
            {formData.contractName.length > 2 &&
            formData.ownerName.length > 2 ? (
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9, translateY: 2, rotateX: 25, skewX: 3 }}
                onClick={() => buyContract()}
                className="
                p-2 text-xl bg-cyan-600 shadow-md hover:shadow-lg rounded-lg 
                 focus:outline-none"
              >
                Purchase Contract Ownership
              </motion.button>
            ) : (
              <motion.button
                disabled
                className="
                p-2 text-xl bg-cyan-600 shadow-md hover:shadow-lg rounded-lg 
                 focus:outline-none disabled:opacity-40"
              >
                Purchase Contract Ownership
              </motion.button>
            )}
          </div>
        )}
        {purchaseData.loading && (
          <div className="flex flex-row justify-center items-center space-x-2">
            <div className="border-b-2 w-6 h-6 border-cyan-600 rounded-full animate-spinFast"></div>
            <p className="text-center text-base animate-bounce ">
              Attempting TX
            </p>
          </div>
        )}
        {purchaseData.error.length > 1 ? (
          <p className="text-th-accent-failure">{purchaseData.error}</p>
        ) : (
          <p className="text-th-accent-success"> No errors yet!</p>
        )}
        <ul className="list-disc list-inside space-y-6 text-base xl:text-xl">
          <li>
            <a
              rel="noopener noreferrer"
              target="blank"
              className="hover:no-underline underline"
              href={dao.addressUrl + "#code"}
            >
              PolygonScan source code
            </a>
          </li>
          <li>
            <a
              rel="noopener noreferrer"
              target="blank"
              className="hover:no-underline underline"
              href="https://github.com/YourNewEmpire/your-new-dao/blob/main/Hardhat/contracts/DAO.sol"
            >
              GitHub repository source code
            </a>
          </li>
        </ul>
        <div
          id="linkdao"
          className="flex flex-col items-center justify-center lg:space-y-6 xl:space-y-12"
        >
          <AlertCard
            warning
            title="Linking your DAOs"
            body="In order to interact with and manage your DAO here on this frontend, 
        you must link it your account. This will only work if you are an owner on this contract, and you must also be authenticated with your wallet here"
          />
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9, translateY: 2, rotateX: 25, skewX: 3 }}
            className="p-2 text-xl
                bg-cyan-600
                shadow-md hover:shadow-lg rounded-lg 
                ring-cyan-600 focus:outline-none focus:ring-4"
            onClick={() => linkOwner()}
          >
            Link DAO to account
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Dao;

//* Secondly, get info about each path.
export const getStaticProps: GetStaticProps = async ({ params }) => {
  //@ts-ignore
  const slug = params.slug as string;
  const query = gql`
    query Dao($slug: String!) {
      daoContract(where: { addressSlug: $slug }) {
        addressSlug
        addressUrl
        chain
        daoVersion
      }
    }
  `;

  //todo - check that contract is sold and pass data

  //* fetch content from graphcms.
  //todo - fix typing here. check the interfaces
  const data: any = await client.request(query, {
    slug,
  });
  if (!data.daoContract) {
    return {
      notFound: true,
    };
  }

  return {
    props: { dao: data.daoContract },
    revalidate: 60 * 60,
  };
};

//* Firstly, make a path for each project
export const getStaticPaths: GetStaticPaths = async () => {
  const query = gql`
    query Daos {
      daoContracts {
        addressSlug
      }
    }
  `;

  const data = await client.request(query);
  return {
    paths: data.daoContracts.map((dao: ICMSDao) => ({
      params: { slug: dao.addressSlug },
    })),
    fallback: "blocking",
  };
};
