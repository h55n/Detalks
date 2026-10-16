# DeTalks all-in-one image: builds the frontend and API bundle, then serves
# both from the Express server (artifacts/api-server).
FROM node:22-slim AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY . .
RUN pnpm install --frozen-lockfile --prod=false
RUN pnpm --filter detalks run build && pnpm --filter @workspace/api-server run build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
ENV PORT=7860
EXPOSE 7860
CMD ["node", "artifacts/api-server/dist/index.mjs"]
