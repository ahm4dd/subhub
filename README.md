# 🌟 SubHub API

<div align="center">

![SubHub Logo](https://img.shields.io/badge/SubHub-API-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K)

**A subscription management API built with modern technologies**

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

</div>

---

## 📚 Quick Links

- 📖 **[Complete API Documentation](https://ahm4dd.github.io/subhub/)** - Interactive Swagger UI
- 🚀 **[Getting Started](#installation)** - Setup guide
- 🔐 **[Authentication](#authentication-endpoints)** - Security details
- 🏗️ **[Architecture](#tech-stack)** - Technical overview

---

SubHub allows users to manage their subscriptions, track renewal dates, and monitor subscription expenses with secure authentication and comprehensive rate limiting protection.

## Features

- **🔐 User Management**: Secure user registration and authentication
- **📋 Subscription Tracking**: Create and manage subscription records  
- **🎫 JWT Authentication**: Access and refresh token system
- **🛡️ Rate Limiting**: Protection against abuse with Arcjet
- **🤖 Bot Detection**: Automated bot protection
- **✅ Data Validation**: Comprehensive input validation and sanitization
- **🗄️ PostgreSQL Integration**: Robust database operations with Drizzle ORM

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT (JSON Web Tokens) with refresh tokens
- **Security**: Arcjet (rate limiting, bot detection, shield protection)
- **Password Hashing**: bcrypt
- **Development**: tsx, nodemon for hot reloading

## [Environment Setup](#env)

Create environment files for different stages:
- `.env.development.local`
- `.env.production.local`

Required environment variables (I have everything in .env.development.local):
```env
HOSTNAME=127.0.0.1
PORT=3000
DB_URL=postgresql://username:password@localhost:5432/database
JWT_SECRET=your-jwt-secret
JWT_SECRET_ADMIN=your-admin-jwt-secret
ARCJET_KEY=your-arcjet-key
ARCJET_ENV=development
```

## Installation

```bash
# MAKE SURE YOU HAVE PostgreSQL setup with subhub database

# Clone the repository
git clone https://github.com/ahm4dd/subhub.git

# cd into the cloned repository
cd subhub

# Install dependencies
npm install

# Run database migrations
npx drizzle-kit push

# Start development server
npm run dev
```

## API Reference

> **Interactive Documentation**: Visit our [**Swagger UI Documentation**](https://ahm4dd.github.io/subhub/) for a complete, interactive API reference with live testing capabilities.

### Authentication Endpoints

| Endpoint | Method | Description | Request Body | Response | Authentication |
|----------|--------|-------------|--------------|----------|----------------|
| `/api/v1/auth/sign-up` | POST | Register a new user | `{ name: string, email: string, password: string }` | `{ id, name, email, createdAt, updatedAt, token }` | None |
| `/api/v1/auth/sign-in` | POST | Authenticate user | `{ email: string, password: string }` | `{ token }` | None |
| `/api/v1/auth/sign-out` | POST | Sign out user | None | 204 No Content | Refresh Token (Cookie) |

### User Management Endpoints

| Endpoint | Method | Description | Request Body | Response | Authentication |
|----------|--------|-------------|--------------|----------|----------------|
| `/api/v1/users` | GET | Get all users (admin only) | None | `[{ id, name, email, createdAt, updatedAt }]` | Admin JWT |
| `/api/v1/users/:id` | GET | Get user details | None | `{ id, name, email, createdAt, updatedAt }` | User JWT (own profile) |
| `/api/v1/users` | POST | Create user (admin only) | `{ name: string, email: string, password: string }` | `{ id, name, email, createdAt, updatedAt }` | Admin JWT |
| `/api/v1/users/:id` | PUT | Update user | TBD | TBD | User JWT |
| `/api/v1/users/:id` | DELETE | Delete user | None | TBD | User JWT |

### Subscription Management Endpoints

| Endpoint | Method | Description | Request Body | Response | Authentication |
|----------|--------|-------------|--------------|----------|----------------|
| `/api/v1/subscriptions` | GET | Get all subscriptions | None | TBD | User JWT |
| `/api/v1/subscriptions/:id` | GET | Get subscription details | None | TBD | User JWT |
| `/api/v1/subscriptions` | POST | Create subscription | `{ name: string, price: number, category: string, startDate: Date, paymentMethod: string, frequency?: string, currency?: string }` | `{ id, name, price, category, ... }` | User JWT |
| `/api/v1/subscriptions` | PUT | Update subscription | TBD | TBD | User JWT |
| `/api/v1/subscriptions` | DELETE | Delete subscription | None | TBD | User JWT |
| `/api/v1/subscriptions/user/:id` | GET | Get user subscriptions | None | TBD | User JWT |
| `/api/v1/subscriptions/:id/cancel` | PUT | Cancel subscription | None | TBD | User JWT |
| `/api/v1/subscriptions/upcoming-renewals` | GET | Get upcoming renewals | None | TBD | User JWT |

### Token Management Endpoints

| Endpoint | Method | Description | Request Body | Response | Authentication |
|----------|--------|-------------|--------------|----------|----------------|
| `/api/v1/tokens/refresh` | POST | Refresh access token | None | `{ token }` | Refresh Token (Cookie) |
| `/api/v1/tokens/revoke` | POST | Revoke refresh token | None | 204 No Content | Refresh Token (Cookie) |

## Data Models

### User
```typescript
{
  id: string (UUID)
  name: string (min 3 characters)
  email: string (unique, valid email)
  passwordHash: string
  createdAt: Date
  updatedAt: Date
}
```

### Subscription
```typescript
{
  id: string (UUID)
  name: string (min 3 characters)
  userId: string (UUID, foreign key)
  price: number (1-99)
  currency: string ('USD' | 'EUR' | 'GBP')
  frequency: string ('daily' | 'weekly' | 'monthly' | 'yearly')
  status: string ('active' | 'cancelled' | 'expired')
  category: string ('sports' | 'news' | 'entertainment' | 'lifestyle' | 'technology' | 'finance' | 'politics' | 'other')
  paymentMethod: string
  startDate: Date
  renewalDate: Date (calculated automatically)
  createdAt: Date
  updatedAt: Date
}
```

### Refresh Token
```typescript
{
  token: string (primary key)
  userId: string (UUID, foreign key)
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
  revokedAt: Date (nullable)
}
```

## Authentication Flow

1. **Registration/Login**: User receives an access token (JWT) and refresh token (HTTP-only cookie)
2. **API Requests**: Include access token in Authorization header: `Bearer <token>`
3. **Token Refresh**: When access token expires, use refresh token to get a new access token
4. **Logout**: Revoke refresh token and clear cookies

## Security Features

### Arcjet Protection
- **Rate Limiting**: 6 requests per 12 seconds (token bucket algorithm)
- **Bot Detection**: Blocks malicious bots while allowing search engines
- **Shield Protection**: Guards against common attacks (SQL injection, etc.)

### Password Security
- bcrypt hashing with 10 salt rounds
- Passwords never stored in plain text
- Password hashes excluded from API responses

### JWT Security
- Separate secrets for user and admin tokens
- Short-lived access tokens (1 hour default)
- Long-lived refresh tokens (60 days)
- Secure HTTP-only cookies for refresh tokens

## Error Handling

The API uses custom error classes with appropriate HTTP status codes:

| Error Type | HTTP Status | Description |
|------------|-------------|-------------|
| ValidationError | 400 | Invalid input data |
| BadRequestError | 400 | Malformed request |
| AuthenticationError | 401 | Invalid credentials |
| AuthorizationError | 403 | Insufficient permissions |
| NotFoundError | 404 | Resource not found |
| ConflictError | 409 | Resource already exists |
| DatabaseError | 500 | Database operation failed |
| ServerError | 500 | Internal server error |

## Development

### Database Management
```bash
# Generate migration
npx drizzle-kit generate

# Push schema changes
npx drizzle-kit migrate

# Or
npx drizzle-kit push
```

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Strict TypeScript configuration
- Comprehensive error handling

## License

This project is licensed under the MIT License.
