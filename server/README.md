# ⚙️ Scholar AI Backend

The backend of Scholar AI is a robust **Express.js** API that powers the entire study platform. It handles document processing, AI orchestration with Claude, secure user authentication, and data persistence with MongoDB.

## 🚀 Key Responsibilities

- **AI Orchestration**: Direct integration with the Anthropic API to generate summaries, flashcards, and quizzes.
- **Document Processing**: Handles PDF and text uploads using `multer` and `pdf-parse`.
- **User Management**: Secure authentication with `bcryptjs` and `jsonwebtoken` (JWT).
- **Data Persistence**: Mongoose-based schema modeling for materials, study sets, and user profiles.

## 🛠 Tech Stack

- **Server**: [Express.js](https://expressjs.com/)
- **Runtime**: [Node.js](https://nodejs.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose)
- **AI Engine**: [Anthropic AI SDK](https://www.npmjs.com/package/@anthropic-ai/sdk)
- **Authentication**: JWT, bcryptjs

## 📁 API Structure

### Auth Routes (`/api/auth`)
- `POST /register`: Create a new account.
- `POST /login`: Authenticate and receive a JWT.
- `GET /me`: Get current user info.
- `PATCH /profile`: Update profile details.
- `PATCH /password`: Change user password.

### Material Routes (`/api/materials`)
- `GET /`: Retrieve all user materials.
- `POST /`: Upload and process a new material.
- `GET /:id`: Get specific material with study sets.
- `DELETE /:id`: Remove material and associated data.

## ⚙️ Setup & Development

### 1. Installation
Install server dependencies:
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in this directory with the following keys:
```env
PORT=5003
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
ANTHROPIC_API_KEY=your_anthropic_key
CLIENT_URL=http://localhost:3000
```

### 3. Running the Server
- `npm start`: Runs the server with environment file.
- `npm run dev`: Runs the server in watch mode for development.

## 🔒 Security Features
- **Rate Limiting**: Protects against brute-force attacks on auth endpoints.
- **Password Hashing**: Uses `bcryptjs` for secure password storage.
- **JWT Protection**: Middleware ensures only authorized users access their data.
- **CORS**: Configured to allow requests from the frontend domain (localhost).
