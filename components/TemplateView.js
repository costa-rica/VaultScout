import styles from "../styles/TemplateView.module.css";
import NavigationBar from "./NavigationBar";

// export default function TemplateView({ children }) {
export default function TemplateView(props) {
  return (
    <>
      <header className={styles.headerCustom}>
        <NavigationBar pageName={props.pageName} />
      </header>
      <main className={styles.mainCustom}>{props.children}</main>
    </>
  );
}
