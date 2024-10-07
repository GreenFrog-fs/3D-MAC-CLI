import { getDistance } from "../calculations/getDistance";
import useChestsStore from "../stores/chestsStore";
import usePageStore from "../stores/pageStore";
import useUserStore from "../stores/userStore";

export default function Footer() {
  const { user, position, closestChest } = useUserStore();
  const { setPage } = usePageStore();
  const { chests } = useChestsStore();
  function mapClickHandler() {
    setPage("map");
  }
  function shopClickHandler() {
    setPage("shop");
  }
  function userClickHandler() {
    setPage("user");
  }
  const distance =
    closestChest &&
    Math.floor(getDistance(position, closestChest.lat, closestChest.lon));
  return (
    <footer>
      <div className="additionalFooter">
        <p>сундуков на карте: {chests.length}</p>
        {distance && <p>до ближайшего: {distance}м</p>}
      </div>
      <nav className="nav">
        <button onClick={mapClickHandler}>
          <img src="/icons/map.png" />
        </button>
        <button onClick={shopClickHandler}>
          <img src="/icons/shop.png" />
        </button>
      </nav>
      <div className="points">
        <img src="/icons/gold.png" />
        {user?.points}
      </div>
    </footer>
  );
}
