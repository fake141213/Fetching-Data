# ระบบจัดการข้อมูลนักศึกษา

เว็บแอปสำหรับดู ค้นหา เพิ่ม แก้ไข และลบข้อมูลนักศึกษา พัฒนาด้วย Next.js, React, Prisma และ SQLite

## ความต้องการของระบบ

- Node.js 20.9 ขึ้นไป
- npm

## ติดตั้งและเริ่มใช้งาน

1. Clone โปรเจกต์และเข้าโฟลเดอร์:

   ```bash
   git clone https://github.com/fake141213/Fetching-Data.git
   cd Fetching-Data
   ```

2. ติดตั้ง dependencies:

   ```bash
   npm ci
   ```

3. สร้างไฟล์ `.env` จากตัวอย่าง แล้วกำหนด URL ของฐานข้อมูล SQLite:

   ```bash
   copy .env.example .env
   ```

   บน macOS หรือ Linux ใช้ `cp .env.example .env` แทน โดยค่าเริ่มต้นจะเก็บฐานข้อมูลไว้ที่ `dev.db` ในโฟลเดอร์โปรเจกต์

4. สร้าง Prisma Client และเตรียมฐานข้อมูล:

   ```bash
   npx prisma generate --config prisma7.config.ts
   npx prisma migrate deploy --config prisma7.config.ts
   ```

5. เริ่มเซิร์ฟเวอร์สำหรับพัฒนา:

   ```bash
   npm run dev
   ```

6. เปิด [http://localhost:3000](http://localhost:3000) ระบบจะพาไปยังหน้ารายชื่อนักศึกษา

## วิธีใช้งาน

- ค้นหานักศึกษาด้วยรหัสนักศึกษาหรือชื่อ
- กรองรายการตามสาขาและสถานะการศึกษา
- เลือก **เพิ่มนักศึกษา** เพื่อสร้างรายการใหม่
- ใช้ปุ่ม **แก้ไข** หรือ **ลบ** ในแต่ละแถวเพื่อจัดการข้อมูล

## คำสั่งที่ใช้บ่อย

```bash
npm run dev      # เริ่มโหมดพัฒนา
npm run lint     # ตรวจสอบโค้ดด้วย ESLint
npm run build    # สร้าง production build
npm run start    # เริ่ม production server หลัง build
```

## API

- `GET /api/students` — อ่านรายชื่อนักศึกษา
- `POST /api/students` — เพิ่มนักศึกษา
- `GET /api/students/:id` — อ่านข้อมูลนักศึกษาตาม ID
- `PUT /api/students/:id` — แก้ไขข้อมูลนักศึกษา
- `DELETE /api/students/:id` — ลบนักศึกษาตาม ID

## ข้อควรทราบ

- ไฟล์ `.env` และฐานข้อมูล `dev.db` เป็นข้อมูลเฉพาะเครื่อง อย่านำขึ้น Git
- การเปลี่ยน schema ให้สร้าง migration ด้วย Prisma แล้ว commit ไฟล์ migration ใน `prisma/migrations`
