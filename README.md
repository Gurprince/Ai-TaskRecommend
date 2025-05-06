SkillSync AI Task Recommendation System

SkillSync is an AI-powered web application designed to enhance productivity by providing personalized task recommendations and AI-driven task analysis. Built as a prototype for a 6th-semester demo (March 27-28, 2025), SkillSync helps students, professionals, and freelancers manage tasks efficiently with a sleek, dark-themed interface and intuitive features.
Table of Contents

Features
Tech Stack
Installation
Usage
Folder Structure
Contributing
License

Features

Personalized Task Recommendations: Input skills and goals to receive AI-curated tasks tailored to your expertise and availability.
AI Task Analysis: Upload task submissions (code, text, files) for detailed feedback, including scores, strengths, and improvement suggestions.
Secure Authentication: JWT-based login and signup for user data privacy.
Responsive UI: Dark-themed interface (#28292A, purple accents, Inter font) with Spline animations, FAQ toggles, and a hero illustration, optimized for desktop and mobile.
Task Management: View and accept tasks, track progress, and analyze submissions in a clean dashboard.
Interactive Elements: Smooth navigation, hover animations, and accessibility features (ARIA labels, keyboard support).

Tech Stack

Frontend:
React (with React Router for navigation)
Tailwind CSS (styling)
Framer Motion (animations)
React Toastify (notifications)
React Icons (social icons)
Vite (build tool)

Backend:
Node.js
Express (RESTful API)
MongoDB (database)
JWT (authentication)
Axios (API requests)

Assets:
Custom hero image (hero.png)
Spline 3D animations

Tools:
Git (version control)
VS Code (development)
MongoDB Atlas (cloud database)

Installation
Follow these steps to set up SkillSync locally.
Prerequisites

Node.js (v18 or higher)
MongoDB Atlas account or local MongoDB instance
Git

Steps

Clone the Repository:
git clone https://github.com/yourusername/skill-sync-ai.git
cd skill-sync-ai

Set Up Frontend:
cd client
npm install

Set Up Backend:
cd ../server
npm install

Configure Environment Variables:

Create a .env file in the server folder:PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Replace your_mongodb_connection_string with your MongoDB Atlas URI or local MongoDB URI.
Replace your_jwt_secret with a secure string (e.g., mysecretkey123).

Run the Application:

Backend:cd server
npm start

The server will run on http://localhost:5000.
Frontend:cd client
npm run dev

The app will run on http://localhost:5173.

Access the App:

Open http://localhost:5173 in your browser.
Sign up or log in to explore tasks and analysis features.


Usage

Sign Up/Login: Create an account or log in using the /signup or /login pages.
Input Skills: On the /tasks page, enter your skills (e.g., Python, web development) and goals.
Receive Tasks: View AI-recommended tasks with details like time estimate and difficulty.
Analyze Tasks: Navigate to /tasks/:id/analyze, upload submissions, and receive AI feedback (scores, suggestions).
Track Progress: Check accepted tasks on /accepted-tasks to monitor your productivity.

Folder Structure
skill-sync-ai/
├── client/                    # Frontend (React)
│   ├── src/
│   │   ├── components/       # React components (Home.jsx, AnalyzeTask.jsx, etc.)
│   │   ├── styles/           # CSS files (Home.css, AnalyzeTask.css, etc.)
│   │   ├── assets/           # Images (hero.png)
│   │   ├── App.jsx           # Main app with routes
│   ├── public/               # Static assets
├── server/                    # Backend (Node.js/Express)
│   ├── controllers/          # API logic (taskController.js)
│   ├── routes/               # API routes (tasks.js)
│   ├── models/               # Mongoose schemas
│   ├── index.js              # Server entry point
├── screenshots/               # Screenshots for README
├── README.md                  # Project documentation
├── .gitignore                 # Git ignore file

Contributing
This prototype is part of a 6th-semester demo and open to feedback and contributions! To contribute:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Make changes and commit (git commit -m "Add your feature").
Push to your branch (git push origin feature/your-feature).
Open a pull request with a description of your changes.

Suggestions for improvement:

Enhance AI task recommendation accuracy.
Add task filtering (e.g., by difficulty or time).
Implement a dashboard for task analytics.
Improve accessibility (e.g., screen reader support).

Please report issues or share ideas via the Issues tab or contact me via LinkedIn!
License
This project is licensed under the MIT License.

SkillSync is a student project aimed at showcasing AI and full-stack development. Thank you for checking it out! 🚀
