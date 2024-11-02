import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./home-page/login";
import Register from "./home-page/register";
import HomeLayout from "./home-page/home-layout";
import MyKoi from "./home-page/mykoi";
import KoiDetail from "./home-page/koiDetail";
import Pond from "./home-page/pond";
import AdminLayout from "./admin-page/admin-layout";
import User from "./admin-page/user";
import Category from "./admin-page/category";
import Product from "./admin-page/product";
import SaltCalculator from "./home-page/saltcaculator";
import ProductShop from "./home-page/product";
import ShoppingCart from "./home-page/shopingcart";
import WaterParameter from "./home-page/waterparameter";
import Statistics from "./home-page/statistic";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route path="my-koi" element={<MyKoi />}></Route>
        <Route path="my-koi/:id" element={<KoiDetail />}></Route>
        <Route path="my-pond" element={<Pond />}></Route>
        <Route path="salt-calculator" element={<SaltCalculator />}></Route>
        <Route path="product" element={<ProductShop />}></Route>
        <Route path="cart" element={<ShoppingCart />}></Route>
        <Route path="water-parameter" element={<WaterParameter />}></Route>
        <Route path="statistics" element={<Statistics />}></Route>
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="user" element={<User />}></Route>
        <Route path="product" element={<Product />}></Route>
        <Route path="category" element={<Category />}></Route>
      </Route>
    </Routes>
  );
}

export default App;