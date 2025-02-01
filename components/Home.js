import styles from "../styles/Home.module.css";
// import use

function Home() {
  // async function callVault() {
  //   const options = {
  //     method: "GET",
  //     headers: {
  //       accept: "application/json; charset=utf-8",
  //       authorization: `Bearer ${process.env.API_KEY_KILN}`,
  //     },
  //   };

  //   for (let elem of arrayPrefix) {
  //     try {
  //       const response = await fetch(
  //         `https://api.testnet.kiln.fi/v1/defi/stakes?vaults=eth_0xdea01fc5289af2c440ca65582e3c44767c0fcf08`,
  //         // `https://api.kiln.fi/v1/defi/stakes?vaults=${elem}0xdea01fc5289af2c440ca65582e3c44767c0fcf08`,
  //         options
  //       );
  //       const data = await response.json();
  //       console.log(`${elem} response:`, data);
  //     } catch (error) {
  //       console.error(`Error fetching ${elem}:`, error);
  //     }
  //   }
  // }

  // callVault();

  return (
    <div>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        <div>Kilin: Hacakthon</div>
        <h2>Vault Scout</h2>
      </main>
    </div>
  );
}

export default Home;
