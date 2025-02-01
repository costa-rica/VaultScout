import styles from "../styles/DefiStakes.module.css";
import { useState, useEffect } from "react";
import TemplateView from "../components/TemplateView";

const vaultsDict = {
  KlinVaultAaveV3Usdc: "0xdea01fc5289af2c440ca65582e3c44767c0fcf08",
  KlinVaultCompoundV3Usdc: "0xf3a9a790f84b2e0301069be589fc976cf3eb5661",
  BitcoinUsdtAaveV3: "0x9b80443f910832a6eed6cef5b95bd9d1dae424b5",
  DakotaAaveV3Usdc: "0x682cfc8a3d956fba2c40791ec8d5a49e13baafbd",
  DakotaAaveV3Usdt: "0x85fbdc49b2e7b9e07468733873c8f199fc44259f",
};

export default function DefiStakes() {
  const [responseArray, setResponseArray] = useState([]);
  useEffect(() => {
    callVault();
    console.log(`Bearer ${process.env.NEXT_PUBLIC_API_KEY_KILN_TEST}`);
  }, []);

  const callVault = async () => {
    const url =
      "https://api.testnet.kiln.fi/v1/defi/network-stats?vaults=eth_0xdea01fc5289af2c440ca65582e3c44767c0fcf08%20";

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
      const response = await fetch(url, options);
      const data = await response.json();
      //   console.log(`${elem} response:`, data);
      responseArrayTemp.push(data);
    } catch (error) {
      console.error(`Error fetching :`, error);
    }
    console.log(typeof responseArrayTemp[0].data);
    console.log(responseArrayTemp[0].data);
    // }
    setResponseArray(responseArrayTemp[0].data);
  };

  return (
    <TemplateView>
      <div>
        <main className={styles.main}>
          <h1 className={styles.title}>Defi Stakes</h1>
          {responseArray.map((elem, index) => (
            <div key={index}>
              <div>current balance: {elem.current_balance}</div>
              <div>total_rewards: {elem.total_rewards}</div>
              <div>current_rewards: {elem.current_rewards}</div>
              <div>total_deposited_amount: {elem.total_deposited_amount}</div>
              <hr></hr>
            </div>
          ))}
        </main>
      </div>
    </TemplateView>
  );
}
