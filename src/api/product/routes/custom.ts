export default {
  routes: [
    {
      method: "GET",
      path: "/products/product-details/:slug",
      handler: "product.getProductDetails",
    },
  ],
};
