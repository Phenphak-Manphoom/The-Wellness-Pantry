import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Trash2, X } from "lucide-react";
import MetaData from "../layout/MetaData";
import AdminLayout from "../layout/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteProductImageMutation,
  useGetProductDetailsQuery,
  useUploadProductImagesMutation,
} from "../../redux/api/productsApi";

const UploadImages = () => {
  const fileInputRef = useRef(null);
  const params = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  const [uploadProductImages, { isLoading, error, isSuccess }] =
    useUploadProductImagesMutation();

  const [
    deleteProductImage,
    { isLoading: isDeleteLoading, error: deleteError },
  ] = useDeleteProductImageMutation();

  const { data } = useGetProductDetailsQuery(params?.id);

  useEffect(() => {
    if (data?.product) {
      setUploadedImages(data?.product?.images || []);
    }
  }, [data]);

  useEffect(() => {
    if (error) toast.error(error?.data?.message);
    if (deleteError) toast.error(deleteError?.data?.message);
    if (isSuccess) {
      setImagesPreview([]);
      toast.success("Images Uploaded");
      navigate("/admin/products");
    }
  }, [error, deleteError, isSuccess, navigate]);

  const onChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("File type not supported. Please upload images only.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleResetFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImagePreviewDelete = (image) => {
    const filtered = imagesPreview.filter((img) => img !== image);
    const newImages = images.filter((img) => img !== image);

    setImagesPreview(filtered);
    setImages(newImages);
    handleResetFileInput();
  };

  const submitHandler = (e) => {
    e.preventDefault();
    uploadProductImages({ id: params?.id, body: { images } });
  };

  const deleteImage = async (imgId) => {
    try {
      await deleteProductImage({ id: params?.id, body: { imgId } }).unwrap();
      toast.success("Image Deleted");
    } catch (err) {
      toast.error("Failed to delete image.");
    }
  };

  return (
    <AdminLayout>
      <MetaData title="Upload Product Images" />
      <div className="flex justify-center py-8">
        <form
          onSubmit={submitHandler}
          encType="multipart/form-data"
          className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl"
        >
          <h2 className="text-2xl font-semibold mb-6">Upload Product Images</h2>

          <div className="mb-6">
            <label htmlFor="customFile" className="block font-medium mb-2">
              Choose Images
            </label>
            <input
              ref={fileInputRef}
              type="file"
              name="product_images"
              id="customFile"
              multiple
              onChange={onChange}
              onClick={handleResetFileInput}
              className="block w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <p className="text-sm text-gray-600 mt-4">
              Selected images: {imagesPreview.length} รูป
            </p>
          </div>

          {imagesPreview.length > 0 && (
            <div className="mb-6">
              <p className="text-yellow-600 font-medium mb-2">New Images:</p>
              <div className="flex flex-wrap gap-4">
                {imagesPreview.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-24 h-20 border rounded overflow-hidden"
                  >
                    <img
                      src={img}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleImagePreviewDelete(img)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {uploadedImages.length > 0 && (
            <div className="mb-6">
              <p className="text-green-600 font-medium mb-2">
                Product Uploaded Images:
              </p>
              <div className="flex flex-wrap gap-4">
                {uploadedImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-24 h-20 border rounded overflow-hidden"
                  >
                    <img
                      src={img?.url}
                      alt="uploaded"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => deleteImage(img?.public_id)}
                      disabled={isLoading || isDeleteLoading}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading || isDeleteLoading || images.length === 0}
          >
            {isLoading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default UploadImages;
