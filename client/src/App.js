import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './routes/Home/Home';
import Product from './routes/Product/List';
import ProductDetail from './routes/Product/Detail';
import Cart from './routes/Cart';
import MyOrder from './routes/MyOrder';
import Login from './routes/Login/Login';
import Signup from './routes/SignUp/SignUp';
import Dev from './routes/dev/Dev';
import AdminDashboard from './routes/Admin/Dashboard';
import AdminUser from './routes/Admin/User';
import AdminCategory from './routes/Admin/Category';
import AdminManufacturer from './routes/Admin/Manufacturer';
import AdminProduct from './routes/Admin/Product';
import AdminOrder from './routes/Admin/Order';
import AdminImport from './routes/Admin/Import';
import { AdminLayout, UserLayout } from './components';
import { useDispatch } from 'react-redux';
import { checkTokenValid } from './helpers/Common';
import * as authActions from './stores/authReducer';
import Build from './routes/Build';
import Search from './routes/Search/Search';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBoxOpen,
  faChevronDown,
  faList,
  faPlus,
  faSpinner,
  faUser,
  faIndustry,
  faStar,
  faCheck,
  faPhone,
  faTrash,
  faCartShopping,
  faPenToSquare,
  faDesktop,
  faSearch,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

library.add(
  faUser,
  faSpinner,
  faList,
  faBoxOpen,
  faPlus,
  faChevronDown,
  faIndustry,
  faStar,
  faStarRegular,
  faCheck,
  faPhone,
  faTrash,
  faCartShopping,
  faPenToSquare,
  faCartShopping,
  faDesktop,
  faSearch,
  faTriangleExclamation,
);

function App() {
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    const tokenValid = checkTokenValid();
    dispatch(authActions.setAuthenticated(tokenValid));
    if (tokenValid) {
      dispatch(authActions.getProfile());
    }
  };

  React.useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="/don-hang" element={<MyOrder />} />
          <Route path="/gio-hang" element={<Cart />} />
          <Route path="/xay-dung-cau-hinh" element={<Build />} />
          <Route path="/san-pham/:product" element={<ProductDetail />} />
          <Route path="/:category" element={<Product />} />
          <Route path="/tim-kiem/:query" element={<Search />} />
        </Route>
        <Route path="/dang-nhap" element={<Login />} />
        <Route path="/dang-ky" element={<Signup />} />
        <Route path="/dev" element={<Dev />} />
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="nguoi-dung" element={<AdminUser />} />
          <Route path="danh-muc" element={<AdminCategory />} />
          <Route path="nha-san-xuat" element={<AdminManufacturer />} />
          <Route path="san-pham" element={<AdminProduct />} />
          <Route path="don-dat-hang" element={<AdminOrder />} />
          <Route path="don-nhap-hang" element={<AdminImport />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
