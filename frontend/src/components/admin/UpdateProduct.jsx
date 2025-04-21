import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import MetaData from "../layout/MetaData";
import AdminLayout from "../layout/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";
import { PRODUCT_CATEGORIES, PRODUCT_SIZES } from "../../constants/constants";
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
} from "../../redux/api/productsApi";

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    stock: "",
    seller: "",
    sizes: [],
    prices: [],
  });

  const { name, description, category, stock, seller, sizes, prices } = product;

  const [updateProduct, { isLoading, error, isSuccess }] =
    useUpdateProductMutation();

  const { data } = useGetProductDetailsQuery(params?.id);

  useEffect(() => {
    if (data?.product) {
      const fetchedSizes = (data.product.sizes || []).map((s) =>
        s.toLowerCase()
      );
      const fetchedPrices = data.product.prices || [];

      const pricesWithSize = fetchedSizes.map((size) => {
        const found = fetchedPrices.find((p) => p.size.toLowerCase() === size);
        return {
          size,
          price: found?.price || "",
        };
      });

      setProduct({
        name: data.product.name,
        description: data.product.description,
        category: data.product.category,
        stock: data.product.stock,
        seller: data.product.seller,
        sizes: fetchedSizes,
        prices: pricesWithSize,
      });
    }

    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Product updated");
      navigate("/admin/products");
    }
  }, [data, error, isSuccess]);

  const onChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const onSizeChange = (e) => {
    const size = e.target.value.toLowerCase();
    const checked = e.target.checked;

    if (checked) {
      setProduct((prev) => ({
        ...prev,
        sizes: [...prev.sizes, size],
        prices: [...prev.prices, { size, price: "" }],
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        sizes: prev.sizes.filter((s) => s !== size),
        prices: prev.prices.filter((p) => p.size !== size),
      }));
    }
  };

  const onPriceChange = (index, value) => {
    const updatedPrices = [...prices];
    updatedPrices[index].price = value;
    setProduct({ ...product, prices: updatedPrices });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    updateProduct({ id: params?.id, body: product });
  };

  return (
    <AdminLayout>
      <MetaData title="Update Product" />
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-left px-4 py-10">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={submitHandler}>
            <h2 className="text-2xl font-bold mb-6">Update Product</h2>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                name="description"
                value={description}
                onChange={onChange}
                rows="4"
                className="w-full border rounded px-3 py-2"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block mb-1 font-medium">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={stock}
                  onChange={onChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-medium">Seller</label>
                <input
                  type="text"
                  name="seller"
                  value={seller}
                  onChange={onChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Category</label>
              <select
                name="category"
                value={category}
                onChange={onChange}
                className="w-full border rounded px-3 py-2"
              >
                {PRODUCT_CATEGORIES?.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Sizes</label>
              <div className="flex gap-4">
                {PRODUCT_SIZES.map((size) => {
                  const lowerSize = size.toLowerCase();
                  return (
                    <label key={size} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        value={lowerSize}
                        checked={sizes.includes(lowerSize)}
                        onChange={onSizeChange}
                      />
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium">Prices</label>
              <div className="grid grid-cols-3 gap-4">
                {prices.map((priceObj, index) => (
                  <div key={priceObj.size}>
                    <label className="block text-sm font-medium mb-1">
                      {priceObj.size.charAt(0).toUpperCase() +
                        priceObj.size.slice(1)}
                    </label>
                    <input
                      type="number"
                      value={priceObj.price}
                      onChange={(e) => onPriceChange(index, e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              {isLoading ? "Updating..." : "Update Product"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UpdateProduct;
