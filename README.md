# 🎓 Scholar AI: Learn Smarter, Not Harder

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Anthropic](https://img.shields.io/badge/Anthropic-FFC107?style=for-the-badge&logo=anthropic&logoColor=white)](https://www.anthropic.com/)

**Scholar AI** is a premium, AI-powered study companion designed to transform your learning experience. By leveraging the power of Claude AI, it turns your static notes and documents into a dynamic ecosystem of summaries, flashcards, and interactive quizzes.

---

## ✨ Key Highlights

- **🚀 AI-Powered Transformation**: Instantly convert long PDFs or text notes into digestible study materials.
- **🃏 Mastery-Based Flashcards**: Focus on what you *don't* know with our smart SRS-inspired mastery tracking.
- **📝 Adaptive Quizzes**: Test your knowledge with auto-generated MCQs and comprehensive explanations.
- **🎨 Premium UX/UI**: A beautiful, dark-and-light-themed interface designed for focus and productivity.
- **🔒 Secure & Private**: JWT-based authentication ensures your study materials stay yours.

---

## 🛠 Project Ecosystem

The Scholar AI platform is built with a modern full-stack architecture:

- **[Frontend (React)](./client)**: A responsive, single-page application built with React and custom tokens for a premium feel.
- **[Backend (Express)](./server)**: A robust RESTful API that handles document processing, AI orchestration, and user management.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18 or later.
- **Database**: A MongoDB instance (local or Atlas).
- **AI Access**: An [Anthropic API Key](https://console.anthropic.com/).

### 2. Installation & Setup
Clone the repo and install dependencies for both the frontend and backend:

```bash
# Frontend setup
cd client && npm install

# Backend setup
cd ../server && npm install
```

### 3. Environment Configuration
Create a `.env` file in the `/server` directory:

```env
PORT=5003
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
ANTHROPIC_API_KEY=your_anthropic_key
CLIENT_URL=http://localhost:3000
```

### 4. Run Locally
Start both services to bring the platform to life:

```bash
# Terminal 1: Backend
cd server && npm start

# Terminal 2: Frontend
cd client && npm start
```

---

## 📐 Architecture & Technology

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React, React Router, Context API | Interactive UI & State Management |
| **Backend** | Node.js, Express.js | Core logic & API Routing |
| **Database** | MongoDB, Mongoose | Persistent storage & Schema modeling |
| **AI Engine** | Anthropic Claude API | Material processing & Q&A |
| **Security** | JWT, bcryptjs | Secure Auth & Password hashing |
| **Processing** | Multer, pdf-parse | Document uploads & Parsing |

---

## 👨‍💻 Contributing
We're always looking for ways to improve! Feel free to fork the repo and submit a PR.

*Built with ❤️ for students everywhere.*
