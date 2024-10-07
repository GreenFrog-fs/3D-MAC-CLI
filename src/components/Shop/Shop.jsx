import { useEffect } from "react";
import useShopStore from "../../stores/shopStore";
import ProductCard from "./ProductCard";

const Shop = ({ style }) => {
  const { avatars, getAvatars } = useShopStore();
  useEffect(() => {
    getAvatars();
  }, []);
  return (
    <div style={style}>
      <p className="shop_items_name">аватары</p>
      <div className="products_list">
        {avatars.map((avatar) => (
          <ProductCard key={avatar.id} avatar={avatar} />
        ))}
      </div>
    </div>
  );
};

export default Shop;
