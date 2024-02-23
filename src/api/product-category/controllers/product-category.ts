/**
 * product-category controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::product-category.product-category",
  ({ strapi }) => ({
    async getParentCategories() {
      return strapi.entityService.findMany(
        "api::product-category.product-category",
        {
          filters: {
            parent_category: {
              id: null,
            },
          },
        }
      );
    },
    async getChildCategories(ctx) {
      return strapi.entityService.findMany(
        "api::product-category.product-category",
        {
          filters: {
            parent_category: {
              id: ctx.params.parent,
            },
          },
        }
      );
    },
  })
);
