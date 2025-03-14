# ใช้ Golang เวอร์ชัน 1.23.7 เป็น base image
FROM golang:1.23.7

# กำหนด working directory
WORKDIR /app

# ติดตั้ง Air สำหรับ hot reload
RUN go install github.com/air-verse/air@latest

# คัดลอกไฟล์ go.mod และ go.sum ก่อนเพื่อ cache dependencies
COPY go.mod go.sum ./
RUN go mod download

# คัดลอก source code ทั้งหมด
COPY . .

# เปิดพอร์ตที่แอปพลิเคชันใช้งาน (เปลี่ยนตามที่คุณใช้)
EXPOSE 5000

# รันแอปพลิเคชันด้วย Air
CMD ["air"]