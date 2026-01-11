# ⭐ Store Rating Platform (Full Stack MERN + SQL)

A full-stack web application where users can browse stores and rate them (1–5).  
The platform includes role-based access for **System Admin**, **Store Owner**, and **Normal Users** with dashboards, store management, user management, and rating system.

This project was developed as part of the **FullStack Intern Coding Challenge** assignment.

---

## 📌 Project Overview

The **Store Rating Platform** allows:

✅ Normal users to browse stores and submit ratings  
✅ Store owners to view their store dashboard and ratings received  
✅ Admin to manage users, create store owners, create stores, and monitor total platform stats

---

## 🚀 Features

### ✅ Authentication
- Login / Signup
- JWT based authentication
- Role-based protected routes (admin, store owner)

### ✅ Normal User
- View all registered stores
- Search stores
- Rate any store (1 to 5 stars)
- See overall store rating

### ✅ Store Owner Dashboard
- View their store details
- View ratings received
- View average rating
- Ratings distribution summary

### ✅ System Admin Dashboard
- Admin platform stats dashboard:
  - Total Users
  - Total Stores
  - Total Ratings
- User Management
  - List/Search/Filter/Sort users
  - Create users with roles:
    - Normal User
    - Store Owner
    - System Admin
- Store Management
  - Create stores and assign **store_owner**

---

## 👥 Roles & Permissions

| Role | Permissions |
|------|------------|
| Normal User | View stores + Rate stores |
| Store Owner | View own store dashboard + ratings |
| System Admin | Manage users, create stores, view stats |

---

## 🛠 Tech Stack

### Frontend
- React.js + Vite
- Tailwind CSS
- React Router DOM
- Axios / Fetch API

### Backend
- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL / MySQL (SQL database)
- JWT Authentication
- express-validator (backend validation)

---

