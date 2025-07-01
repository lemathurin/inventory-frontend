module.exports = {
  e2e: {
    baseUrl: "http://localhost:3000",
    env: {
      backendUrl: process.env.CYPRESS_API_URL || "http://localhost:4000",
    },
  },
};
