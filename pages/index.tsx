import type { NextPage } from "next";
import { useMoralis } from "react-moralis";
import AuthButton from "../components/Buttons/AuthButton";
import AlertCard from "../components/Cards/AlertCard";
const Home: NextPage = () => {
  const { authenticate, isAuthenticated } = useMoralis();
  return (
    <div className="min-h-screen">
      <div className="flex flex-col items-center justify-center space-y-4 lg:space-y-12 xl:space-y-20 text-center ">
        <div>
          <h1 className="text-6xl text-center font-semibold">Your New Dao</h1>
          <p>A Marketplace of DAOs</p>
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
        {!isAuthenticated && <AuthButton/>}
      </div>
    </div>
  );
};

export default Home;
