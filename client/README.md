# 🖥 Scholar AI Frontend

The frontend of Scholar AI is a modern, high-performance web application built with **React**. It provides a seamless and intuitive interface for students to manage their study materials and leverage AI-powered learning tools.

## 🎨 Design Philosophy

- **Modern & Premium**: Uses a custom-built design system with tokens for colors, spacing, and typography.
- **Glassmorphism & Gradients**: Subtle visual effects to create a premium, state-of-the-art feel.
- **Micro-animations**: Smooth transitions and hover effects to enhance the user experience.
- **Accessibility**: Built with semantic HTML and appropriate heading structures.

## 🚀 Key Features

- **Dashboard**: A central hub to view recent materials, study progress, and quick stats.
- **Upload Center**: Drag-and-drop or paste functionality to ingest new study content.
- **Study Hub & Quiz Center**: Dedicated areas to focus on specific learning modes.
- **Profile & Settings**: Full control over user account details and application preferences.

## 🛠 Tech Stack

- **Framework**: [React](https://reactjs.org/)
- **Routing**: [React Router](https://reactrouter.com/)
- **State Management**: React Context API (Auth Context)
- **Icons**: [Material Symbols Outlined](https://fonts.google.com/icons)
- **Fonts**: [Manrope](https://fonts.google.com/specimen/Manrope) (Headings), [Inter](https://fonts.google.com/specimen/Inter) (Body)

## 📁 Directory Structure

- `src/api`: Axios/Fetch client configuration for API communication.
- `src/components`: Reusable UI components (Navbar, Spinner, Progress bars).
- `src/context`: React Context providers for global state.
- `src/hooks`: Custom hooks for data fetching (Flashcards, Materials).
- `src/pages`: Individual page components (Homepage, Dashboard, StudyPage, etc.).

## ⚙️ Development

### Scripts

- `npm start`: Runs the app in development mode at [http://localhost:3000](http://localhost:3000).
- `npm run build`: Builds the app for production.

### Environment

Ensure a `.env` file exists in the root of the project (parent directory) or is properly linked. The client expects to communicate with the backend on the port specified in your configuration.
