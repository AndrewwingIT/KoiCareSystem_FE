// src/ProductShop.tsx

import React, { useEffect, useState } from "react";

// Define the Product interface
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string; // Image property
  quantity?: number; // Optional quantity property
}

// Sample product data
const initialProducts: Product[] = [
  {
    id: 1,
    name: "Product 1",
    price: 29,
    image: "https://via.placeholder.com/150", // Example image URL
  },
  {
    id: 2,
    name: "Product 2",
    price: 19,
    image: "https://via.placeholder.com/150", // Example image URL
  },
  {
    id: 3,
    name: "Product 3",
    price: 39,
    image: "https://via.placeholder.com/150", // Example image URL
  },
  // Additional products...
];

// ProductShop component
const ProductShop: React.FC = () => {
  const [cartItems, setCartItems] = useState<
    { product: Product; quantity: number }[]
  >(() => {
    const storedItems = localStorage.getItem("cartItems");
    return storedItems ? JSON.parse(storedItems) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id
      );
      if (existingItemIndex !== -1) {
        // If the product is already in the cart, update the quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      }
      // Otherwise, add a new item
      return [...prevItems, { product, quantity }];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== id)
    );
  };

  const buyNow = (product: Product) => {
    addToCart(product, 1); // Always add 1 to the cart
    alert(`${product.name} added to cart! Proceeding to checkout...`);
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Product Shop
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        {initialProducts.map((product) => (
          <div
            key={product.id}
            style={{
              marginBottom: "20px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              width: "200px",
              textAlign: "center",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />
            <h3 style={{ margin: "10px 0" }}>{product.name}</h3>
            <p style={{ margin: "0", fontWeight: "bold" }}>
              Price: ${product.price.toFixed(2)}
            </p>
            <div style={{ margin: "10px 0" }}>
              <button
                onClick={() => addToCart(product, 1)} // Always add 1 to the cart
                style={{
                  padding: "10px 15px",
                  margin: "5px",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#218838")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#28a745")
                }
              >
                Add to Cart
              </button>
              <button
                onClick={() => buyNow(product)} // Only call buyNow
                style={{
                  padding: "10px 15px",
                  margin: "5px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#0056b3")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#007bff")
                }
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductShop;
