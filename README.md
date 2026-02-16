# SmartHRMS

A full-stack employee management system with automated attendance tracking, leave management, and payroll processing.

## 🎯 What It Does

Automates HR operations:
- Employee & department management
- Daily attendance (check-in/out, auto-calculate hours)
- Leave applications with approval workflow
- Payroll computation based on attendance

---

## 🛠️ Tech Stack

**Backend**  
Node.js • Express • MongoDB • Mongoose • JWT

**Frontend**  
React • Tailwind CSS • Axios

---

## 🏗️ Architecture

```
Routes → Controllers → Services → Repositories → Models
```

**OOP Principles Applied:**
- Encapsulation (business logic in services)
- Inheritance (BaseRepository)
- Polymorphism (leave validators)
- Dependency injection

**Design Patterns:**
- Repository Pattern
- Service Layer Pattern
- Strategy Pattern (leave validation)

---

## ✨ Key Features

### Attendance
- One record per employee per day
- Auto-calculate total hours
- Late arrival detection based on shift timings

### Leave Management
- Multiple types: Sick, Casual, Earned
- Each type has different validation rules
- Approval workflow (Pending → Approved/Rejected)

### Payroll
- Auto-compute salary from attendance + approved leaves

---

## 📁 Project Structure

```
src/
├── config/          # DB connection
├── models/          # Mongoose schemas
├── repositories/    # Data access (extends BaseRepository)
├── services/        # Business logic
├── controllers/     # Request handlers
├── routes/          # API endpoints
├── middlewares/     # Auth, validation, error handling
├── validators/      # Leave type validators
└── utils/           # Helpers (date, constants, response)
```

---

## 🔐 Security

- JWT authentication
- bcrypt password hashing
- Role-based access (Admin/Employee)
- Input validation

---

## 🎓 Focus

Built for **Software Engineering & System Design** milestone:
- Clean layered architecture
- OOP principles in practice
- Scalable backend design
- Production-ready code structure

---
