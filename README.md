# solulab_todo_list
A todo list web application for assignment
This is a simple Todo List application built with Node.js, Express, MongoDB, and JWT authentication.

## Prerequisites

Before running the project, make sure you have the following installed on your machine:

- Node.js and npm (Node Package Manager)
- MongoDB Atlas account (for remote MongoDB database)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/CSENGGGEEK/solulab_todo_list.git
   ```

2. Install dependencies:

   ```bash
   cd solulab_todo_list
   npm install
   ```

3. Create a `.env` file in the root directory of the project with the following content:

   ```
   DB_URI="your-mongodb-uri"
   SECRET_KEY="your-secret-key"
   ```

   Replace `your-mongodb-uri` with your MongoDB connection URI obtained from MongoDB Atlas, and `your-secret-key` with a secret key for JWT token encryption.

4. Start the server:

   ```bash
   npm start
   ```

5. The server should now be running locally on port 3000 by default.

## Usage

- Visit `http://localhost:3000` in your web browser to access the application.
- Use the provided functionality to create, edit, and delete tasks.
- You can also log in and log out using the provided authentication mechanism.

## License

This project is licensed under the [MIT License](LICENSE).
