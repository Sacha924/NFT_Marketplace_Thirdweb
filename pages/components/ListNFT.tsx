import { ConnectWallet, MediaRenderer, useContract, useActiveListings } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import Link from "next/link";
import styles from "./../../styles/Home.module.css";
const ListNFT: NextPage = () => {
  // Connect your marketplace smart contract here
  const marketplace = useContract("0x6e87255EED7D470fa346495E02B256573E6754F7", "marketplace").contract;
  const { data: listings, isLoading: loadingListings } = useActiveListings(marketplace);
  return (
    <div>
      {loadingListings ? (
        <div>Loading listings...</div>
      ) : (
        <div className={styles.nftList}>
          {listings?.map((listing) => (
            <div key={listing.id} style={{ width: "calc(100% / 3)", boxSizing: "border-box" }}>
              <h2>
                <Link href={`/listing/${listing.id}`}>{listing.asset.name}</Link>
              </h2>
              <MediaRenderer src={listing.asset.image} />
              <p>
                <span className={styles.bold}>{listing.buyoutCurrencyValuePerToken.displayValue}</span> {listing.buyoutCurrencyValuePerToken.symbol}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListNFT;
