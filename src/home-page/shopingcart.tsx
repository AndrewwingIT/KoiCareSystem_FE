import React, { useEffect, useState } from "react";
import { Product } from "./product"; // Ensure the import path is correct
import axios from "axios";
import { API_SERVER } from "./api";
import { useNavigate } from "react-router-dom";
import { Button, message } from "antd";

interface CartItem extends Product {
  product: any;
  quantity: number;
}

const ShoppingCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedItems = localStorage.getItem("cartItems");
    return storedItems ? JSON.parse(storedItems) : [];
  });

  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem("Role");
    if (role !== "User" || role === null) {
      navigate("/");
    }
  }, []);

  const removeFromCart = (productId: number) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems
        .map((item) => {
          if (item.product.productId === productId) {
            // Decrease the quantity
            const updatedQuantity = item.quantity - 1;
            return { ...item, quantity: updatedQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0); // Remove items with quantity 0

      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const userId = localStorage.getItem("userId");
  const totalAmount = cartItems.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  const handleCheckout = async () => {
    console.log(cartItems);
    const orderDetails = cartItems.map((item: any) => ({
      productId: item.product.productId,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const order = {
      userId: userId, // Get this from the logged-in user context
      date: new Date().toISOString().split("T")[0], // Format as 'yyyy-MM-dd'
      totalPrice: totalAmount,
      status: "To Pay", // Set the initial status
      orderDetails: orderDetails,
    };

    // Example: Log the order to the console or save it to your database
    try {
      const rs = await axios.post<any>(`${API_SERVER}api/Orders`, order);
      try {
        const rss = await axios.post<any>(`${API_SERVER}api/Orders/vnpay`, {
          orderID: rs.data.orderId,
          amount: totalAmount,
        });
        window.location.href = rss.data;
      } catch (error) {
        console.error("Error in get waterparam:", error);
        message.error("Check out error");
      }
    } catch (error) {
      console.error("Error in get waterparam:", error);
    }

    // Implement your backend API call here, e.g., save the order

    // Clear cart after checkout
    localStorage.removeItem("cartItems");
    setCartItems([]); // Clear cart state
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p style={{ textAlign: "center" }}>Your cart is empty.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {cartItems.map((item: any) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px",
                border: "1px solid #eee",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  style={{
                    width: "50px",
                    height: "50px",
                    marginRight: "10px",
                    borderRadius: "5px",
                  }}
                />
                <div>
                  <strong>{item.product.name}</strong>
                  <p style={{ margin: "0" }}>
                    Price: {item.product.price.toLocaleString()} đ (Quantity:{" "}
                    {item.quantity})
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.product.productId)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
              >
                Remove
              </button>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
              border: "1px solid #eee",
              borderRadius: "5px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
              marginTop: "10px",
            }}
          >
            <strong>Total Amount:</strong>
            <span>{totalAmount.toLocaleString()} đ</span>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleCheckout}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s",
                alignSelf: "center",
              }}
            >
              Checkout
            </button>
            <button
              className="ml-5"
              onClick={() => navigate("../product")}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#1677ff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s",
                alignSelf: "center",
              }}
            >
              Back to shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
