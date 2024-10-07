import { useState } from "react";
import usePageStore from "../stores/pageStore";
import { deactivateChest } from "../apiActions/deactivateChest";
import useUserStore from "../stores/userStore";
import useChestsStore from "../stores/chestsStore";

export default function Clicker() {
  const { id, closestChest, setClosestChest, getUser, user } = useUserStore();
  const [count, setCount] = useState(10);
  const { hideClicker } = usePageStore();
  const { deleteChestFromFront } = useChestsStore();
  const clickHandler = async () => {
    setCount(count - 1);
    if (count == 1) {
      hideClicker();
      await deactivateChest(closestChest.id, id);
      deleteChestFromFront(closestChest.id);
      setClosestChest(null);
      getUser();
    }
  };
  return (
    <>
      <div className="clicker" onClick={clickHandler}>
        {count}
      </div>
      <div className="shadow" />
    </>
  );
}
