# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy Prisma schema and env early to ensure npx prisma generate works
COPY prisma ./prisma
COPY .env .env

# Generate Prisma Client
RUN npx prisma generate --schema=./prisma/schema.prisma

# Copy all other project files
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]
