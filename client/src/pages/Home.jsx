import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useUser from "../hooks/useUser";
import { InfuraProvider, formatEther } from "ethers";

export default function Home() {
  const { user } = useAuth();
  const getUser = useUser();
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await getUser();
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to fetch user data");
      }
    };

    fetchUser();
  }, [getUser]);

  useEffect(() => {
    const fetchBalance = async (walletAddress) => {
      if (!walletAddress) return;

      try {
        const provider = new InfuraProvider(
          "sepolia",
          process.env.REACT_APP_INFURA_API_KEY
        );
        const balance = await provider.getBalance(walletAddress);
        setBalance(formatEther(balance));
      } catch (error) {
        console.error("Error fetching balance:", error);
        setError("Failed to fetch Ethereum balance");
      }
    };

    if (user?.ethereum_wallet) {
      fetchBalance(user.ethereum_wallet);
    }
  }, [user]);

  return (
    <div className="container mt-3">
      <h2>
        <div className="row">
          <div className="mb-12">
            {error ? (
              <p>{error}</p>
            ) : user?.email ? (
              <p>
                User Ethereum Balance:{" "}
                {balance !== null ? `${balance} ETH` : "Loading..."}
              </p>
            ) : (
              "Please login first"
            )}
          </div>
        </div>
      </h2>
    </div>
  );
}
