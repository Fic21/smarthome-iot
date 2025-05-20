#image resmi Node.js
FROM node:18
#Funsi buat direktori kerja dalam container
WORKDIR /app
#salin package.json dan package-lock.json
COPY package*.json ./
#install depedency
RUN npm install
#menyalin semua sc
COPY . .
#buil project Next.js
RUN npm run build
#buka port
EXPOSE 3000
#jalankan aplikasi
CMD ["npm","start"]