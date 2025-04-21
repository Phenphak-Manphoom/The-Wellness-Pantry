import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import MetaData from "../layout/MetaData";
import AdminLayout from "../layout/AdminLayout";
import { useNavigate } from "react-router-dom";
import { PRODUCT_CATEGORIES } from "../../constants/constants";
import { PRODUCT_SIZES } from "../../constants/constants";
import { useCreateProductMutation } from "../../redux/api/productsApi";

const NewProduct = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    stock: "",
    seller: "",
    sizes: [],
    prices: PRODUCT_SIZES.map((size) => ({ size, price: "" })),
  });

  const { name, description, category, stock, seller, sizes, prices } = product;

  const [createProduct, { isLoading, error, isSuccess }] =
    useCreateProductMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "Something went wrong.");
    }

    if (isSuccess) {
      toast.success("Product created");
      navigate("/admin/products");
    }
  }, [error, isSuccess, navigate]);

  const onChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const onSizeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setProduct((prev) => ({ ...prev, sizes: [...prev.sizes, value] }));
    } else {
      setProduct((prev) => ({
        ...prev,
        sizes: prev.sizes.filter((s) => s !== value),
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

    if (!name || !description || !category || !stock || !seller) {
      return toast.error("Please fill in all required fields.");
    }

    if (sizes.length === 0) {
      return toast.error("Please select at least one size.");
    }

    const hasInvalidPrice = prices.some((p) => !p.price || Number(p.price) < 0);
    if (hasInvalidPrice) {
      return toast.error("All prices must be filled and non-negative.");
    }

    const selectedPrices = prices.filter((p) => sizes.includes(p.size));

    createProduct({ ...product, prices: selectedPrices });
  };

  return (
    <AdminLayout>
      <MetaData title={"Create new Product"} />
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10 bg-gray-100">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 text-left">
          <form onSubmit={submitHandler}>
            <h2 className="text-2xl font-bold mb-6">New Product</h2>

            {/* Name Input */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Description Input */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                name="description"
                value={description}
                onChange={onChange}
                required
                rows="4"
                className="w-full border rounded px-3 py-2"
              ></textarea>
            </div>

            {/* Stock and Seller Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block mb-1 font-medium">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={stock}
                  onChange={onChange}
                  required
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
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Category Select */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Category</label>
              <select
                name="category"
                value={category}
                onChange={onChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="" disabled>
                  Select category
                </option>
                {PRODUCT_CATEGORIES?.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sizes Checkbox */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">Sizes</label>
              <div className="flex gap-4">
                {PRODUCT_SIZES.map((size) => (
                  <label key={size} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      value={size}
                      checked={sizes.includes(size)}
                      onChange={onSizeChange}
                    />
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            {/* Prices Input */}
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
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Creating..." : "Create Product"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewProduct;
