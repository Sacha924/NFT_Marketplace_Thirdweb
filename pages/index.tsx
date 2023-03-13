import { ConnectWallet } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import ListNFT from "./components/ListNFT";

const Home: NextPage = () => {
  return (
    <div>
      <ConnectWallet />
      <ListNFT />
    </div>
  );
};

export default Home;
