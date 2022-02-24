import React, { useEffect, useState } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import AuthButton from "../components/Buttons/AuthButton";
import AlertCard from "../components/Cards/AlertCard";
import Dropdown from "../components/Dropdown";
import UserDao from "../components/UserDao";
import { IUserDao } from "../interfaces/userdao";
const serverUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;
const appId = process.env.NEXT_PUBLIC_MORALIS_APP_ID;

const YourDaos = () => {
  const { Moralis, isAuthenticated, user } = useMoralis();
  const [userDaos, setDaos] = useState<IUserDao[]>([]);
  const [daoAddrArray, setDaoAddrArray] = useState<string[]>([]);
  const [selectedDaoAddr, setSelectedDaoAddr] = useState("");
  const [selectedDao, setSelectedDao] = useState<IUserDao>();

  useEffect(() => {
    Moralis.start({ serverUrl, appId });
    const LinkedDaos = Moralis.Object.extend("LinkedDaos");
    const query = new Moralis.Query(LinkedDaos);
    query.equalTo("ownerAddress", user?.get("ethAddress"));
    const getResults = async () => {
      await query
        .find()
        .then((results) => {
          let newDaosArray: IUserDao[] = [];
          for (let i = 0; i < results.length; i++) {
            const object = results[i];
            const newDaoObj = {
              address: object.get("daoAddress"),
              version: object.get("version"),
              chain: object.get("chain"),
            };
            newDaosArray.push(newDaoObj);
          }
          setDaos(newDaosArray);
        })
        .catch((err) => {
          console.log("Error from query on yourdaos page:" + err);
        });
    };
    getResults();
    return () => {
      query.cancel;
    };
  }, [user, Moralis]);
  if (!isAuthenticated)
    return (
      <div className="min-h-screen">
        <div className="flex flex-col items-center justify-center space-y-4 lg:space-y-12 xl:space-y-20 text-center ">
          <div>
            <h1 className="text-6xl text-center font-semibold">Your New Dao</h1>
            <p>A Marketplace of DAOs</p>
          </div>
          <AlertCard
            failure
            title="Wallet Authentication"
            body="You need to authenticate with a wallet to view and interact with your DAOs"
          />
          <AuthButton />
        </div>
      </div>
    );
  return (
    <div className="min-h-screen ">
      <h1 className="lg:text-xl xl:text-3xl text-center font-semibold">
        Manage Your DAOs
      </h1>
      <AlertCard
        warning
        title="NFTs are under development"
        body="Currently, the DAO owners cannot mint NFTs, nor manage metadata as easy as we'd all like. 
      I have set up functionality for managing tokenIDs, 
      where a token string name like COINS or BASICARMOUR points to a token ID for the contract to know which ID to mint, 
      as there are multiple tokens in EIP 1155. 
      With this, the owner just needs to know the token string name, amount and the receiver of the mint. 
      However, at this time there is no abstracted mint functionality for owners to manage minting efficiently,
      this will be coming a later version. More importantly, voting on proposals requires ownership of token ID 0, 
      this needs reworking in the next version, so that if the user owns any NFT or SFT, they may send a vote.
      "
      />
      <div className="flex flex-col items-center justify-center space-y-12">
        {userDaos?.map((dao, index) => (
          <div key={index}>{dao.address}</div>
        ))}
        {userDaos && (
          <Dropdown
            title={selectedDao?.address}
            options={userDaos}
            clickHandler={setSelectedDao}
          />
        )}
        {selectedDao?.address && (
          <UserDao
            address={selectedDao.address}
            chain={selectedDao.chain}
            version={selectedDao.version}
          />
        )}
      </div>
    </div>
  );
};

export default YourDaos;
