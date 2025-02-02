import styles from "../styles/Dashboard.module.css";
import { useState, useEffect } from "react";

import StackedHistogram from "../components/DoubleColorHistogram";
import ScatterPlot from "../components/ScatterPlot";

const data1 = [12, 19, 3, 5, 2, 3];
const data2 = [7, 8, 2, 4, 6, 1];
// const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const labels = ["skUSDC", "skcUSDC", "BUSDT", "dakUSDC", "dakUSDT"];

// Données Nuage de Points
const data = [
  { x: 1, y: 6 },
  { x: 2, y: 7 },
  { x: 3, y: 8 },
  { x: 4, y: 6 },
  { x: 5, y: 5 },
  { x: 6, y: 6 },
  { x: 7, y: 7 },
  { x: 8, y: 8 },
  { x: 9, y: 6 },
  { x: 10, y: 5 },
  { x: 11, y: 7 },
  { x: 12, y: 6 },
  { x: 13, y: 6 },
  { x: 14, y: 7 },
  { x: 15, y: 8 },
  { x: 16, y: 5 },
  { x: 17, y: 6 },
  { x: 18, y: 2 },
  { x: 19, y: 5 },
];

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
  const [calculationsAreCompleted, setCalculationsAreCompleted] =
    useState(false);
  const [histogramDataTotalDepAmount, setHistogramDataTotalDepAmount] =
    useState([]);
  const [histogramDataCurrentBalance, setHistogramDataCurrentBalance] =
    useState([]);
  const [histogramDataLabels, setHistogramDataLabels] = useState([]);

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

  useEffect(() => {
    console.log(`-- stakesResponseArray --`);
    console.log(stakesResponseArray);
    setHistogramDataTotalDepAmount(
      summedStakesByVaultResponseArray.map(
        (item) => item.total_deposited_amount / 1000000000
      )
    );
    setHistogramDataCurrentBalance(
      summedStakesByVaultResponseArray.map(
        (item) => item.current_balance / 1000000000
      )
    );

    setHistogramDataLabels(
      summedStakesByVaultResponseArray.map((item) => {
        console.log(`what are shared symbol: ${item?.objKey}`);
        const matchingVault = networkStatsResponseArray.find(
          (vault) => vault.objKey === item.objKey
        );
        if (matchingVault) {
          console.log(
            `item.objKey sharedsymbol: ${matchingVault.share_symbol}`
          );
          return matchingVault.share_symbol;
        }
        return ""; // Fallback in case there's no match
      })
    );
  }, [summedStakesByVaultResponseArray]);

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

    // Step 1: Compute summed values
    const summedArray = stakesResponseArray.map((vault) => {
      // console.log("- in a vault", vault);

      const summedData = {
        objKey: vault.objKey,
        current_balance: 0,
        total_rewards: 0,
        current_rewards: 0,
        total_deposited_amount: 0,
        total_withdrawn_amount: 0,
      };

      vault.array.forEach((stake) => {
        summedData.current_balance += Number(stake.current_balance) || 0;
        summedData.total_rewards += Number(stake.total_rewards) || 0;
        summedData.current_rewards += Number(stake.current_rewards) || 0;
        summedData.total_deposited_amount +=
          Number(stake.total_deposited_amount) || 0;
        summedData.total_withdrawn_amount +=
          Number(stake.total_withdrawn_amount) || 0;
      });
      summedData.apy =
        summedData.total_rewards / summedData.total_deposited_amount;

      setCalculationsAreCompleted(true);
      return summedData;
    });

    // Step 2: Update networkStatsResponseArray by merging summed values
    setNetworkStatsResponseArray((prevArray) => {
      return prevArray.map((networkStat) => {
        const matchedSummedData = summedArray.find(
          (sumData) => sumData.objKey === networkStat.objKey
        );

        return matchedSummedData
          ? {
              ...networkStat,
              ...matchedSummedData, // Merging summed properties into the existing object
            }
          : networkStat; // Keep unchanged if no match is found
      });
    });

    // Step 3: Update summedStakesByVaultResponseArray state
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
            <h2>Comparative Table</h2>
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
                          APY Average
                        </span>
                      </button>
                    </th>
                    <th>
                      <button onClick={() => sortTable("grr")}>
                        <span
                          style={{
                            color: sortConfig.key == "grr" ? "orange" : "",
                          }}
                        >
                          GRR
                        </span>
                      </button>
                    </th>
                    <th>
                      <button
                        onClick={() => sortTable("total_deposited_amount")}
                      >
                        <span
                          style={{
                            color:
                              sortConfig.key == "total_deposited_amount"
                                ? "orange"
                                : "",
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
                  {calculationsAreCompleted &&
                    networkStatsResponseArray.map((elem, index) => (
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
                        <td className={styles.tdNormal}>
                          {Math.round(elem.apy * 10000) / 100}%
                        </td>
                        <td className={styles.tdNormal}>
                          {Math.round(elem.grr * 100) / 100}
                          {/* {elem.grr} */}
                        </td>
                        <td className={styles.tdNormal}>
                          {elem.total_deposited_amount
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={styles.divGraphics}>
          {/* <div className={styles.graphs}> */}
          {/* Histogramme Empilé */}
          <div className={styles.graphBox}>
            <h2 className={styles.graphTitle}>Histogramme Empilé</h2>

            <StackedHistogram
              data1={histogramDataTotalDepAmount}
              data2={histogramDataCurrentBalance}
              labels={histogramDataLabels}
            />
          </div>

          {/* Nuage de Points */}
          <div className={styles.graphBox}>
            <h2 className={styles.graphTitle}>Nuage de Points</h2>
            <ScatterPlot data={data} />
          </div>
          {/* </div> */}
        </div>
      </div>
      <div className={styles.divRight}>
        <iframe
          src="https://scoot.widget.testnet.kiln.fi/earn"
          width="600"
          height="600"
          style={{ border: "none", height: "100vh", overflow: "hidden" }}
          //   className={styles.iframe}
          title="Example"
        ></iframe>
      </div>
    </main>
  );
}
