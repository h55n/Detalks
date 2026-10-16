// Vercel Node function entrypoint. The real handler lives in the api-server
// package so this file stays free of monorepo type resolution; Vercel
// compiles the import chain for runtime.
// @ts-ignore - resolved and type-checked by the monorepo toolchain.
export { default } from "../artifacts/api-server/src/serverless";
