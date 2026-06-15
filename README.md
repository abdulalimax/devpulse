#  DevPulse

Internal Tech Issue and Feature Tracker  
A collaborative platform for software teams to report bugs suggest features and coordinate resolutions

---

##  Submission Deployment Links

* GitHub Repo Public: https://github.com/abdulalimax/devpulse  
* Live Deployment Public: https://devpulse-rho-blue.vercel.app  

---

##  Key Features

* Role-Based Access Control: Secure separation between contributor and maintainer permissions  
* Issue Management System: Structured workflow for bugs and feature requests  
* JWT Authentication: Stateless secure authentication using JSON Web Tokens  
* Raw SQL Database Layer: Direct PostgreSQL queries using native pg driver without ORM  

---

##  Technology Stack

* Runtime: Node.js LTS 24.x or higher  
* Language: TypeScript (Strict Mode)  
* Framework: Express.js (Modular Architecture)  
* Database: PostgreSQL (Native pg driver)  
* Security: bcrypt jsonwebtoken  

---

##  Database Schema Summary

### Users Table

* id: Auto-increment primary key  
* name: Full display name  
* email: Unique login email  
* password: Hashed password (never returned)  
* role: contributor or maintainer (default: contributor)  
* created_at: Auto timestamp  
* updated_at: Auto timestamp  

---

### Issues Table

* id: Auto-increment primary key  
* title: Maximum 150 characters  
* description: Minimum 20 characters  
* type: bug or feature_request  
* status: open in_progress resolved (default: open)  
* reporter_id: User reference from JWT  
* created_at: Auto timestamp  
* updated_at: Auto timestamp  

---

##  API Endpoints

### Authentication

* POST /api/auth/signup - Register new user  
* POST /api/auth/login - Login and receive JWT  

---

### Issues

* POST /api/issues - Create issue (Authentication required)  
* GET /api/issues - Get all issues with filter and sort support  
* GET /api/issues/:id - Get single issue  
* PATCH /api/issues/:id - Update issue based on role permissions  
* DELETE /api/issues/:id - Delete issue (Maintainer only)  

---

##  Setup Instructions

Clone repository  
git clone https://github.com/abdulalimax/devpulse.git  
cd devpulse  

Install dependencies  
npm install  

Create .env file  
PORT=5000
DATABASE_URL=postgresql://neondb_owner:npg_h6SAiXwcZ4HD@ep-cool-sun-aisjl3ls-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=super_secret_key_123_devpulse
 

Build project  
npm run build  

Run development server  
npm run dev  

---

##  Important Notes

* All API endpoints must match specification exactly  
* No ORM allowed, only raw SQL  
* Passwords must never be returned in responses  
* JWT required for protected routes  
* Strict TypeScript mode must be followed  

---

##  Project Summary

DevPulse is a backend issue tracking system built using Node.js, TypeScript, Express, and PostgreSQL with secure authentication, role-based access control, and raw SQL database operations  

---

##  Assignment Ready

This project is fully structured for backend evaluation and deployment submission
