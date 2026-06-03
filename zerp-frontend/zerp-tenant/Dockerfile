FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY public ./public
COPY .next/standalone ./
COPY .next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
