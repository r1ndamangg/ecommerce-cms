/**
 * order controller
 */

import { factories } from "@strapi/strapi";
import order from "../routes/order";

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    async create(ctx) {
      const body = ctx.request.body;
      const user = ctx.state.user;

      const carts = await strapi.entityService.findMany("api::cart.cart", {
        filters: {
          users_permissions_user: { id: user.id },
        },
        populate: ["cart_items"],
      });

      const cartItems = await strapi.entityService.findMany(
        "api::cart-item.cart-item",
        {
          filters: {
            id: { $in: carts[0].cart_items.map((item) => item.id) },
          },
          populate: ["product"],
        }
      );

      body.data.user = user;

      const orderItems = await Promise.all(
        cartItems.map((item) =>
          strapi.entityService.create("api::order-item.order-item", {
            data: {
              product: item.product,
              quantity: item.quantity,
            },
          })
        )
      );

      body.data.order_items = orderItems.map((item) => item.id);

      const response = await strapi.entityService.create("api::order.order", {
        data: body.data,
        populate: ["user", "order_items"],
      });
      return response;
    },
    async update(ctx) {
      console.log("params", ctx.params);
      return JSON.stringify(ctx.params);
    },
  })
);
