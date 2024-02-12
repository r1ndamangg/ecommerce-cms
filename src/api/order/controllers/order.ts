/**
 * order controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    async create(ctx) {
      const body = ctx.request.body;
      const user = ctx.state.user;

      body.data.user = user;
      const response = await strapi.entityService.create("api::order.order", {
        data: body.data,
        populate: ["user"],
      });
      return response;
    },
  })
);
