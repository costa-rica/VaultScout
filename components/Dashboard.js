import styles from "../styles/Dashboard.module.css";
import { useState, useEffect } from "react";

const vaultsDict = {
  KlinVaultAaveV3Usdc: "0xdea01fc5289af2c440ca65582e3c44767c0fcf08",
  KlinVaultCompoundV3Usdc: "0xf3a9a790f84b2e0301069be589fc976cf3eb5661",
  BitcoinUsdtAaveV3: "0x9b80443f910832a6eed6cef5b95bd9d1dae424b5",
  DakotaAaveV3Usdc: "0x682cfc8a3d956fba2c40791ec8d5a49e13baafbd",
  DakotaAaveV3Usdt: "0x85fbdc49b2e7b9e07468733873c8f199fc44259f",
};

export default function Dashboard() {
  const [networkStatsResponseArray, setNetworkStatsResponseArray] = useState(
    []
  );
  const [stakesResponseArray, setStakeResponseArray] = useState([]);
  const [
    summedStakesByVaultResponseArray,
    setSummedStakesByVaultResponseArray,
  ] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleBtn = () => {
    console.log("pressed button");
    // console.log(stakesResponseArray);
    // sumStakesResponseByVault;
    console.log(summedStakesByVaultResponseArray);
  };

  useEffect(() => {
    const fetchData = async () => {
      await callNetworkStats();
      await callStakes();
    };

    fetchData();
  }, []); // No `stakesResponseArray` dependency to avoid infinite loop

  useEffect(() => {
    if (stakesResponseArray.length > 0) {
      console.log(
        "-- stakesResponseArray updated, calling sumStakesResponseByVault --"
      );
      sumStakesResponseByVault();
    }
  }, [stakesResponseArray]); // Runs only when `stakesResponseArray` updates

  const callNetworkStats = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json; charset=utf-8",
        authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY_KILN_TEST}`,
      },
    };
    const responseArrayTemp = [];
    // console.log("-- in callNetworkStats ---");
    for (let prop in vaultsDict) {
      //   console.log(vaultsDict[prop]);
      try {
        const response = await fetch(
          // `https://api.testnet.kiln.fi/v1/defi/network-stats?vaults=eth_0xdea01fc5289af2c440ca65582e3c44767c0fcf08`,
          `https://api.testnet.kiln.fi/v1/defi/network-stats?vaults=eth_${vaultsDict[prop]}`,
          //   `https://api.kiln.fi/v1/defi/network-stats?vaults=eth_${vaultsDict[prop]}`,
          options
        );
        const data = await response.json();
        // console.log(data);
        const responseObject = { ...data.data[0], objKey: vaultsDict[prop] };
        responseArrayTemp.push(responseObject);
      } catch (error) {
        console.error(`Error fetching :`, error);
      }
    }
    setNetworkStatsResponseArray(responseArrayTemp);
  };

  const callStakes = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json; charset=utf-8",
        authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY_KILN_TEST}`,
      },
    };

    // const updatedArray = [...networkStatsResponseArray];
    console.log("- in callStakes ---");
    const responseArrayTemp = [];
    for (let prop in vaultsDict) {
      try {
        const response = await fetch(
          `https://api.testnet.kiln.fi/v1/defi/stakes?vaults=eth_${vaultsDict[prop]}`,
          options
        );
        const data = await response.json();
        console.log(data);
        // const data = await response.json();
        // const responseObject = { ...data.data[0], objKey: vaultsDict[prop] };
        const responseObject = { objKey: vaultsDict[prop], array: data.data };
        console.log(responseObject);
        responseArrayTemp.push(responseObject);
      } catch (error) {
        console.error(`Error fetching stakes:`, error);
      }
    }

    setStakeResponseArray(responseArrayTemp);
  };

  const sumStakesResponseByVault = () => {
    console.log("-- in sumStakesResponseByVault --");
    const summedArray = stakesResponseArray.map((vault) => {
      console.log("- in a vault");
      console.log(vault);
      // Initialize sums
      const summedData = {
        objKey: vault.objKey,
        current_balance: 0,
        total_rewards: 0,
        current_rewards: 0,
        total_deposited_amount: 0,
        total_withdrawn_amount: 0,
      };

      // Sum all relevant fields
      vault.array.forEach((stake) => {
        summedData.current_balance += Number(stake.current_balance) || 0;
        summedData.total_rewards += Number(stake.total_rewards) || 0;
        summedData.current_rewards += Number(stake.current_rewards) || 0;
        summedData.total_deposited_amount +=
          Number(stake.total_deposited_amount) || 0;
        summedData.total_withdrawn_amount +=
          Number(stake.total_withdrawn_amount) || 0;
      });

      return summedData;
    });

    setSummedStakesByVaultResponseArray(summedArray);
  };

  const sortTable = (key) => {
    let direction = "asc";

    // If already sorting by this key, reverse the direction
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedArray = [...networkStatsResponseArray].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setNetworkStatsResponseArray(sortedArray);
    setSortConfig({ key, direction });
  };

  return (
    <main className={styles.main}>
      <div className={styles.divLeft}>
        <div className={styles.divLeftTop}>
          <div className={styles.divTableComparison}>
            Tableau comparatif
            <div className={styles.divTableSuper}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.trTableHeader}>
                    <th>
                      <button
                        onClick={() => sortTable("protocol_display_name")}
                      >
                        <span
                          style={{
                            color:
                              sortConfig.key == "protocol_display_name"
                                ? "orange"
                                : "",
                          }}
                        >
                          Vault
                        </span>
                      </button>
                    </th>
                    <th>
                      <button onClick={() => sortTable("share_symbol")}>
                        <span
                          style={{
                            color:
                              sortConfig.key == "share_symbol" ? "orange" : "",
                          }}
                        >
                          Actif sous-jacent
                        </span>
                      </button>
                    </th>
                    <th>
                      <button onClick={() => sortTable("apy")}>
                        <span
                          style={{
                            color: sortConfig.key == "apy" ? "orange" : "",
                          }}
                        >
                          APY actuel
                        </span>
                      </button>
                    </th>
                    <th>
                      <button onClick={() => sortTable("total_yield")}>
                        <span
                          style={{
                            color:
                              sortConfig.key == "total_yield" ? "orange" : "",
                          }}
                        >
                          Rendement total
                        </span>
                      </button>
                    </th>
                    <th>
                      <button onClick={() => sortTable("tvl")}>
                        <span
                          style={{
                            color: sortConfig.key == "tvl" ? "orange" : "",
                          }}
                        >
                          TVL
                        </span>
                      </button>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td></td>
                  </tr>
                  {networkStatsResponseArray.map((elem, index) => (
                    <tr key={index} className={styles.trCustom}>
                      <td className={styles.tdVaultName}>
                        <img
                          src={elem.asset_icon}
                          alt={`${elem.asset_symbol} icon`}
                          width="50"
                        />
                        {elem.protocol_display_name}
                      </td>
                      <td className={styles.tdNormal}>{elem.share_symbol}</td>
                      <td className={styles.tdNormal}>{elem.grr} </td>
                      <td className={styles.tdNormal}>{index} - col 4</td>
                      <td className={styles.tdNormal}>{index} - col 5</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* <div className={styles.divLeftBottom}> */}
        <div className={styles.divGraphic}>
          <div className={styles.divCarousel}>
            <p>Carosel</p>

            {stakesResponseArray.map((elem, index, array) => (
              <div key={index}>
                <p>{elem.objKey}</p>
                {/* <p>{array[index]}</p> */}
              </div>
            ))}
          </div>
          <div className={styles.divApy}>
            <div className={styles.divBtnLogin}>
              <button className={styles.btnLogin} onClick={() => handleBtn()}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.divRight}>
        {/* <p>Widget</p> */}
        <iframe
          src="https://scoot.widget.testnet.kiln.fi/earn"
          width="600"
          style={{ border: "none", height: "100vh", overflow: "hidden" }}
          title="Example"
        ></iframe>
      </div>
    </main>
  );
}
