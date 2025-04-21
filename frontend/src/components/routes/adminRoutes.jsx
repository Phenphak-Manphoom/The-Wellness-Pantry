import React from "react";
import { Route } from "react-router-dom";
import Dashboard from "../admin/Dashboard";
import ProtectRoute from "../auth/ProtectRoute";
import ListProducts from "../admin/ListProduct";
import NewProduct from "../admin/NewProduct";
import UpdateProduct from "../admin/UpdateProduct";
import UploadImages from "../admin/UploadImages";

const adminRoutes = () => {
  return (
    <>
      <Route
        path="/admin/dashboard"
        element={
          <ProtectRoute>
            <Dashboard />
          </ProtectRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectRoute admin={true}>
            <ListProducts />
          </ProtectRoute>
        }
      />
      <Route
        path="/admin/product/new"
        element={
          <ProtectRoute admin={true}>
            <NewProduct />
          </ProtectRoute>
        }
      />
      <Route
        path="/admin/products/:id"
        element={
          <ProtectRoute admin={true}>
            <UpdateProduct />
          </ProtectRoute>
        }
      />
      <Route
        path="/admin/products/:id/upload_images"
        element={
          <ProtectRoute admin={true}>
            <UploadImages />
          </ProtectRoute>
        }
      />
    </>
  );
};

export default adminRoutes;
