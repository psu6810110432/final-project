# 🛋️ HomeAlright E-Commerce Platform

HomeAlright is a modern e-commerce platform for furniture and home goods. The system is divided into a robust backend API, a responsive frontend web application, and a dedicated automated testing suite.

## 🏗 Project Structure

This repository contains the following main directories:

* `frontend/`: The client-side web application built with [React](https://react.dev/) and [Vite](https://vitejs.dev/).
* `Backend/`: The core REST API and business logic built with [NestJS](https://nestjs.com/).
* `testing/`: End-to-End (E2E) automated tests using [Playwright](https://playwright.dev/).

## 🚀 Tech Stack

* **Frontend:** React, Vite, TypeScript, Tailwind CSS
* **Backend:** Node.js, NestJS, TypeScript
* **Database:** PostgreSQL (Neon)
* **Tooling:** npm, ESLint, Prettier, PM2 (for production deployment)
* **Testing:** Playwright (E2E Testing)
* **Infrastructure:** Docker & Docker Compose (Backend services)

## 🛠 Prerequisites

Before you begin, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* npm (comes with Node.js)
* [Git](https://git-scm.com/)
* Docker (Optional, for running local database services)

## ⚙️ Getting Started

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/psu6810110181/final-project.git
cd final-project
\`\`\`

### 2. Setup Backend 
Open a terminal and set up the backend application:
\`\`\`bash
cd Backend
npm install

# Copy environment variables and configure them
cp .env.example .env

# Start the development server
npm run start:dev
\`\`\`
*The Backend API will typically run on `http://localhost:3000` (or your configured port).*

### 3. Setup Frontend
Open a new terminal window and set up the frontend application:
\`\`\`bash
cd frontend
npm install

# Copy environment variables (if applicable)
cp .env.example .env

# Start the frontend development server
npm run dev
\`\`\`
*The Frontend will typically be available at `http://localhost:5173`.*

### 4. Running End-to-End Tests
To run the automated tests, open another terminal:
\`\`\`bash
cd testing
npm install
npx playwright install # Install required browsers for the first time
npx playwright test
\`\`\`

## 📜 Available Scripts

Here are the most commonly used commands for development:

**In `/frontend`:**
* `npm run dev`: Starts the Vite development server.
* `npm run build`: Builds the app for production to the `dist` folder.
* `npm run lint`: Runs ESLint to check code quality.

**In `/Backend`:**
* `npm run start:dev`: Starts the NestJS server in watch mode.
* `npm run build`: Compiles the NestJS application.
* `npm run test`: Runs unit tests.

**In `/testing`:**
* `npx playwright test`: Runs all end-to-end tests.
* `npx playwright show-report`: Views the detailed test report in your browser.

## 🚀 Production Deployment (Server)

If you are deploying this to a production server (e.g., Ubuntu via SSH), the basic workflow is:

\`\`\`bash
# Pull the latest code
git pull origin main

# Update Backend & Restart via PM2
cd Backend
npm install
npm run build
pm2 restart homealright-api --update-env

# Update Frontend & Build
cd ../frontend
npm install
npm run build
# Serve the /dist folder using Nginx or Apache
\`\`\`
