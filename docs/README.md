# 💈 Mauro Barbershop — Full Stack Order & Management System

A full-stack web application built for **Mauro Barbershop**, featuring an interactive client-side service catalog with dynamic cart management, automated Pix payment checkout, and an administrative back-end dashboard for real-time payment tracking and catalog updates.

---

### 🌐 Live Application & Resources

- **Web Application:** [Mauro Barbershop Site](https://brenowz.github.io/barbershop-system)
- **API Documentation:** [FastAPI Interactive Swagger Docs](https://mauro-barbershop-api.onrender.com/docs)

---

### 🚀 Key Features

#### 🌐 Client Application (Front-end)
- **Dynamic Service Catalog:** Browse haircut, beard, and combo services with up-to-date pricing and descriptions.
- **Interactive Shopping Cart:**
  - Add and remove services dynamically with real-time total price calculation.
  - Cart state persistence using browser `localStorage`.
  - Floating cart item counter badge and empty-state user feedback.
- **Automated Pix Checkout:** Instant generation of Pix QR Code and One-Click Copy-and-Paste payment keys.

#### 🔐 Administrative Dashboard (Back-end & Management)
- **Real-Time Payment Tracking:** Live list displaying verified client payments and order history.
- **Dynamic Catalog Management:** Admin interface to update service names, availability, and prices directly in the database without code redeployment.

---

### 🛠️ Tech Stack

- **Front-end:** HTML5, CSS3, JavaScript (ES6+ / Fetch API, LocalStorage)
- **Back-end:** Python, FastAPI, SQLAlchemy
- **Database:** PostgreSQL / SQLite
- **Deployment:** GitHub Pages (Front-end), Render (FastAPI & Database)

---

### 🔄 System Workflow

`Client Front-End (Cart & Pix)` ➔ `FastAPI REST API (Python)` ➔ `PostgreSQL Database` ➔ `Admin Dashboard`

---

### 💻 Local Development

1. **Clone & Open Front-end:**
   ```bash
   git clone [https://github.com/brenowz/barbershop-system.git](https://github.com/brenowz/barbershop-system.git)
