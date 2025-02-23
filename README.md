# ChatCord - MERN Stack Chat App

ChatCord is a real-time chat web application built with the MERN (MongoDB, Express, React, Node.js) stack, using Socket.io for WebSocket-based messaging and JWT for authentication.

## Live Demo
[ChatCord](https://chatcord-k1bi.onrender.com/)

## Tech Stack
- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB (Atlas)
- **Authentication**: JSON Web Tokens (JWT)
- **Real-time Communication**: Socket.io
- **Hosting**: Render

## Installation
### Prerequisites
- Node.js installed
- MongoDB Atlas or local MongoDB instance

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/wendywendo/ChatCord.git
   cd ChatCord/server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory and add:
   ```plaintext
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:5173 (or relevant frontendURL)
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory and add:
   ```plaintext
   VITE_API_URL=http://localhost:8000 (or relevant backendURL)
   ```
4. Start the React app:
   ```bash
   npm run dev
   ```

## Usage
1. Sign up and log in to access chat features.
2. Start a new conversation or join an existing one.
3. Enjoy real-time messaging with others.

## Future Improvements
- ✅ Read receipts
- ✅ Improved UI/UX design
- ✅ Notifications for new messages
- ✅ Mobile responsiveness

## Contributing
Feel free to fork this repository, create a new branch, and submit a pull request with your changes.

## License
This project is licensed under the MIT License.

