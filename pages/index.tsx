import {
  CakeIcon,
  ClipboardListIcon,
  LightningBoltIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
} from "@heroicons/react/solid";
import type { NextPage } from "next";
import { useMoralis } from "react-moralis";
import AuthButton from "../components/Buttons/AuthButton";
import AlertCard from "../components/Cards/AlertCard";
import InfoCard from "../components/Cards/InfoCard";

const Home: NextPage = () => {
  const { authenticate, isAuthenticated } = useMoralis();
  return (
    <div className="min-h-screen">
      <div className="flex flex-col items-center justify-center space-y-4 lg:space-y-12 xl:space-y-20 text-center ">
        <div>
          <h1 className="text-6xl text-center font-semibold">
            Your New NFT DAO
          </h1>
          <p>A Marketplace of NFT DAOs</p>
        </div>
        <AlertCard
          warning
          title="Wallet Authentication"
          body={
            <div>
              WALLET STATUS:{" "}
              {isAuthenticated ? (
                <p className="text-th-accent-success-medium">CONNECTED</p>
              ) : (
                <p className="text-th-accent-failure-medium">NOT CONNECTED</p>
              )}
            </div>
          }
        />
        {!isAuthenticated && <AuthButton />}

        {/* //todo - Easy todo: add scroll reveal here. Hard todo: Make some flip cards*/}
        <h1 className="text-6xl text-center font-semibold">
          What is Your New NFT DAO?
        </h1>
        <InfoCard
          icon={<ShoppingCartIcon />}
          text="Your New NFTDAO is a marketplace of pre written, pre deployed NFT DAO
          contracts on EVM-compatible chains (currently Polygon)"
        />
        <InfoCard
          icon={<ClipboardListIcon />}
          text="The name 'NFT DAO' comes from the idea of pairing up a voting
          contract with NFTs/SFTs, in particular the ERC-1155 standard. 
          With this concept, NFT creators can manage their NFT contracts,
          while creating new proposals about their project which their NFT owners can vote on."
        />
        <InfoCard
          icon={<LightningBoltIcon />}
          text="The primary purpose of this frontend is to provide the user with a
          fast and smooth experience when managing their NFT DAO contract."
        />

        <h1 className="text-6xl text-center font-semibold">Getting Started</h1>
        <div className="text-left text-xl space-y-4 m-16">
          <p className="">
            1. User purchases a DAO contract from the Marketplace. Metamask will
            ask for 1 MATIC for the payable function, plus the gas fee. User
            will need to provide your owner and project names
          </p>
          <p className="">
            2. Once the User has purchased a DAO, on the same DAO page, the User
            will need to click
            <button
              className="mx-2 p-2 text-xl
                bg-cyan-600
                shadow-md hover:shadow-lg rounded-lg 
                ring-cyan-600 "
            >
              Link DAO to account
            </button>
            in order for the app to remember your DAO(s)
          </p>
          <p className="">
            <span className="line-through">
              3. Once the User has linked their new NFT DAO, they can navigate
              to the YOUR DAOs page and begin interacting with their new DAO.
            </span>{" "}
            Coming soon
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
