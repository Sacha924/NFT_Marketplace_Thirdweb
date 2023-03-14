import { ConnectWallet, MediaRenderer, useContract, useActiveListings } from "@thirdweb-dev/react";
import { Marketplace } from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import Link from "next/link";
import styles from "./../../styles/Home.module.css";

interface ListNFTProps {
  marketplace: Marketplace | undefined;
}

const ListNFT: NextPage<ListNFTProps> = (props) => {
  const { data: listings, isLoading: loadingListings } = useActiveListings(props.marketplace);
  return (
    <div>
      {loadingListings ? (
        <div>Loading listings...</div>
      ) : (
        <div className={styles.flexRow}>
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
