# Roxiler Store Rating Platform API

An authenticated, role-based backend API for managing users, stores, and handling transactional, self-correcting rating submissions and modifications.

## 1. Tech Stack & Tools

* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL
* **ORM:** Sequelize (Transactions, Migrations, Seeders)
* **Security/Middleware:** `bcryptjs`, `jsonwebtoken` (JWT), `express-validator`, `cors`.

## 2. Setup & Installation (Getting Started)

### Prerequisites
* Node.js (v18+ recommended)
* PostgreSQL server

### Installation Steps

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate and Install:**
    ```bash
    cd roxiler-challange
    npm install
    ```
3.  **Environment Configuration (`.env`):** Create and configure your database and JWT secret variables.

### Database Initialization

1.  **Run Migrations:**
    ```bash
    npx sequelize db:migrate
    ```
2.  **Run Seeders (Initial Admin):** 
    ```bash
    npx sequelize db:seed:all
    ```
3.  **Start Server:**
    ```bash
    npm start
    # OR for development: npm run dev
    ```

## 3. API Endpoints Reference

| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/users/signup` | Public | Registers a new user (`normal_user`). |
| **POST** | `/api/auth/login` | Public | Logs in and returns a JWT token. |
| **PUT** | `/api/users/change-password` | Authenticated | Updates authenticated user's password. |
| **GET** | `/api/stores` | Public | Lists all stores, supports **Search** and **Sort**. |
| **POST** | `/api/ratings` | Authenticated | Submits a new rating (Transactional). |
| **PUT** | `/api/ratings` | Authenticated | **Modifies** an existing rating (Transactional). |
| **GET** | `/api/stores/my-dashboard` | `store_owner` | Views store average rating and list of users who rated it. |
| **GET** | `/api/admin/dashboard-stats` | `system_admin` | Total Users, Stores, and Ratings count. |
| **GET** | `/api/admin/users` | `system_admin` | Lists all users, supports **Search**, **Filter** (`?role=`), and **Sort**. |
| **POST** | `/api/admin/users` | `system_admin` | Creates a new user with any role. |
| **POST** | `/api/stores` | `system_admin` | Creates a new store. |

## 4. 🛠️ Core Architectural & Security Features

### 4.1. Atomic Database Transactions
Rating submission/modification is a two-step transactional process: 
1.  Update the `Rating` table.
2.  Recalculate and update the average in the `Store` table.
The entire flow is managed by Sequelize to ensure **rollback** upon failure, guaranteeing data consistency.

### 4.2. Authorization Model
* **Role-Based Authorization (RBAC):** Middleware protects Admin/Owner features (`403 Forbidden` on unauthorized access).
* **ID-Based Authorization:** User can only modify their own resources (`PUT /api/ratings` is only allowed if `req.user.id` matches the rating owner's ID).

### 4.3. Strict Input Validation
All entry points are protected by `express-validator` enforcing strict rules:
* **Name:** Min 20 / Max 60 chars.
* **Password:** 8-16 chars, must include 1 Uppercase and 1 Special Character.
* **Rating Value:** Integer between 1 and 5.

## 5. 🧪 Verification & Testing Guide

### 5.1. Transactional Rating Modification Flow

1.  **POST /api/ratings:** Submit an initial rating (e.g., `value: 3` for `storeId: 1`) using a Normal User token. (Expected: `201 Created`).
2.  **PUT /api/ratings:** Update the rating for the same store (e.g., `value: 5`).
3.  **Expected:** `200 OK`. The database check should confirm the `Rating` table value is **5** and the `Store` table's `rating` average is also updated accordingly.

### 5.2. Security Check (Forbidden Access)

1.  Login as `normal_user` (`<USER_TOKEN>`).
2.  Attempt to access an Admin route: **GET /api/admin/dashboard-stats**
3.  **Header:** `Authorization: Bearer <USER_TOKEN>`
4.  **Expected:** `403 Forbidden`.