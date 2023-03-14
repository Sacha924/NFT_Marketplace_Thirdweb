import { ConnectWallet, useContract } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import Link from "next/link";
import ListNFT from "./components/ListNFT";
import styles from "./../styles/Home.module.css";

const Home: NextPage = () => {
  const marketplace = useContract("0x6e87255EED7D470fa346495E02B256573E6754F7", "marketplace").contract;

  return (
    <div>
      <header className={styles.mainHeader}>
        <ConnectWallet />
        <Link href={{ pathname: `/listing/create` }}>Creating Listings</Link>
      </header>

      <ListNFT marketplace={marketplace} />
    </div>
  );
};

export default Home;
