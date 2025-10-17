# 🧩 Task Manager Backend

A robust **Node.js + Express.js backend** for the **Task Manager** application.  
It provides a secure REST API for managing users and tasks, built using **MongoDB (via Mongoose)**, **JWT authentication**, and **bcrypt** for password hashing.

---

## 🚀 Tech Stack

- 🟢 **Node.js** – Runtime environment  
- ⚙️ **Express.js** – Fast and minimalist web framework  
- 🗄️ **MongoDB** – NoSQL database  
- 🔐 **Mongoose** – Elegant MongoDB object modeling  
- 🔑 **JWT (jsonwebtoken)** – Authentication  
- 🔒 **bcryptjs** – Password hashing  
- 🌍 **CORS** – Cross-Origin Resource Sharing  
- ⚡ **dotenv** – Environment configuration  
- 🧠 **validator** – Input validation 

---

## 🚀 Project Setup (Step-by-Step)

### **Step 1: Clone the Repository**
Clone the project from GitHub to your local machine.
```bash
git clone https://github.com/HannanShehzad/TaskManager

download and install Mongodb community

download and install Mongodb shell

### **Step 2: go to frontend folder**
cd TaskManager/backend/
### **Step 3: Install Dependencies**

Install all required npm packages:

npm install

### **Step 4: Setup Environment Variables**

Create a .env file in the root directory by copying the example file:

cp .env.example .env


Then open .env and add/update your environment variables:

PORT=5000
MONGO_URI=mongodb://localhost:27017/TaskManager
JWT_SECRET=your_secret_key_here


### **Step 5: Run the Development Server**

Start the development server:

npm run dev


Your app will be available at:
👉 http://localhost:5000

