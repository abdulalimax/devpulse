# DevPulse — Internal Tech Issue & Feature Tracker 🚀

### 📋 Project Overview

**DevPulse** is a robust, production-ready backend issue tracking system engineered for modern software engineering teams. It provides a collaborative platform to report bugs, suggest features, coordinate resolutions, and manage agile workflows with strict security and performance standards.

---

### 🌐 Submission & Deployment Links

- **GitHub Repository (Public):** [View Source Code](https://github.com/abdulalimax/devpulse)
- **Live Deployment (Public):** [Explore Live API / App](https://devpulse-rho-blue.vercel.app)

---

### ✨ Key Features & Architecture

- **Role-Based Access Control (RBAC):** Strict security separation and permission guards between *Contributor* and *Maintainer* roles.
- **Issue Management System:** Structured lifecycle workflows for tracking bugs and feature requests.
- **JWT Authentication:** Secure, stateless session handling using JSON Web Tokens.
- **Raw SQL Database Layer:** High-performance PostgreSQL operations utilizing native `pg` driver connections without relying on heavy ORMs.

---

### 🛠️ Technology Stack

- **Runtime:** Node.js (LTS 24.x or higher)
- **Language:** TypeScript (Strict Mode)
- **Framework:** Express.js (Modular Architecture)
- **Database:** PostgreSQL (Native `pg` driver)
- **Security & Validation:** `bcrypt`, `jsonwebtoken`
- **Deployment Platform:** Vercel

---

### 📊 Database Schema Summary

#### **1. Users Table**
- `id`: Auto-increment primary key
- `name`: Full display name
- `email`: Unique login email
- `password`: Hashed password (*strictly secured and never exposed in responses*)
- `role`: `contributor` or `maintainer` (default: `contributor`)
- `created_at` / `updated_at`: Auto timestamps

#### **2. Issues Table**
- `id`: Auto-increment primary key
- `title`: Maximum 150 characters
- `description`: Minimum 20 characters
- `type`: `bug` or `feature_request`
- `status`: `open`, `in_progress`, `resolved` (default: `open`)
- `reporter_id`: User reference mapped securely from JWT
- `created_at` / `updated_at`: Auto timestamps

---

### 🔌 API Endpoints Reference

#### **Authentication**
- `POST /api/auth/signup` — Register a new platform user
- `POST /api/auth/login` — Authenticate user and receive JWT session token

#### **Issues Management**
- `POST /api/issues` — Create a new issue/bug ticket *(Authentication required)*
- `GET /api/issues` — Retrieve all issues with advanced filtering and sorting support
- `GET /api/issues/:id` — Retrieve a single issue by its unique identifier
- `PATCH /api/issues/:id` — Update issue details based on role-based permissions
- `DELETE /api/issues/:id` — Delete an issue ticket *([Maintainer Only])*

---

### ⚙️ Local Installation & Setup Instructions

To run this backend project locally on your machine, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/abdulalimax/devpulse.git](https://github.com/abdulalimax/devpulse.git)
   cd devpulse
Install dependencies:

Bash
npm install
Configure environment variables:
Create a .env file in the root directory and add your configuration:

Code snippet
PORT=5000
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="super_secret_key_123_devpulse"
Build the project:

Bash
npm run build
Start the development server:

Bash
npm run dev
⚠️ Important Engineering Guidelines
All API endpoints strictly adhere to the defined specification.

Zero ORM usage; all database interactions are executed via secure raw SQL queries.

User passwords are cryptographically hashed and never returned in API responses.

Protected routes enforce mandatory JWT validation.

Built and maintained under strict TypeScript compilation constraints
