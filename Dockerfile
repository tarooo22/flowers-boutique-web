FROM node:22-slim

WORKDIR /app

COPY . .

RUN npm install -g corepack@latest \
  && corepack pnpm install --frozen-lockfile --prod=false \
  && NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 corepack pnpm run build

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

CMD ["sh", "-c", "node_modules/.bin/next start --hostname 0.0.0.0 -p \"$PORT\""]
