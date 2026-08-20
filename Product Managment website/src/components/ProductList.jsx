import useProductStore from "../store/productStore";
import ProductCard from "./ProductCard";

function ProductList({ setSelectedProduct }) {
  const products = useProductStore((state) => state.products);

  return (
    <div className="row g-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          setSelectedProduct={setSelectedProduct}
        />
      ))}
    </div>
  );
}

export default ProductList;