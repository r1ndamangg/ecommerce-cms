/**
 * cart-item controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::cart-item.cart-item",
  ({ strapi }) => ({
    async create(ctx) {
      const body = ctx.request.body;
      const user = ctx.state.user;
      const carts = await strapi.entityService.findMany("api::cart.cart", {
        filters: {
          users_permissions_user: {
            id: user.id,
          },
        },
      });

      let cart = carts[0];

      if (!cart) {
        cart = await strapi.entityService.create("api::cart.cart", {
          data: {
            users_permissions_user: user.id,
          },
          populate: ["cart_items"],
        });
      }
      const cartItems = await strapi.entityService.findMany(
        "api::cart-item.cart-item",
        {
          filters: {
            cart: {
              id: cart.id,
            },
            product: {
              id: body.product,
            },
          },
        }
      );
      if (cartItems.length > 0) {
        const cartItem = cartItems[0];
        return await strapi.entityService.update(
          "api::cart-item.cart-item",
          cartItem.id,
          {
            data: {
              quantity: body.quantity || cartItem.quantity + 1,
            },
          }
        );
      }

      return await strapi.entityService.create("api::cart-item.cart-item", {
        data: {
          cart: cart.id,
          product: body.product,
          quantity: 1,
        },
      });
    },
  })
);
