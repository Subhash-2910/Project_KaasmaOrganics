function CartReducer(cart, action) {
  switch (action.type) {
    case "Add":
      const existingItem = cart.find((item) => item.id === action.product.id);
      if (existingItem) {
        return cart.map((item) =>
          item.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...cart, { ...action.product, quantity: 1 }];

    case "Increment":
      return cart.map((item) =>
        item.id === action.id ? { ...item, quantity: item.quantity + 1 } : item,
      );

    case "Decrement":
      return cart.map((item) =>
        item.id === action.id ? { ...item, quantity: item.quantity - 1 } : item,
      );

    case "REMOVE":
      const filtered = cart.filter((item) => item.id !== action.id);
      return filtered;

    default:
      return cart;
  }
}

export default CartReducer;
