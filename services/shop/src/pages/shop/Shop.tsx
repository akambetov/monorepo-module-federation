import { shopUrls } from "@packages/shared";
import { Link } from "react-router-dom";

const Shop = () => <>
    <h1>Shop</h1>
    <Link to={shopUrls.second}>Second Shop Page</Link>
 </>;

export default Shop;
