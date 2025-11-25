<!-- https://github.com/Ceja95/se_project_express/blob/main/models/user.js -->

<!-- https://github.com/Jonathan-Brandt/se_project_express -->

<!-- Currently on Step 8-->

# se_project_express — Node.js + Express.js Server

## 📌 Overview

A lightweight REST API that powers the **se_project_react** frontend. This server exposes endpoints for managing users and clothing items, including like/unlike functionality, and is built with **Node.js**, **Express.js**, and **MongoDB**.

> Frontend repo: https://github.com/thegrindnet/se_project_react

---

## 🚀 Project Features and Technologies

- Express.js REST API with clear routing and controllers
- MongoDB + Mongoose data models
- Input validation & centralized error handling
- CORS configured for local dev and production
- Environment-based configuration (.env)
- Dev server with hot reload (nodemon)

---

## 🗂️ Project Structure

```bash
se_project_express/
├─ src/
│  ├─ controllers/
│  │  ├─ clothingItems.js
│  │  └─ users.js
│  ├─ models/
│  │  ├─ clothingItem.js
│  │  └─ user.js
│  ├─ routes/
│  │  ├─ clothinItems.js
│  │  ├─ users.js
│  │  └─ index.js
│  ├─ utils/
│  │  ├─ erros.js
│  │  └─ successStatuses.js
│  └─ app.js
├─ .env (not committed)
├─ package.json
└─ README.md
```

---

## 🔧 Tech Stack

- **Runtime:** Node.js (LTS)
- **Web Framework:** Express.js
- **Database:** MongoDB (Atlas or local) with Mongoose
- **Validation:** Express-Validator
- **Dev Tools:** nodemon, ESLint, Prettier

---

## 🚀 Getting Started

### 1) Prerequisites

- Node.js (LTS ≥ 18)
- MongoDB database (local)

### 2) Clone & Install

```bash
# Backend
git clone https://github.com/thegrindnet/se_project_express.git
cd se_project_express
npm install
```

### 4) Run in Development

```bash
npm run dev
```

This runs the server with **nodemon** (auto-restart on file changes). Default URL: `http://localhost:${PORT}`.

---

## 🧩 API Overview

Base URL: `http://localhost:3001`

### Users

#### POST /users

Create a user.

- **Body:** `{ "name": "John Doe", "avatar": "https://example.com/avatar.png" }`
- **201 Created** → returns created user

#### GET /users

Get all users.

- **200 OK** → returns array of users

#### GET /users/:userId

Get a single user by ID.

- **200 OK** → returns user
- **404 Not Found** if not exists

### Clothing Items

#### GET /items

Get all clothing items.

- **200 OK** → returns array

#### POST /items

Create a clothing item.

- **Body:** `{ "name": "Jacket", "weather": "cold", "imageUrl": "https://img" }`
- **201 Created** → returns created item
- **400 Bad Request** on validation error (e.g., invalid URL)

#### DELETE /items/:itemId

Delete an item by its owner.

- **200 OK** → returns deleted item
- **403 Forbidden** if not owner
- **404 Not Found** if not exists

#### PUT /items/:itemId/likes

Like an item.

- **200 OK** → returns updated item

#### DELETE /items/:itemId/likes

Remove like from an item.

- **200 OK** → returns updated item

> Tip: If your course sprint requires specific status codes (e.g., **400** for validation errors, **500** for uncaught), keep those consistent in controllers.

---

## 🧪 Testing with Postman/cURL

**Create User**

```bash
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane",
    "avatar": "https://i.pravatar.cc/300"
  }'
```

**Create Item**

```bash
curl -X POST http://localhost:3001/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hoodie",
    "weather": "cold",
    "imageUrl": "https://picsum.photos/600"
  }'
```

---

## 🧱 Models (Mongoose)

### User

```js
{
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  avatar: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}
```

### ClothingItem

```js
{
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  weather: { type: String, required: true, enum: ['hot', 'warm', 'cold'] },
  imageUrl: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  createdAt: { type: Date, default: Date.now }
}
```

---

## ⚙️ Scripts

Make sure `package.json` includes helpful scripts like:

```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

---

**GitHub**

- [Link to the project on GitHub](https://github.com/thegrindnet/se_project_express.git)

---

## 🛠️ Plan on Improving the Project

- Add Authentication & Security – Implement user login with JWT tokens and password encryption using bcrypt.

- Enhance Validation & Error Handling – Use Joi for input validation and create clear, consistent error responses.

- Deploy to the Cloud – Host the API on Render or Railway and connect it to MongoDB Atlas for remote access.

- Improve Code & Testing – Refactor routes, add unit tests (Jest), and use ESLint + Prettier for clean, maintainable code.

- Integrate Frontend Seamlessly – Connect with the React app to enable full-stack functionality and improve user experience.
