# ใช้ Node.js เวอร์ชัน 20 เป็น base image
FROM node:20-alpine

# กำหนด working directory
WORKDIR /app

# คัดลอก package.json ก่อนเพื่อ cache dependencies
COPY package.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอก source code ทั้งหมด
COPY . .

# สร้างแอปพลิเคชัน Next.js
RUN npm run build

# เปิดพอร์ตที่ Next.js ใช้งาน (ปกติคือ 3000)
EXPOSE 3000

# รันแอปพลิเคชัน Next.js
CMD ["npm", "start"]