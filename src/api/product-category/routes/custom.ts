export default {
  routes: [
    {
      method: "GET",
      path: "/product-categories/category-by-slug/:slug",
      handler: "product-category.getCategoryBySlug",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/product-categories/parent-categories",
      handler: "product-category.getParentCategories",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/product-categories/child-categories/:parent",
      handler: "product-category.getChildCategories",
      config: {
        auth: false,
      },
    },
  ],
};
