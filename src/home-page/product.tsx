import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { API_SERVER } from "./api";

// Define the Product interface
export interface Product {
  productId: number;
  name: string;
  price: number;
  image: string; // Image property
  description?: string; // Optional description property
  quantity?: number; // Optional quantity property
}

// ProductShop component
const ProductShop: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [cartItems, setCartItems] = useState<
    {
      product: Product;
      quantity: number;
    }[]
  >(() => {
    // Initialize cartItems from localStorage or as an empty array
    const storedItems = localStorage.getItem("cartItems");
    return storedItems ? JSON.parse(storedItems) : [];
  });

  const [initialProducts, setInitialProducts] = useState<Product[]>([]);
  const [load, setLoad] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // State to hold the selected product for details

  useEffect(() => {
    const role = localStorage.getItem("Role");
    if (role !== "User" || role === null) {
      navigate("/"); // Redirect if the role is not "User"
    }
  }, [navigate]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const rs = await axios.get(API_SERVER + "api/Products/GetAll");
        setInitialProducts(rs.data.data.filter((x: any) => x.quantity !== 0));
      } catch (error) {
        console.error(error);
      }
    };
    getProducts();
    setLoad(false);
  }, [load]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number) => {
    const storedCart = localStorage.getItem("cartItems");
    let cartItems = storedCart ? JSON.parse(storedCart) : [];

    const existingItemIndex = cartItems.findIndex(
      (item: any) => item.product.productId === product.productId
    );

    if (existingItemIndex !== -1) {
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      cartItems.push({ product, quantity });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  };

  const buyNow = (product: Product) => {
    addToCart(product, 1);

    navigate("/cart");
  };

  const openProductDetails = (product: Product) => {
    setSelectedProduct(product); // Set the selected product for details view
  };

  const closeProductDetails = () => {
    setSelectedProduct(null); // Close the details view
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        position: "relative",
      }}
    >
      <p
        className="text-2xl"
        style={{ textAlign: "center", marginBottom: "10px" }}
      >
        Product Shop
      </p>
      <button
        onClick={() => navigate("/cart")} // Navigate to shopping cart
        style={{
          position: "absolute",
          top: "0",
          right: "0",
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
        Go to Shopping Cart
      </button>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        {initialProducts.map((product) => (
          <div
            key={product.productId}
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
            onClick={() => openProductDetails(product)} // Open product details when clicked
          >
            <img
              src={(() => {
                try {
                  const parsedImage = JSON.parse(product.image);
                  return parsedImage[0]?.thumbUrl || "";
                } catch (error) {
                  return "";
                }
              })()}
              alt={product.name}
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />
            <h3 style={{ margin: "10px 0" }}>{product.name}</h3>
            <p style={{ margin: "0", fontWeight: "bold" }}>
              Price: {product.price.toLocaleString()} đ
            </p>
            <div style={{ margin: "10px 0" }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product, 1);
                }}
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
                onClick={() => buyNow(product)}
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

      {/* Product Details Section */}
      {selectedProduct && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "80%",
              maxWidth: "600px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h2>{selectedProduct.name}</h2>
            <img
              src={JSON.parse(selectedProduct.image)[0].thumbUrl}
              alt={selectedProduct.name}
              style={{ width: "100%", height: "300px", objectFit: "cover" }}
            />
            <p>
              <strong>Price:</strong> {selectedProduct.price.toLocaleString()} đ
            </p>
            {selectedProduct.description && (
              <p>
                <strong>Description:</strong> {selectedProduct.description}
              </p>
            )}
            <div>
              <button
                onClick={closeProductDetails}
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductShop;
