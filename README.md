# Team Task Manager

A full-stack project management application similar to Trello/Asana where users can manage task efficiently, which is built with React, Node.js, and MongoDB.

## 🚀 Features

- **Strict Authentication & Cache**: JWT-based login/signup with secure cookie sessions and dynamic RTK Query cache invalidation to prevent data leaks between users.
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Project creators who have full control over the project. They can create tasks, assign members, modify all task fields (Title, Due Date, Priority), and remove members.
  - **Member**: Collaborators who are assigned to specific tasks. Members cannot remove other users or alter core task parameters.
- **Personalized Visibility**: 
  - Members only see projects where they have active task assignments.
  - Project boards and dashboard statistics are filtered to only show a Member the tasks assigned specifically to them.
- **Task Management**: Kanban board style task tracking with status updates.
- **Task Contributions**: Members can provide text-based updates ("Contributions") to tasks to keep the team informed without overwriting core task instructions.
- **Modern UI**: Built with Tailwind CSS and Framer Motion for a premium, responsive feel.

## 📂 Project Structure

```text
Team Task Manager/
├── backend/                  # Node.js / Express Backend
│   ├── config/               # Database and environment configurations
│   ├── controllers/          # API request handlers (project, task, user logic)
│   ├── middleware/           # Auth (JWT) and custom error handling middleware
│   ├── models/               # Mongoose MongoDB schemas (User, Project, Task)
│   ├── routes/               # Express API route definitions
│   ├── utils/                # Helper functions
│   └── server.js             # Entry point
└── frontend/                 # React / Vite Frontend
    ├── public/               # Static public assets
    └── src/
        ├── assets/           # Internal images and SVG icons
        ├── components/       # Reusable UI components (TaskModal, MemberModal, Header)
        ├── pages/            # Main route views (Dashboard, Login, ProjectDetails)
        ├── store/            # Redux store and RTK Query API slices for data fetching
        ├── App.jsx           # Main application routing and layout
        └── main.jsx          # React DOM entry point
```

## 🛠 Tech Stack

- **Frontend**: React (Vite), Redux Toolkit (RTK Query), Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express, Mongoose.
- **Database**: MongoDB.
- **Auth**: JWT, Bcrypt.js, Cookie-based sessions.

## 📦 Installation

1. **Clone the repository**
2. **Install root dependencies**:
   ```bash
   npm install
   ```
3. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```
4. **Install frontend dependencies**:
   ```bash
   cd frontend
   npm install
   ```

## ⚙️ Configuration

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000
```

## 🏃‍♂️ Running Locally

To run the application, you need to start the backend and frontend servers separately in two different terminal windows.

**Terminal 1: Start the Backend**
```bash
cd backend
npm start
```

**Terminal 2: Start the Frontend**
```bash
cd frontend
npm run dev
```

## 🌍 Deployment

### Backend (Railway )
1. Push the `backend` code to GitHub.
2. Connect your repo to  Railway.
3. Add Environment Variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`.
4. Set the build command to `npm install` and start command to `npm start`.

### Frontend (Vercel)
1. Push the `frontend` code to GitHub.
2. Connect your repo to Vercel.
3. Set the build command to `npm run build` and output directory to `dist`.
4. Add Environment Variable: `VITE_API_URL`.

## 📄 License
MIT
