/**
 * product controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::product.product",
  ({ strapi }) => ({
    async getProductDetails(ctx) {
      if (!ctx.params.slug) throw new Error("Slug is required");

      const product = await strapi.db.query("api::product.product").findOne({
        where: { slug: ctx.params.slug },
        populate: {
          images: { fields: ["url"] },
          color: { fields: ["name"] },
          memory: { fields: ["capacity"] },
          model: {},
        },
      });

      product.colors = [];
      product.memories = [];

      const productsByModel: any = await strapi.entityService.findMany(
        "api::product.product",
        {
          filters: {
            model: {
              id: product.model.id,
            },
            id: { $ne: product.id },
          },
          fields: ["id", "slug"],
          populate: {
            color: { fields: ["name"] },
            memory: { fields: ["capacity"], populate: ["unit"] },
            images: { fields: ["url"] },
          },
        }
      );

      productsByModel.forEach((productByModel) => {
        if (
          productByModel.color["id"] !== product.color.id &&
          productByModel.memory["id"] === product.memory.id
        ) {
          product.colors.push({
            id: productByModel.color.id,
            name: productByModel.color.name,
            slug: productByModel.slug,
            image: productByModel.images[0].url,
          });
        } else if (
          productByModel.color["id"] === product.color.id &&
          productByModel.memory["id"] !== product.memory.id
        ) {
          product.memories.push({
            id: productByModel.memory.id,
            capacity: productByModel.memory.capacity,
            unit: productByModel.memory.unit.name,
            slug: productByModel.slug,
            image: productByModel.images[0].url,
          });
        }
      });

      return product;
    },
  })
);
