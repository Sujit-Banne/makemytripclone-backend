# MakeMyTrip Backend

Express.js REST API backend for the MakeMyTrip application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with required variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/makemytrip
JWT_SECRET=your_secret_key
NODE_ENV=development
```

3. Start development server:
```bash
npm run dev
```

4. Start production server:
```bash
npm start
```

## API Endpoints

### Auth
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user

### Posts
- GET `/api/posts` - Get all posts
- GET `/api/posts/user/posts` - Get user's posts (protected)
- POST `/api/posts` - Create post (protected)
- PUT `/api/posts/:id` - Update post (protected)
- DELETE `/api/posts/:id` - Delete post (protected)

## Authentication

Include JWT token in Authorization header:
```
Authorization: Bearer <token>
```
