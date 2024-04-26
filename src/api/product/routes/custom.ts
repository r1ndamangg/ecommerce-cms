export default {
  routes: [
    {
      method: "GET",
      path: "/products/product-by-category/:slug",
      handler: "products.getProductByCategory",
    },
  ],
};
