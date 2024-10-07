import useShopStore from "../../stores/shopStore";
import useUserStore from "../../stores/userStore";
import Avatar from "./Avatar";

const ProductCard = ({ style, avatar }) => {
  const { setAvatarSrc } = useUserStore();
  const { buyAvatar } = useShopStore()
  const chooseClickHandler = () => {
    setAvatarSrc(avatar.src);
  };
  const buyClickHandler = async (event) => {
    const button = event.target;
    button.disabled = true;
    await buyAvatar(avatar)
    button.disabled = false;
  };
  return (
    <div style={style} className="product_card">
      <Avatar src={avatar.src} />
      <div className="product_data">
        <div className="product_points">
          <img src="/icons/gold.png" />
          <p>{avatar.price}</p>
        </div>
        {avatar.opened ? <button className="product_button" onClick={chooseClickHandler}>
          выбрать
        </button> : <button className="product_button" onClick={buyClickHandler}>
          купить
        </button>}
      </div>
    </div>
  );
};

export default ProductCard;
