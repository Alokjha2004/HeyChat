# 💬 HeyChat  

HeyChat is a **real-time chat application** built with the MERN stack and Socket.IO.  
It allows users to **sign up, log in, and chat in real-time** with others in a simple and clean UI.  

---

## ✨ Features  

- 🔐 **User Authentication** – Login & Signup with JWT-based authentication.  
- 💬 **Real-Time Chat** – One-to-one chat powered by Socket.IO 
- 👥 **Online Users List** – See who is online.  
- 🖥️ **Responsive UI** – Works smoothly on desktop & mobile.  

---

## 🛠️ Tech Stack  

**Frontend**  
- ⚛️ React (Vite)  
- 🎨 TailwindCSS  
- 🗂️ Zustand (state management)  
- 🔄 Socket.IO Client  

**Backend**  
- 🟢 Node.js + Express  
- 🍃 MongoDB + Mongoose  
- 🔐 JWT Authentication  
- 🔄 Socket.IO  

---

## 📂 Project Structure  

```bash
heychat/
│── api/           # Express server & API
│   ├── routes/        # User & auth routes
│   ├── models/        # MongoDB models
│   ├── middleware/    # Auth middleware
│   ├── lib/           # Helper functions, connection
│   └── controllers/ # DB connection, env setup
│
│── frontend/          # React + Tailwind + Zustand
│   ├── components/    # Reusable UI
│   ├── pages/         # Login, Signup, Chat
│   ├── lib/           # Helper functions & API calls
│   └── store/         # Zustand global state
│
└── README.md
```
---


## 🚀 Getting Started  

### 1️⃣ Clone the repo  
```bash
git clone https://github.com/your-username/heychat.git
cd heychat
```
### 2️⃣ Backend setup
```bash
cd backend
npm install
npm run dev
```

### 3️⃣ Frontend setup
```bash
cd frontend
npm install
npm run dev
```
### 4️⃣ Environment Variables
Backend .env
```bash
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

---

## 🔮 Future Scope

- ✅ Group chats

- ✅ Notifications

- ✅ Media sharing

- ✅ Voice & video calls

## 🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a PR.

