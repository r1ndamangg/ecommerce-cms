export default {
  routes: [
    {
      method: "GET",
      path: "/auth/get-user-status",
      handler: "auth.getUserStatus",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/auth/send-otp",
      handler: "auth.sendOTP",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/auth/verify-otp",
      handler: "auth.verifyOTP",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/auth/register",
      handler: "auth.register",
      config: {
        auth: false,
      },
    },
  ],
};
