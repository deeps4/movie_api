# Hi there, I'm Deepa 👋

Welcome to my GitHub profile! I'm a passionate developer, always eager to learn and build exciting projects. One of my most recent projects is the **Movie API**, which allows users to explore a vast collection of movies, genres, and directors, along with user-specific features like favorite movie lists. Here's more about the project!

---

## 🎬 Movie API

The Movie API is a RESTful API designed for movie lovers. It provides detailed information about movies, genres, and directors. Users can register, update their profiles, and manage their list of favorite movies.

### 🚀 Features

- **Return a list of ALL movies** to the user.
- **Return data about a single movie** (description, genre, director, image URL, whether it’s featured or not) by title.
- **Return data about a genre** (description) by name (e.g., "Thriller").
- **Return data about a director** (bio, birth year, death year) by name.
- **Allow new users to register** with a username, password, email, and date of birth.
- **Allow users to update their user info** (username, password, email, date of birth).
- **Allow users to add movies** to their list of favorites.
- **Allow users to remove movies** from their list of favorites.
- **Allow existing users to deregister** from the service.

### 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose for modeling)
- **Authentication**: JWT (JSON Web Tokens) & Passport.js for securing endpoints

### 🌐 API Endpoints

#### Movie Endpoints:

- **GET** `/movies`: Returns a list of all movies.
- **GET** `/movies/:title`: Returns data about a single movie by title.
- **GET** `/genres/:name`: Returns data about a genre by name (e.g., "Thriller").
- **GET** `/directors/:name`: Returns data about a director by name (e.g., bio, birth year, death year).

#### User Endpoints:

- **POST** `/users`: Allow a new user to register.
- **PUT** `/users/:username`: Update a user’s info (username, password, email, date of birth).
- **POST** `/users/:username/movies/:movieId`: Add a movie to a user’s list of favorites.
- **DELETE** `/users/:username/movies/:movieId`: Remove a movie from a user’s list of favorites.
- **DELETE** `/users/:username`: Deregister a user (i.e., delete their account).

### 📦 Installation & Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/movie_api.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file and add the following variables:

   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### 📚 API Documentation

Detailed documentation for the Movie API is available [here](https://your-api-docs-url.com).

### 🛡️ Authentication & Security

- **JWT Authentication**: Secure access to the API with JWT-based authentication.

---
