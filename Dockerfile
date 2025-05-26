# Development base
FROM node:18-alpine

# Set working dir
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies (pastikan bcryptjs ikut masuk)
RUN npm install

# Copy semua file proyek
COPY . .

# Expose port
EXPOSE 3000

# Jalankan dev server
CMD ["npm", "run", "dev"]
