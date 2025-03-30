import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import { Toaster } from "react-hot-toast";
import ProductDetails from "./components/product/ProductDetails";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ProtectRoute from "./components/auth/ProtectRoute";
import Profile from "./components/user/Profile";
import UpdateProfile from "./components/user/UpdateProfile";
import UploadAvatar from "./components/user/UploadAvatar";
import UpdatePassword from "./components/user/UpdatePassword";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import Cart from "./components/cart/Cart";
import Shipping from "./components/cart/Shipping";
import ConfirmOrder from "./components/cart/ConfirmOrder";
import PaymentMethod from "./components/cart/PaymentMethod";
import MyOrders from "./components/order/MyOrders";
import OrderDetails from "./components/order/OrderDetails";
import Invoice from "./components/invoice/Invoice";

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster position="top-center" />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />

          <Route
            path="/me/profile"
            element={
              <ProtectRoute>
                <Profile />
              </ProtectRoute>
            }
          />

          <Route
            path="/me/update_profile"
            element={
              <ProtectRoute>
                <UpdateProfile />
              </ProtectRoute>
            }
          />

          <Route
            path="/me/upload_avatar"
            element={
              <ProtectRoute>
                <UploadAvatar />
              </ProtectRoute>
            }
          />

          <Route
            path="/me/update_password"
            element={
              <ProtectRoute>
                <UpdatePassword />
              </ProtectRoute>
            }
          />

          <Route path="/cart" element={<Cart />} />
          <Route
            path="/shipping"
            element={
              <ProtectRoute>
                <Shipping />
              </ProtectRoute>
            }
          />
          <Route
            path="/confirm_order"
            element={
              <ProtectRoute>
                <ConfirmOrder />
              </ProtectRoute>
            }
          />
          <Route
            path="/payment_method"
            element={
              <ProtectRoute>
                <PaymentMethod />
              </ProtectRoute>
            }
          />

          <Route
            path="/me/orders"
            element={
              <ProtectRoute>
                <MyOrders />
              </ProtectRoute>
            }
          />
          <Route
            path="/me/order/:id"
            element={
              <ProtectRoute>
                <OrderDetails />
              </ProtectRoute>
            }
          />

          <Route
            path="/invoice/order/:id"
            element={
              <ProtectRoute>
                <Invoice />
              </ProtectRoute>
            }
          />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
