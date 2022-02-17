import type { NextApiRequest, NextApiResponse } from "next";
import Moralis from "moralis/node";
import { ethers } from "ethers";
import contractInterface from "../../public/DAO.sol/DAO.json";

const serverUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;
const appId = process.env.NEXT_PUBLIC_MORALIS_APP_ID;
const masterKey = process.env.MORALIS_MASTER_KEY;
const linkAccount = async (req: NextApiRequest, res: NextApiResponse) => {
  const NODE_URL_MATIC = `https://rpc-mainnet.maticvigil.com/v1/${process.env.MATIC_NODE}`;
  const NODE_URL_MUMBAI = `https://rpc-mumbai.maticvigil.com/v1/${process.env.MATIC_NODE}`;

  //? destructure req.body.
  const { ownerAddress, daoAddress, chain, version } = req.body;

  //? Instantiate new contract + provider
  const maticProvider = new ethers.providers.JsonRpcProvider(NODE_URL_MATIC);
  const mumbaiProvider = new ethers.providers.JsonRpcProvider(NODE_URL_MUMBAI);
  const contract = new ethers.Contract(
    daoAddress,
    contractInterface.abi,
    chain === "matic" ? maticProvider : mumbaiProvider
  );
  Moralis.start({ serverUrl, appId, masterKey });
  if (!chain) {
    res
      .status(403)
      .send(
        "no chain was specified. need a chain to know where to query with address"
      );
  }

  const AlreadyLinked = Moralis.Object.extend("LinkedDaos");
  const query = new Moralis.Query(AlreadyLinked);
  query.equalTo("ownerAddress", ownerAddress);
  query.equalTo("daoAddress", daoAddress);
  return new Promise<void>((resolve, reject) => {
    query
      .find()
      .then((result: any) => {
        if (result.length > 0) {
          res.status(200).json({ msg: "user already linked", err: "" });
          resolve();
        } else {
          contract
            .isOwner(ethers.utils.getAddress(ownerAddress))
            .then((contractResult: any) => {
              if (contractResult === true) {
                const UserObj = Moralis.Object.extend("LinkedDaos");
                const userSession = new UserObj();
                //todo - save dao name as well
                userSession.set("daoAddress", daoAddress);
                userSession.set("ownerAddress", ownerAddress);
                userSession.set("chain", chain);
                userSession.set("version", version);
                userSession
                  .save(null, { useMasterKey: true })
                  .then((result: any) => {
                    res.status(200).send("user saved");
                    resolve();
                  })
                  .catch((err: any) => {
                    console.log(err);
                    res.status(403).send("error with setting user");
                    resolve();
                  });
              } else {
                res.status(403).send("user is not owner of contract");
                resolve();
              }
            })
            .catch((err: any) => {
              console.log(err);
              res
                .status(403)
                .send(
                  "error with ethers.js call when checking user-dao ownership. try again"
                );
              resolve();
            });
        }
      })
      .catch((err: any) => {
        console.log(err);
        res.status(403).send(err);
        resolve();
      });
  });
};
export default linkAccount;
