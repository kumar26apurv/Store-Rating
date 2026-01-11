# Store Rating Platform - Frontend

A modern React frontend for the Store Rating Platform API, built with Vite and styled with Tailwind CSS.

## Setup

### Prerequisites

- Node.js 18+
- Backend API running on port 3001 (default)

### Installation

```bash
cd Frontend
npm install
```

### Running

```bash
npm run dev
```

The app will run at `http://localhost:3000`.

### Configuration

The backend base URL is configured in two places:

1. **Vite proxy** (`vite.config.js`): Proxies `/api` requests to `http://localhost:3001`
2. **API service** (`src/services/api.js`): Uses `/api` as base URL (proxied by Vite)

To change the backend URL, edit the `proxy.target` in `vite.config.js`:

```js
proxy: {
  '/api': {
    target: 'http://localhost:3001', // Change this
    changeOrigin: true
  }
}
```

## Page to API Route Mapping

| Page | Route | Backend API | Auth Required |
|------|-------|-------------|---------------|
| Login | `/login` | `POST /api/users/login` | No |
| Signup | `/signup` | `POST /api/users/signup` | No |
| Profile | `/profile` | `GET /api/users/profile`, `PUT /api/users/change-password` | Yes |
| Stores | `/stores` | `GET /api/stores` | No (ratings require auth) |
| Rate Store | (inline on Stores) | `POST /api/ratings`, `PUT /api/ratings` | Yes |
| Owner Dashboard | `/owner/dashboard` | `GET /api/stores/my-dashboard` | Yes (store_owner) |
| Admin Dashboard | `/admin/dashboard` | `GET /api/admin/dashboard-stats` | Yes (system_admin) |
| Admin Users | `/admin/users` | `GET /api/admin/users`, `POST /api/admin/users` | Yes (system_admin) |
| Admin Create Store | `/admin/stores` | `POST /api/stores` | Yes (system_admin) |

## Features by Role

### Public (No login)
- View all stores with search and sort
- Sign up / Login

### Normal User
- All public features
- View profile
- Change password
- Rate stores (1-5)
- Modify own ratings

### Store Owner
- All normal user features
- View own store dashboard with ratings

### System Admin
- All normal user features
- View admin dashboard stats
- Manage users (list, search, filter, create)
- Create new stores

## Project Structure

```
Frontend/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── README.md
└── src/
    ├── main.jsx              # App entry point
    ├── App.jsx               # Router and navigation
    ├── services/
    │   └── api.js            # API fetch wrappers
    ├── pages/
    │   ├── Login.jsx         # User login
    │   ├── Signup.jsx        # User registration
    │   ├── Profile.jsx       # User profile + change password
    │   ├── Stores.jsx        # Store list + rating
    │   ├── OwnerDashboard.jsx# Store owner view
    │   ├── AdminDashboard.jsx# Admin stats
    │   ├── AdminUsers.jsx    # Admin user management
    │   └── AdminStores.jsx   # Admin store creation
    └── styles/
        └── index.css         # Tailwind directives + custom components
```

## API Service (`src/services/api.js`)

Centralized API calls with automatic token handling:

```js
// Auth
signup(userData)        // POST /api/users/signup
login(credentials)      // POST /api/users/login
logout()                // Clears local storage
getProfile()            // GET /api/users/profile
changePassword(data)    // PUT /api/users/change-password

// Stores
getStores(params)       // GET /api/stores?search=&sortBy=&order=
createStore(data)       // POST /api/stores (admin)
getOwnerDashboard()     // GET /api/stores/my-dashboard

// Ratings
addRating(data)         // POST /api/ratings
modifyRating(data)      // PUT /api/ratings

// Admin
getAdminDashboardStats()    // GET /api/admin/dashboard-stats
getAdminUsers(params)       // GET /api/admin/users?search=&role=&sortBy=&order=
adminCreateUser(data)       // POST /api/admin/users
```

## Validation Rules (matches backend)

- **Name**: 20-60 characters
- **Password**: 8-16 characters, at least 1 uppercase, 1 special character
- **Email**: Valid email format
- **Rating**: Integer 1-5

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **React Router 6** - Client-side routing
- **Tailwind CSS** - Utility-first styling

## Notes

- JWT tokens are stored in localStorage
- Navigation adapts based on user role
- Forms include client-side validation matching backend rules
- Modern UI with gradients, shadows, and smooth transitions
- Responsive design for mobile and desktop
