import styles from "../styles/DefiNetworkStats.module.css";
import { useState, useEffect } from "react";
import TemplateView from "../components/TemplateView";

const vaultsDict = {
  KlinVaultAaveV3Usdc: "0xdea01fc5289af2c440ca65582e3c44767c0fcf08",
  KlinVaultCompoundV3Usdc: "0xf3a9a790f84b2e0301069be589fc976cf3eb5661",
  BitcoinUsdtAaveV3: "0x9b80443f910832a6eed6cef5b95bd9d1dae424b5",
  DakotaAaveV3Usdc: "0x682cfc8a3d956fba2c40791ec8d5a49e13baafbd",
  DakotaAaveV3Usdt: "0x85fbdc49b2e7b9e07468733873c8f199fc44259f",
};

export default function DefiNetworkStats() {
  const [responseArray, setResponseArray] = useState([]);

  const handleBtn = () => {
    console.log("pressed button");
    console.log(responseArray);
  };

  useEffect(() => {
    callNetworkStats();
    console.log(`Bearer ${process.env.NEXT_PUBLIC_API_KEY_KILN_TEST}`);
  }, []);

  const callNetworkStats = async () => {
    // const arrayPrefix = ["eth_", "arb_", "bsc_", "matic_", "op_", "sepolia_"];
    const options = {
      method: "GET",
      headers: {
        accept: "application/json; charset=utf-8",
        authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY_KILN_TEST}`,
      },
    };
    const responseArrayTemp = [];
    for (let prop in vaultsDict) {
      try {
        const response = await fetch(
          // `https://api.testnet.kiln.fi/v1/defi/network-stats?vaults=eth_0xdea01fc5289af2c440ca65582e3c44767c0fcf08`,
          `https://api.testnet.kiln.fi/v1/defi/network-stats?vaults=eth_${vaultsDict[prop]}`,
          options
        );
        const data = await response.json();
        console.log(data.data[0]);
        responseArrayTemp.push(data.data[0]);
      } catch (error) {
        console.error(`Error fetching :`, error);
      }
    }
    setResponseArray(responseArrayTemp);
  };

  return (
    <TemplateView pageName={"Defi Network Stats"}>
      <div>
        <main className={styles.main}>
          <h1 className={styles.title}>DeFi Network Stats</h1>
          {responseArray.map((elem, index) => (
            <div key={index} className={styles.divResponseArray}>
              <p>Asset: {elem.asset}</p>
              <p>Symbol: {elem.asset_symbol}</p>
              <p>Price (USD): {elem.asset_price_usd}</p>
              <img
                src={elem.asset_icon}
                alt={`${elem.asset_symbol} icon`}
                width="50"
              />
              <hr />
            </div>
          ))}

          <div className={styles.divBtnLogin}>
            <button className={styles.btnLogin} onClick={() => handleBtn()}>
              Login
            </button>
          </div>
        </main>
      </div>
    </TemplateView>
  );
}
