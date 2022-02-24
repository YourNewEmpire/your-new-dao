export interface IUserDao {
  address: string;
  version: "V1" | "V2";
  chain: "matic" | "mumbai";
}
