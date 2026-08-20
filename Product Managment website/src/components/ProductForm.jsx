import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import useProductStore from "../store/productStore";

function ProductForm({ selectedProduct, setSelectedProduct }) {
  const addProduct = useProductStore((state) => state.addProduct);
  const updateProduct = useProductStore(
    (state) => state.updateProduct
  );

  const isEditMode = selectedProduct !== null;

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      title: selectedProduct?.title || "",
      price: selectedProduct?.price || "",
      description: selectedProduct?.description || "",
      category: selectedProduct?.category || "",
    },

    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),

      price: Yup.number()
        .typeError("Price must be a number")
        .positive("Price must be greater than 0")
        .required("Price is required"),

      description: Yup.string().required(
        "Description is required"
      ),

      category: Yup.string().required("Category is required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        if (isEditMode) {
          const response = await axios.put(
            `https://fakestoreapi.com/products/${selectedProduct.id}`,
            values
          );

          const updatedProduct = {
            ...selectedProduct,
            ...response.data,
            id: selectedProduct.id,
          };

          updateProduct(updatedProduct);

          toast.success("Product updated successfully.");

          setSelectedProduct(null);
          resetForm();
        } else {
          const response = await axios.post(
            "https://fakestoreapi.com/products",
            values
          );

          addProduct(response.data);

          toast.success("Product added successfully.");

          resetForm();
        }
      } catch (error) {
        console.log(error);
        toast.error(
          isEditMode
            ? "Failed to update product."
            : "Failed to add product."
        );
      }
    },
  });

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h3 className="mb-4">
          {isEditMode ? "Edit Product" : "Add Product"}
        </h3>

        <form onSubmit={formik.handleSubmit}>
          {/* Title */}
          <div className="mb-3">
            <label className="form-label">Title</label>

            <input
              type="text"
              name="title"
              className="form-control"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.touched.title && formik.errors.title && (
              <div className="text-danger mt-1">
                {formik.errors.title}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="mb-3">
            <label className="form-label">Price</label>

            <input
              type="number"
              name="price"
              className="form-control"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.touched.price && formik.errors.price && (
              <div className="text-danger mt-1">
                {formik.errors.price}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Description</label>

            <textarea
              name="description"
              className="form-control"
              rows="4"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.touched.description &&
              formik.errors.description && (
                <div className="text-danger mt-1">
                  {formik.errors.description}
                </div>
              )}
          </div>

          {/* Category */}
          <div className="mb-3">
            <label className="form-label">Category</label>

            <input
              type="text"
              name="category"
              className="form-control"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.touched.category && formik.errors.category && (
              <div className="text-danger mt-1">
                {formik.errors.category}
              </div>
            )}
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-success">
              {isEditMode ? "Update Product" : "Add Product"}
            </button>

            {isEditMode && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedProduct(null);
                  formik.resetForm();
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;