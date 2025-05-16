# Job Portal Backend

This is the backend server for the Job Portal application, built with Node.js and Express.js.

## 🚀 Features

- User Authentication & Authorization
- Job Posting and Management
- Resume Upload and Processing
- Email Notifications
- PDF Processing
- AI Integration (OpenAI & Google AI)
- Cloud Storage Integration (Cloudinary)

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Cloudinary for File Storage
- OpenAI & Google AI Integration
- Nodemailer for Email
- PDF Processing Libraries

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Cloudinary Account
- OpenAI API Key
- Google AI API Key

## 🔧 Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   ```

## 🚀 Running the Application

Development mode:
```bash
npm run dev
```

## 📁 Project Structure

```
Backend/
├── controllers/     # Route controllers
├── models/         # Database models
├── routes/         # API routes
├── middlewares/    # Custom middlewares
├── utils/          # Utility functions
├── temp/           # Temporary files
└── index.js        # Entry point
```

## 🔐 API Endpoints

- Authentication
  - POST /api/auth/register
  - POST /api/auth/login
  - POST /api/auth/logout

- Jobs
  - GET /api/jobs
  - POST /api/jobs
  - GET /api/jobs/:id
  - PUT /api/jobs/:id
  - DELETE /api/jobs/:id

- Users
  - GET /api/users/profile
  - PUT /api/users/profile
  - POST /api/users/resume

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 📝 License

This project is licensed under the MIT License.




# Job Portal Frontend

A modern, responsive job portal frontend built with React, Vite, and Tailwind CSS.

## 🚀 Features

- Modern UI with Tailwind CSS
- Responsive Design
- Dark/Light Mode
- Job Search and Filtering
- User Authentication
- Profile Management
- Resume Upload
- Job Applications
- Interactive Charts and Analytics
- Toast Notifications
- Form Validation
- Redux State Management

## 🛠️ Tech Stack

- React 18
- Vite
- Tailwind CSS
- Redux Toolkit
- React Router DOM
- Axios
- Radix UI Components
- Framer Motion
- React Icons
- React Hot Toast
- Recharts
- Typewriter Effect
- Lottie Animations

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🔧 Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## 🚀 Running the Application

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/         # Page components
│   ├── features/      # Redux slices
│   ├── hooks/         # Custom hooks
│   ├── utils/         # Utility functions
│   ├── assets/        # Static assets
│   ├── styles/        # Global styles
│   ├── App.jsx        # Root component
│   └── main.jsx       # Entry point
├── public/            # Public assets
└── index.html         # HTML template
```

## 🎨 UI Components

The project uses a combination of:
- Radix UI for accessible components
- Headless UI for unstyled components
- Custom Tailwind components
- Framer Motion for animations
- Lottie for animated illustrations

## 🔐 Authentication

- JWT-based authentication
- Protected routes
- Persistent login state
- Role-based access control


## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 📝 License

This project is licensed under the MIT License.
