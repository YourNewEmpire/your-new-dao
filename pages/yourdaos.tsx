import React, { useEffect, useState } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import AlertCard from "../components/Cards/AlertCard";
import Dropdown from "../components/Dropdown";
const serverUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;
const appId = process.env.NEXT_PUBLIC_MORALIS_APP_ID;

const YourDaos = () => {
  const { Moralis, authenticate, isAuthenticated, user } = useMoralis();
  const [userDaos, setDaos] = useState<string[]>([]);
  const [selectedDao, setSelectedDao] = useState("");

  useEffect(() => {
    Moralis.start({ serverUrl, appId });
    const LinkedDaos = Moralis.Object.extend("LinkedDaos");
    const query = new Moralis.Query(LinkedDaos);
    query.equalTo("ownerAddress", user?.get("ethAddress"));
    const getResults = async () => {
      await query
        .find()
        .then((results) => {
          let newDaosArray: string[] = [];
          for (let i = 0; i < results.length; i++) {
            const object = results[i];
            newDaosArray.push(object.get("daoAddress"));
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
      <div className="min-h-screen bg-slate-900">
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
        </div>
      </div>
    );
  return (
    <div className="min-h-screen bg-slate-900">
      <h1 className="lg:text-xl xl:text-3xl text-center font-semibold">
        Manage Your DAOs
      </h1>
      <div className="flex flex-col items-center justify-center space-y-12">
        {userDaos?.map((dao, index) => (
          <div key={index}>{dao}</div>
        ))}
        <Dropdown
          title={selectedDao}
          options={userDaos}
          clickHandler={setSelectedDao}
        />
      </div>
    </div>
  );
};

export default YourDaos;
