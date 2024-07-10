import twilio from "twilio";
import { ApiUserVerificationUserVerification } from "types/generated/contentTypes";

type VerificationStatus =
  ApiUserVerificationUserVerification["attributes"]["status"]["enum"][number];

export default {
  async getUserStatus(ctx) {
    const { phone } = ctx.request.query;

    if (!phone) {
      return ctx.badRequest("phone is required");
    }

    const user = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({
        where: {
          phoneNumber: phone,
        },
      });

    if (!user) {
      return {
        status: "NOT_REGISTERED",
      };
    }

    return {
      status: "REGISTERED",
    };
  },
  async getOTP(ctx) {
    const { phone } = ctx.request.body;

    if (!phone) {
      return ctx.badRequest("phone is required");
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_TOKEN;
    const serviceSid = process.env.TWILIO_SERVICE_SID;
    const client = twilio(accountSid, authToken);

    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({
        to: `+7${phone}`,
        locale: "ru",
        channel: "sms",
      });

    await strapi.entityService.create(
      "api::user-verification.user-verification",
      {
        data: {
          phone,
          status: verification.status as VerificationStatus,
        },
      }
    );

    return {
      status: verification.status,
    };
  },
  async verifyOTP(ctx) {
    const { code, phone } = ctx.request.body;

    const errors = [];

    if (!code) {
      errors.push({ message: "OTP code is required", param: "code" });
    }

    if (errors.length) {
      return ctx.badRequest("validation error", errors);
    }

    const userVerification = (
      await strapi.entityService.findMany(
        "api::user-verification.user-verification",
        {
          filters: {
            phone,
          },
          sort: { createdAt: "desc" },
        }
      )
    )[0];

    if (!userVerification) {
      throw ctx.badRequest(
        "There is no user verification for this phone number"
      );
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const serviceSid = process.env.TWILIO_SERVICE_SID;

    const client = twilio(accountSid, authToken);

    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({
        code,
        to: `+7${phone}`,
      });

    strapi.entityService.update(
      "api::user-verification.user-verification",
      userVerification.id,
      {
        data: {
          status: verificationCheck.status as VerificationStatus,
        },
      }
    );

    return {
      status: verificationCheck.status,
    };
  },

  async register(ctx) {
    const { phone, password } = ctx.request.body;

    const errors = [];

    if (!phone) {
      errors.push({
        param: "phone",
        error: "phone is required",
      });
    }

    if (!password) {
      errors.push({
        param: "password",
        error: "password is required",
      });
    }

    if (errors.length) {
      return ctx.badRequest("validation error", errors);
    }

    const userValidation = await strapi.db
      .query("api::user-verification.user-verification")
      .findOne({
        where: {
          phone,
          status: "approved",
        },
      });

    if (!userValidation) {
      return ctx.badRequest("user have not approved verification");
    }

    const user = await strapi.entityService.create(
      "plugin::users-permissions.user",
      {
        data: {
          username: phone,
          phoneNumber: phone,
          password: password,
        },
      }
    );
    return user;
  },
};
