export default {
  routes: [
    {
      method: "GET",
      path: "/product-categories/get-parent-categories",
      handler: "product-category.getParentCategories",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/product-categories/get-child-categories/:parent",
      handler: "product-category.getChildCategories",
      config: {
        auth: false,
      },
    },
  ],
};
