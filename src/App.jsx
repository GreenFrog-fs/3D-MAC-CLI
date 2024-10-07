import "./App.css";
import Footer from "./components/Footer";
import useUserStore from "./stores/userStore";
import { useEffect } from "react";
import useChestsStore from "./stores/chestsStore";
import usePageStore from "./stores/pageStore";
import Clicker from "./components/Clicker";
import Shop from "./components/Shop/Shop";
import Map3D from "./components/Map/Map3D";

const App = () => {
  window.Telegram.WebApp.expand();
  const { getUser } = useUserStore();
  const { startChestsUpdate } = useChestsStore();
  const { page, showClicker } = usePageStore();
  useEffect(() => {
    getUser();
    startChestsUpdate();
  }, []);

  return (
    <>
      <div className="main">
        <Map3D style={page == "map" ? {} : { display: "none" }} />
        <Shop style={page == "shop" ? {} : { display: "none" }} />
      </div>
      {showClicker && <Clicker />}
      <Footer />
    </>
  );
};

export default App;
