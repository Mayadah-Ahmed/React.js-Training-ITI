import axios from "axios";
import toast from "react-hot-toast";
import useProductStore from "../store/productStore";

function ProductCard({ product, setSelectedProduct }) {
  const deleteProduct = useProductStore((state) => state.deleteProduct);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://fakestoreapi.com/products/${product.id}`
      );

      deleteProduct(product.id);

      toast.success("Product deleted successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete product.");
    }
  };

  const handleEdit = () => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
      <div className="card h-100 shadow-sm">
        <img
          src={product.image}
          className="card-img-top p-4"
          alt={product.title}
          style={{ height: "250px", objectFit: "contain" }}
        />

        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{product.title}</h5>

          <p className="card-text text-muted">
            ${product.price}
          </p>

          <div className="mt-auto d-flex gap-2">
            <button
              className="btn btn-primary flex-fill"
              onClick={handleEdit}
            >
              Edit
            </button>

            <button
              className="btn btn-danger flex-fill"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;