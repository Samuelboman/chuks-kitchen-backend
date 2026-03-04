# Chuks Kitchen Backend API

A food ordering and customer management system built for Chuks Kitchen.
Built with Node.js, Express, and MongoDB.

---

## How to Run

1. Clone the repo

   git clone https://github.com/Samuelboman/chuks-kitchen-backend.git

2. Install dependencies

   npm install

3. Create a `.env` file in the root folder

   MONGO_URI=your_mongodb_connection_string
   PORT=5000

4. Start the server

   nodemon server.js

## API Endpoints

### User

| Method | Endpoint | Description |

| POST | /api/users/signup | Register a new user |

### Food

| Method | Endpoint | Description |

| GET | /api/foods | Get all food items |
| POST | /api/foods | Add a food item (Admin) |

### Cart

| Method | Endpoint | Description |

| POST | /api/cart | Add item to cart |
| GET | /api/cart/:userId | View cart |
| DELETE | /api/cart/:userId | Clear cart |

### Orders

| Method | Endpoint | Description |

| POST | /api/orders | Place an order |
| GET | /api/orders/:id | Get order details |
| PATCH | /api/orders/:id/status | Update order status |
| POST | /api/orders/:id/cancel | Cancel an order |

---

## Tech Stack

- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose

---

## Author

Samuel Boman — Trueminds Innovations Backend Developer Intern
