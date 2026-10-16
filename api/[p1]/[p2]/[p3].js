// Vercel Node function shim: lazily loads the bundled handler (ESM) via
// dynamic import, which works from this CommonJS module.
let cached;
module.exports = async (req, res) => {
  if (!cached) {
    cached = import("../../../artifacts/api-server/dist/serverless.mjs").then((m) => m.default);
  }
  const handler = await cached;
  return handler(req, res);
};
