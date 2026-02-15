// function CartReducer(cart, action) {
//   console.log("Action type:", action.type);
//   switch (action.type) {
//     case "Add":
//       return [...cart, action.product];
//     case "Increment":
//       //   const IndexI = cart.findIndex((props) => props.id === action.id);
//       //   cart[IndexI].quantity += 1;
//       //   return [...cart];
//       //   console.log(cart);
//       cart.map((item) =>
//         item.id === action.id ? { ...item, quantity: item.quantity + 1 } : item
//       );
//     case "Decrement":
//       const IndexD = cart.findIndex((props) => props.id === action.id);
//       cart[IndexD].quantity -= 1;
//       //   console.log(cart[IndexD].quantity);

//       return [...cart];

//     case "REMOVE":
//       return cart.filter((props) => props.id !== action.id);

//     default:
//       return cart;
//   }
// }

// export default CartReducer;
function CartReducer(cart, action) {
  console.log("Action:", action);
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
      console.log("Removing item with id:", action.id);
      console.log("Current cart:", cart);
      const filtered = cart.filter((item) => item.id !== action.id);
      console.log("Filtered cart:", filtered);
      return filtered;

    default:
      return cart;
  }
}

export default CartReducer;
