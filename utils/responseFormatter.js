export const productResponse = (product) => ({
  id: product._id,
  name: product.name,
  category: product.categoryId?.name,
  price: product.price,
  description: product.description,
  image: product.image,
});
