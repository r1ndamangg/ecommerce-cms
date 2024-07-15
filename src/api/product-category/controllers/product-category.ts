/**
 * product-category controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::product-category.product-category",
  ({ strapi }) => ({
    async getCategoryBySlug(ctx) {
      if (!ctx.params.slug) throw new Error("Slug is required");

      const category = await strapi.db
        .query("api::product-category.product-category")
        .findOne({
          where: { slug: ctx.params.slug },
        });

      return category;
    },
    async getParentCategories() {
      return strapi.entityService.findMany(
        "api::product-category.product-category",
        {
          filters: {
            parent_category: {
              id: null,
            },
          },
          populate: ["icon"],
          publicationState: "live",
        }
      );
    },
    async getChildCategories(ctx) {
      return strapi.entityService.findMany(
        "api::product-category.product-category",
        {
          filters: {
            parent_category: {
              slug: ctx.params.parent,
            },
            populate: ["icon"],
          },
        }
      );
    },
  })
);
