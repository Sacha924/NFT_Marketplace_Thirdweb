import type { NextPage } from "next";
import { ConnectWallet, useContract, useNetwork, useNetworkMismatch } from "@thirdweb-dev/react";
import { AuctionListing, ChainId, DirectListing, ListingType, NATIVE_TOKENS } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./../../styles/Home.module.css";

const NFTInfos: NextPage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string }; // We do some weird TypeScript casting, because Next.JS thinks listingId can be an array for some reason.

  const [loadingListing, setLoadingListing] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [listing, setListing] = useState<AuctionListing | DirectListing>();
  const marketplace = useContract("0x6e87255EED7D470fa346495E02B256573E6754F7", "marketplace").contract;
  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  // When the component mounts, ask the marketplace for the listing with the given id
  useEffect(() => {
    if (!id || !marketplace) {
      return;
    }
    (async () => {
      const l = await marketplace.getListing(id);
      setLoadingListing(false);
      setListing(l);
    })();
  }, [id, marketplace]);

  async function createBidOrOffer() {
    try {
      // Ensure user is on the correct network, here Mumbai
      if (networkMismatch) {
        switchNetwork && switchNetwork(ChainId.Mumbai);
        return;
      }

      // If the listing type is a direct listing, then we can create an offer.
      if (listing?.type === ListingType.Direct) {
        await marketplace?.direct.makeOffer(
          id, // The id of the listing we want to make an offer for
          1, // Quantity = 1
          NATIVE_TOKENS[ChainId.Mumbai].wrapped.address,
          bidAmount // The offer amount the user entered
        );
      }

      // If the listing type is an auction listing, then we can create a bid.
      if (listing?.type === ListingType.Auction) {
        await marketplace?.auction.makeBid(id, bidAmount);
      }

      alert(`${listing?.type === ListingType.Auction ? "Bid" : "Offer"} created successfully!`);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  async function buyNft() {
    try {
      // Ensure user is on the correct network
      if (networkMismatch) {
        switchNetwork && switchNetwork(ChainId.Mumbai);
        return;
      }
      // Simple one-liner for buying the NFT
      await marketplace?.buyoutListing(id, 1);
      alert("NFT bought successfully!");
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  if (loadingListing) {
    return <div>Loading...</div>;
  }
  if (!listing) {
    return <div>Listing not found</div>;
  }
  return (
    <div className={styles.nftDetails}>
      <ConnectWallet />
      <img src={listing.asset.image ? listing.asset.image : ""} />
      <h1>{listing.asset.name}</h1>
      <p>
        <span className={styles.bold}>Description:</span> {listing.asset.description}
      </p>
      <p>
        <span className={styles.bold}>Seller:</span> {listing.sellerAddress}
      </p>
      <p>
        <span className={styles.bold}>Listing Type:</span> {listing.type === 0 ? "Direct Listing" : "Auction Listing"}
      </p>
      <p>
        <span className={styles.bold}>Buyout Price</span> {listing.buyoutCurrencyValuePerToken.displayValue} {listing.buyoutCurrencyValuePerToken.symbol}
      </p>
      <div>
        <button onClick={buyNft}>Buy</button>
        <div>
          <input type="text" name="bidAmount" onChange={(e) => setBidAmount(e.target.value)} placeholder="Amount" />
          <button onClick={createBidOrOffer}>Make Offer</button>
        </div>
      </div>
    </div>
  );
};

export default NFTInfos;
