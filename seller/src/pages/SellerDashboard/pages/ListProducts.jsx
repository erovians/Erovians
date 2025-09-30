import React, { useEffect, useState } from "react";
import axios from "axios";

const ListProducts = ({ companyId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/products", {
          params: { companyId }, // send companyId as query
        });
        setProducts(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    if (companyId) fetchProducts();
  }, [companyId]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!products.length) return <p>No products found for this company.</p>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="border rounded-xl shadow p-4 hover:shadow-lg transition"
        >
          {/* Image */}
          {product.productImages && product.productImages[0] ? (
            <img
              src={product.productImages[0]}
              alt={product.productName}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          ) : (
            <div className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg mb-4">
              No Image
            </div>
          )}

          {/* Product Details */}
          <h3 className="text-xl font-semibold mb-2">{product.productName}</h3>
          <p className="text-gray-600 mb-1">Category: {product.category}</p>
          <p className="text-gray-600 mb-1">
            SubCategory: {product.subCategory || "N/A"}
          </p>
          <p className="text-gray-600 mb-1">Grade: {product.grade}</p>
          <p className="text-gray-600 mb-1">Color: {product.color}</p>
          <p className="text-gray-600 mb-1">Origin: {product.origin}</p>
          <p className="text-gray-600 mb-1">
            Size: {product.size?.length} x {product.size?.width} x{" "}
            {product.size?.thickness}
          </p>
          <p className="text-gray-800 font-semibold mt-2">
            Price: ${product.pricePerUnit} / {product.unit}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ListProducts;
