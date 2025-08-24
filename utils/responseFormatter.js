export const productResponse = (product) => ({
  id: product._id,
  name: product.name,
  category: product.categoryId?.name,
  price: product.price,
  description: product.description,
  image: product.image,
});

export const cartResponse = (cart) => {
  const items = cart.cartItems.map((item) => ({
    product: item.product?.name,
    image: item.product?.image,
    unitAmount: item.product?.price,
    quantity: item.quantity,
    totalAmount: item.price,
  }));

  return {
    id: cart._id,
    user: cart.userId?.name,
    totalPrice: cart.totalPrice,
    cartItems: items,
  };
};
