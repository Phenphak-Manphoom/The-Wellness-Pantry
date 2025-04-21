import React from "react";
import { Route } from "react-router-dom";
import Home from "../Home";
import ProductDetails from "../product/ProductDetails";
import Login from "../auth/Login";
import Register from "../auth/Register";
import ForgotPassword from "../auth/ForgotPassword";
import ResetPassword from "../auth/ResetPassword";
import ProtectRoute from "../auth/ProtectRoute";
import Profile from "../user/Profile";
import UpdateProfile from "../user/UpdateProfile";
import UploadAvatar from "../user/UploadAvatar";
import UpdatePassword from "../user/UpdatePassword";
import Cart from "../cart/Cart";
import Shipping from "../cart/Shipping";
import ConfirmOrder from "../cart/ConfirmOrder";
import PaymentMethod from "../cart/PaymentMethod";
import MyOrders from "../order/MyOrders";
import OrderDetails from "../order/OrderDetails";
import Invoice from "../invoice/Invoice";

const userRoutes = () => {
  return (
    <>
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
    </>
  );
};

export default userRoutes;
