# 🚀 DSA Tracker (Full Stack Web App)

A modern full-stack web application to track your Data Structures & Algorithms (DSA) progress using custom tables and tasks.

---

## 🌟 Features

- 📚 **Dynamic Tables**: Create separate trackers for Arrays, Graphs, DP, etc.
- ➕ **Task Management**: Add tasks with direct problem links (LeetCode, Codeforces).
- ✅ **Progress Tracking**: Mark tasks as completed and view completion percentages.
- ✏️ **Full CRUD**: Edit and delete tasks or tables easily.
- 🎯 **Notion-Style UI**: Clean, minimal, and responsive dashboard.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Axios, Bootstrap + Custom CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Deployment**: Vercel (Frontend), Render (Backend & Database)

---

## 📁 Project Structure

```text
dsa-checklist/
├── client/              # React Frontend
│   ├── src/
│   └── package.json
├── server/              # Node Backend
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   └── server.js
├── README.md
└── .gitignore
```

---

## ⚙️ Local Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/dsa-checklist.git
cd dsa-checklist
```

### 2️⃣ Backend Setup
```bash
cd server
npm install
```

Create .env file inside /server:

```bash
DATABASE_URL=your_postgresql_connection_string
PORT=5000

Run backend:

npm run dev
3️⃣ Frontend Setup
cd client
npm install
npm start  
```




## BACKEND DEPLOYMENT (Render)

## ✅ STEP 1: Prepare backend project

Inside server/:
✔ Ensure structure:

```
server/
 ├── config/db.js
 ├── controllers/
 ├── routes/
 ├── server.js
 ├── package.json
```
 
## ✅ STEP 2: Install dependencies

```bash
cd server
npm install
```

Make sure you have:
- express
- pg
- cors
- dotenv

## ✅ STEP 3: Add start script

In server/package.json:
```json
"scripts": {
  "start": "node server.js"
}
```

## ✅ STEP 4: Use environment variables

Create .env (local only):
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=dsa_checklist
DB_PASSWORD=your_password
DB_PORT=5432
```
Update db.js:
```javascript
require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

module.exports = pool;
```

## ✅ STEP 5: Push to GitHub
```bash
git add .
git commit -m "backend ready"
git push
```

## ✅ STEP 6: Create PostgreSQL on Render

To set up your managed database instance, follow these steps:

1.  **Go to Render Dashboard:**
    👉 [https://render.com](https://render.com)

2.  **Initialize Database:**
    -   Click the **New +** button in the top navigation.
    -   Select **PostgreSQL** from the dropdown menu.
    -   Fill in your database details (Name, Region, etc.).
    -   Click **Create Database**.

3.  **Retrieve Credentials:**
    Once the database is provisioned, locate the **Connections** section and copy the following internal/external credentials:

```bash
Host:     <your-db-host>
DB Name:  <your-database-name>
User:     <your-username>
Password: <your-password>
```

## ✅ STEP 7: Create backend service

Render → New Web Service

Settings:
Field -	Value

Root Directory - server
Build Command	- npm install
Start Command	- npm start

## ✅ STEP 8: Add environment variables in Render
```
DB_USER=xxxx
DB_HOST=xxxx
DB_NAME=xxxx
DB_PASSWORD=xxxx
DB_PORT=5432
```

## ✅ STEP 9: Initialize database (IMPORTANT)

Connect using psql:
```bash
psql postgresql://user:password@host:5432/db
```
Run:
```sql
CREATE TABLE tables (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    table_id INT REFERENCES tables(id),
    name VARCHAR(255),
    url TEXT,
    completed BOOLEAN DEFAULT FALSE
);
```

## ✅ STEP 10: Deploy backend

Click:
👉 Manual Deploy → Redeploy

✅ RESULT:

Backend URL:
```bash
https://your-backend.onrender.com
```
Test:
```bash
/api/table
```

## FRONTEND DEPLOYMENT (Vercel)

## ✅ STEP 1: Go to client folder

```bash
cd client
npm install
```

## ✅ STEP 2: Build test locally
```bashh
npm run build
```

✔ Must succeed before deployment

## ✅ STEP 3: Fix API URL

In:
```bash
client/src/services/api.js
```
Change:
```bash
baseURL: "https://your-backend.onrender.com/api"
```

## ✅ STEP 4: Push frontend
```bash
git add .
git commit -m "frontend ready"
git push
```

## ✅ STEP 5: Deploy on Vercel

Go to:
```bash
👉 https://vercel.com
```

Steps:
- Import GitHub repo
- Select project

### ⚙️ IMPORTANT SETTINGS
Root Directory:
```bash
client
```
Build Command:
```bash
npm run build
```
Output Directory:
```bash
build
```
## ✅ STEP 6: Deploy

Click:
👉 Deploy

✅ RESULT:

Frontend URL:
```bash
https://your-app.vercel.app
```

## 🧠 FINAL ARCHITECTURE
```bash
Frontend (Vercel)
        ↓
Backend API (Render)
        ↓
PostgreSQL DB (Render)
```
