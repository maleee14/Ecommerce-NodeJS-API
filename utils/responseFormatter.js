export const userResponse = (user) => {
  const address = user.address.map((a) => ({
    id: a._id,
    details: a.details,
    street: a.street,
    city: a.city,
    zipCode: a.zipCode,
  }));

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    profile_image: user.profile_image,
    address: address ?? null,
  };
};

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
