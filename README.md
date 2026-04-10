# 💬 Real-Time Chat Application

A modern, highly responsive real-time chat application built on the **MERN** stack (MongoDB, Express, React, Node.js) with **Socket.io** for instant communication.

## 🌟 Features
- **Real-Time Messaging:** Instantaneous chat powered by Socket.io web sockets.
- **Dynamic Theming:** Select from 30+ different customized themes powered by DaisyUI.
- **Smart Contact Discovery:** Search for existing friends instantly using local name filtering, or find new users by navigating to Settings and connecting via their `USR-XXXXXX` Unique ID.
- **Live Notifications:** See exactly who is online through dynamic green status indicators, and track unread messages with live animated badges.
- **Asymmetrical Chat Clearing:** Easily clear your local chat history without forcefully destroying the messages for the other user.
- **Media Support:** Share images safely via Cloudinary integration.
- **Secure by Default:** Features JWT HTTP-Only cookies, global rate-limiting, and XSS sanitization built directly into the Express backend.

## 🛠️ Tech Stack
**Frontend:**
- React (Vite)
- Zustand (State Management)
- Tailwind CSS & DaisyUI
- React Router DOM
- Axios

**Backend:**
- Node.js & Express
- MongoDB (Mongoose)
- Socket.io
- Cloudinary (Image Hosting)
- JWT (JSON Web Tokens)
- Express Rate Limit & XSS

---

## 💻 Local Workspace Setup

### 1. Clone the repository
```bash
git clone https://github.com/nandhubabu/Real-Time-chat-app.git
cd Real-Time-chat-app
```

### 2. Install dependencies
Open two separate terminal windows.
```bash
# Terminal 1: Backend
cd server
npm install

# Terminal 2: Frontend
cd client
npm install
```

### 3. Setup Environment Variables
Create a `.env` file inside the `server` directory and configure the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_cluster_string
JWT_SECRET=your_super_secret_64_character_hex_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
```

### 4. Run the Application
In both terminal windows, start the development servers:
```bash
# Server terminal
npm run dev

# Client terminal
npm run dev
```

Visit `http://localhost:5173` to view the application!

---

## 🚀 Deployment Recommendations

Because this application relies on standard WebSockets to maintain real-time bidirectional communication, the backend **must** be deployed to a platform that supports persistent instances, rather than strict serverless functions.

1. **Frontend:** Highly recommended to host the `client` folder statically on **Vercel** or **Netlify**.
2. **Backend:** Highly recommended to host the `server` folder on **Render.com** (Web Service) or **Railway.app**. 

> **Cold Start Tip:** If using Render's Free tier, the server will sleep after 15 minutes of inactivity. Set up a ping using [cron-job.org](https://cron-job.org) hitting your live URL every 14 minutes to prevent the container from ever falling asleep!

---
*Built with ❤️ for modern real-time communication.*
