// src/home-page/shoppingcart.tsx

import React, { useEffect, useState } from "react";
import { Product } from "./product"; // Ensure the import path is correct

interface CartItem extends Product {
  product: any;
  quantity: number; // Add quantity to the CartItem type
}

const ShoppingCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedItems = localStorage.getItem("cartItems");
    return storedItems ? JSON.parse(storedItems) : [];
  });

  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems
        .map((item) => {
          if (item.product.id === id) {
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

  const totalAmount = cartItems.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  const handleCheckout = () => {
    // Implement your checkout logic here
    alert(`Checkout successful! Total amount: $${totalAmount.toFixed(2)}`);
    // You could redirect to a checkout page or clear the cart here
    localStorage.removeItem("cartItems"); // Clear cart after checkout
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
          {cartItems.map((item) => (
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
                    Price: ${item.product.price.toFixed(2)}
                    (Quantity: {item.quantity})
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.product.id)}
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
            <span>${totalAmount.toFixed(2)}</span>
          </div>
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
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
