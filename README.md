# DRF React Site 🧩

This is a full-stack web application built with Django REST Framework and React.  
It was created for educational purposes and as a portfolio project to demonstrate my skills in backend and frontend development.

## 🚀 Features

The application includes:

### ✅ Todo App
- Add, edit, and delete tasks
- Mark tasks as completed
- Store tasks per user

### 🖼️ Image Gallery
- Search for images via the [Unsplash API](https://unsplash.com/developers)
- Save selected images to your personal gallery
- View your saved collection

### 💬 Chat App
- Real-time chat using WebSocket
- Built with Django Channels and React

## 🔧 Technologies Used

### Backend:
- Django
- Django REST Framework
- Djoser (for authentication)
- OAuth Toolkit (for Google login)
- Channels + Daphne + Redis
- PostgreSQL
- Pillow

### Frontend:
- React
- React Router DOM
- React Bootstrap
- Axios
- React Toastify
- React Icons
- @react-oauth/google

### Other:
- Docker & Docker Compose
- Git for version control
- PgAdmin for database management

## 🐳 Run with Docker

Access frontend at: http://localhost:3000
Access backend API at: http://localhost:8000

Make sure .env.local files are configured with proper credentials before running.

```bash
git clone https://github.com/fedorin90/drf-react-site.git
cd drf-react-site
docker-compose up --build
