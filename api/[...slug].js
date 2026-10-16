// Vercel Node function entrypoint: the handler is bundled at build time by
// artifacts/api-server/build.mjs (esbuild, same pipeline as the server).
export { default } from "../artifacts/api-server/dist/serverless.mjs";
