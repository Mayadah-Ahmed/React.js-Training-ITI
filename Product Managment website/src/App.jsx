import { useEffect, useState } from "react";
import axios from "axios";
import useProductStore from "./store/productStore";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const setProducts = useProductStore((state) => state.setProducts);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://fakestoreapi.com/products"
        );

        setProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, [setProducts]);

return (
  <div className="container py-5">

    <div className="app-header">
      <h1 className="fw-bold mb-2">
        🛍️ Product Management
      </h1>

      <p className="text-muted mb-0">
        Manage your products easily
      </p>
    </div>

    <ProductForm
      selectedProduct={selectedProduct}
      setSelectedProduct={setSelectedProduct}
    />

    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 className="section-title mb-1">
          Products
        </h2>

        <p className="text-muted mb-0">
          Manage your product collection
        </p>
      </div>
    </div>

    <ProductList
      setSelectedProduct={setSelectedProduct}
    />

  </div>
)}

export default App;