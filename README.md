# Todo List Application

A full-stack Todo List application with user authentication, JWT token management, and CRUD operations for todo tasks.

## Features

- **User Authentication**:

  - Sign up with email and password
  - Log in with email and password
  - Log out with token revocation
  - JWT authentication with access and refresh tokens
  - HTTP-only cookies for secure refresh token storage
  - Token blacklisting/revocation system

- **Todo Management**:

  - Create new todo items with title, description, due date, and status
  - View a list of all your todo items
  - Update existing todos
  - Delete todos
  - Filter todos by status (pending, in-progress, completed)
  - Mark todos as completed
  - Pagination support

- **Security Features**:

  - Secure password hashing with bcrypt
  - Protected routes using auth middleware
  - CORS protection
  - Helmet.js security headers

- **UI/UX**:
  - Modern, responsive design with Tailwind CSS
  - Loading states and error handling
  - Toast notifications for feedback

## Tech Stack

### Frontend

- **React** with TypeScript
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API communication
- **React Toastify** for notifications

### Backend

- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Express Validator** for request validation
- **Helmet** for secure HTTP headers
- **CORS** for cross-origin resource sharing

## Project Structure

```
.
├── backend/                 # Backend Express application
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── middlewares/     # Express middlewares
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   └── index.ts         # Entry point
│   └── .env.example         # Environment variables template
│
└── frontend/                # React frontend application
    ├── public/              # Static files
    └── src/
        ├── components/      # Reusable components
        ├── hooks/           # Custom React hooks
        ├── pages/           # Page components
        ├── services/        # API services
        ├── store/           # Redux store and slices
        ├── types/           # TypeScript type definitions
        └── utils/           # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/Hisam-94/kazam-sde-2-todo.git
cd kazam-sde-2-todo
```

2. **Set up the backend:**

```bash
cd backend

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env
```

3. **Configure environment variables:**

Edit the `.env` file in the backend directory with your specific configurations:

```
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/todo-app
ACCESS_TOKEN_SECRET=your_strong_access_token_secret
REFRESH_TOKEN_SECRET=your_strong_refresh_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
CORS_ORIGIN=http://localhost:3000
```

4. **Set up the frontend:**

```bash
cd ../frontend

# Install dependencies
npm install
```

### Running the Application

1. **Start the backend server:**

```bash
cd backend

# Development mode with auto-restart
npm run dev

# OR build and run in production mode
npm run build
npm start
```

The backend server will start on http://localhost:5001 (or the port specified in your .env file).

2. **Start the frontend development server:**

```bash
cd frontend
npm start
```

The frontend development server will start on http://localhost:3000.

3. **Access the application:**

Open your browser and navigate to http://localhost:3000

## API Documentation

### Authentication Endpoints

| Method | Endpoint                | Description          | Auth Required                     |
| ------ | ----------------------- | -------------------- | --------------------------------- |
| POST   | /api/auth/register      | Register a new user  | No                                |
| POST   | /api/auth/login         | Login a user         | No                                |
| POST   | /api/auth/logout        | Logout a user        | Yes                               |
| POST   | /api/auth/refresh-token | Refresh access token | No (requires valid refresh token) |

### Todo Endpoints

| Method | Endpoint                | Description                | Auth Required |
| ------ | ----------------------- | -------------------------- | ------------- |
| GET    | /api/todos              | Get all todos with filters | Yes           |
| GET    | /api/todos/:id          | Get a specific todo        | Yes           |
| POST   | /api/todos              | Create a new todo          | Yes           |
| PUT    | /api/todos/:id          | Update a todo              | Yes           |
| DELETE | /api/todos/:id          | Delete a todo              | Yes           |
| PATCH  | /api/todos/:id/complete | Mark a todo as completed   | Yes           |

## Deployment

The application can be deployed on platforms like:

- Vercel or Netlify for the frontend
- Railway, Render, or Heroku for the backend
- MongoDB Atlas for the database

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
