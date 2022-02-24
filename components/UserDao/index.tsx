import React, { useState } from "react";
import { ethers } from "ethers";
import contractAbiV1 from "../../public/DAO.sol/DAO.json";
import { IUserDao } from "../../interfaces/userdao";

const UserDao = ({ address, version, chain }: IUserDao) => {
  //@ts-ignore
  const { ethereum } = window;
  const maticProvider = new ethers.providers.Web3Provider(ethereum);
  const mumbaiProvider = new ethers.providers.Web3Provider(ethereum);
  //todo - needs refactoring when new versions and chains are introduced.
  const daoContract = new ethers.Contract(
    address,
    contractAbiV1.abi,
    maticProvider
  );

  /*
originalSeller
name
ownerName
tokenIdMapping
tokenIdArray
tokenStringArray
isOwner
owners
hasVoted
proposals
_isNFTOwner
uri
  */

  //todo - perhaps return different markup per dao version
  return (
    <div>
      <h1 className="m-6 lg:text-xl xl:text-3xl text-center font-semibold">
        Read your DAO
      </h1>
      <div
        className="grid grid-flow-row grid-cols-1 lg:grid-cols-2 xl:grid-cols-3
      items-center justify-center gap-8
  "
      >
        <div
          className="flex flex-col justify-center items-center space-y-2 
      rounded-lg ring-4 ring-cyan-600 text-center"
        >
          <p className="text-lg">contract name</p>
          <p>the result of getter goes here</p>
        </div>
        <div
          className="flex flex-col justify-center items-center space-y-2 
      rounded-lg ring-4 ring-cyan-600 text-center"
        >
          <p className="text-lg">contract name</p>
          <p>the result of getter goes here</p>
        </div>
        <div
          className="flex flex-col justify-center items-center space-y-2 
      rounded-lg ring-4 ring-cyan-600 text-center"
        >
          <p className="text-lg">contract name</p>
          <p>the result of getter goes here</p>
        </div>
      </div>
      <h1 className="m-6 lg:text-xl xl:text-3xl text-center font-semibold">
        Write to your DAO
      </h1>
    </div>
  );
};

//todo - unfinished
/* //* Contract Getters:
balanceOf
balanceOfBatch
contractSold
hasVoted
isOwner
name
ownerName
owners
proposals
tokenIdArray
tokenIdMapping - 
uri - returns baseURI

//* Contract Setters:
safeTransferFrom
safeBatchTransferFrom
setBaseURI
newProposal
newVote
addOwners
addNewTokenIDs
*/

export default UserDao;
