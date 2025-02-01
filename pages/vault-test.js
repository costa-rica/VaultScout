import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";

export default function VaultTest() {
  const [responseArray, setResponseArray] = useState([]);
  useEffect(() => {
    callVault();
    console.log(`Bearer ${process.env.NEXT_PUBLIC_API_KEY_KILN_TEST}`);
  }, []);

  const callVault = async () => {
    // const arrayPrefix = ["eth_", "arb_", "bsc_", "matic_", "op_", "sepolia_"];
    const options = {
      method: "GET",
      headers: {
        accept: "application/json; charset=utf-8",
        authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY_KILN_TEST}`,
      },
    };
    const responseArrayTemp = [];
    // for (let elem of arrayPrefix) {
    try {
      const response = await fetch(
        `https://api.testnet.kiln.fi/v1/defi/stakes?vaults=eth_0xdea01fc5289af2c440ca65582e3c44767c0fcf08`,
        options
      );
      const data = await response.json();
      //   console.log(`${elem} response:`, data);
      responseArrayTemp.push(data);
    } catch (error) {
      console.error(`Error fetching :`, error);
    }
    // }
    setResponseArray(responseArrayTemp);
  };

  return (
    <div>
      <main className={styles.main}>
        <h1 className={styles.title}>Vault</h1>
        {responseArray.map((response, index) => (
          <div key={index}>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        ))}
      </main>
    </div>
  );
}
