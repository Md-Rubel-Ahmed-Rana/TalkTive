# ---------- Stage 1: Build ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile


# Copy app source code
COPY . .

# Compile NestJS to dist/
RUN npm run build


# ---------- Stage 2: Production ----------
FROM node:18-alpine AS production

WORKDIR /app

# Copy only required files
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile --production

# Copy built output and Prisma client from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 5000

CMD ["node", "dist/main.js"]