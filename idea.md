# Employee Management System - Project Idea

## 🎯 Overview
A full-stack Employee Management System (HRMS) for managing employees, attendance, leaves, and departments with role-based access control.

## 🛠️ Tech Stack

### Backend (implemented a little bit)
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend (To be implemented)
- React.js
- Tailwind CSS 
- Axios for API calls
- React Router for navigation
---

## 🏗️ System Architecture
```mermaid
graph TB
    A[Client Browser] --> B[React Frontend]
    B --> C[Express Backend API]
    C --> D[MongoDB Database]
    C --> E[JWT Auth Middleware]
    E --> F[Protected Routes]
```

---

## 🎨 Core Features

### 1. Authentication & Authorization
- User registration and login (JWT-based)
- Two roles: **ADMIN** and **EMPLOYEE**
- Role-based access control (RBAC)
- Password encryption with bcrypt

### 2. Employee Management
- Create, view, update, delete employees
- Assign employees to departments
- Manage shift timings (default: 9 AM - 6 PM)
- Employee profile with personal details

### 3. Department Management
- Create and manage departments
- Assign multiple employees to departments
- View all employees in a department
- Department-wise employee listing

### 4. Attendance System
- **Check-in/Check-out**: Employees mark daily attendance
- **Auto-calculations**:
  - Total hours worked
  - Late arrival detection (after 9 AM)
  - Auto-mark PRESENT on check-in
- **Attendance status**: PRESENT, ABSENT, LEAVE
- **Reports**: Daily, monthly attendance reports
- **Business rules**:
  - One attendance per employee per day
  - Check-out must be after check-in
  - Leave status nullifies check-in/out

### 5. Leave Management
- **Leave types**: CASUAL, SICK, EARNED

- **Auto-attendance marking**: Approved leaves auto-create attendance records with status=LEAVE
- Employees can apply, admins approve/reject
- View leave history and status

---

## 👥 User Roles & Permissions

### ADMIN
✅ Full system access  
✅ Manage all employees and departments  
✅ View all attendance records  
✅ Approve/reject leave requests  
✅ Generate reports  

### EMPLOYEE
✅ View own profile  
✅ Mark own attendance (check-in/out)  
✅ Apply for leaves  
✅ View own attendance history  
✅ View own leave status  
❌ Cannot access other employees' data  

---

## 🚀 API Endpoints 

### (to be made)
### Auth (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user (returns JWT)
- `GET /me` - Get current user profile

### Employees (`/api/employees`)
- `POST /` - Create employee [ADMIN]
- `GET /` - List all employees [ADMIN]
- `GET /me` - Get own profile [EMPLOYEE]
- `GET /:id` - Get employee by ID
- `PUT /:id` - Update employee
- `DELETE /:id` - Delete employee [ADMIN]

### Departments (`/api/departments`)
- `POST /` - Create department [ADMIN]
- `GET /` - List all departments
- `GET /:id` - Get department with employees
- `PUT /:id` - Update department [ADMIN]
- `DELETE /:id` - Delete department [ADMIN]

### Attendance (`/api/attendance`)
- `POST /checkin` - Mark check-in [EMPLOYEE]
- `PUT /checkout` - Mark check-out [EMPLOYEE]
- `GET /my-attendance` - View own attendance [EMPLOYEE]
- `GET /employee/:id` - View employee attendance [ADMIN]
- `GET /daily/:date` - Daily report [ADMIN]
- `GET /monthly/:employeeId` - Monthly report [ADMIN]

### Leaves (`/api/leaves`)
- `POST /apply` - Apply leave [EMPLOYEE]
- `GET /my-leaves` - View own leaves [EMPLOYEE]
- `GET /all` - View all leaves [ADMIN]
- `GET /pending` - Pending leaves [ADMIN]
- `PUT /approve/:id` - Approve leave [ADMIN]
- `PUT /reject/:id` - Reject leave [ADMIN]

---

## 🎯 Smart Features

### Attendance Auto-Calculations
```javascript
// Automatic logic on save:
1. Normalize date to midnight (00:00:00)
2. If status = LEAVE → clear checkIn/Out, hours, late flag
3. If checkIn exists → auto-mark PRESENT
4. Calculate total hours: (checkOut - checkIn) / 3600000
5. Detect late arrival: checkIn > 9:00 AM
```

### Leave Approval Auto-Attendance
```javascript
// When admin approves leave:
1. Update leave status to APPROVED
2. Loop through startDate to endDate
3. For each date, create attendance record:
   - status: "LEAVE"
   - checkIn/Out: null
   - totalHours: null
4. Prevent duplicate attendance entries
```

---

## 🔐 Security Features
- Password hashing with bcrypt (10 salt rounds)
- JWT tokens with 24h expiration
- Role-based middleware for protected routes
- Input validation (email format, phone format, etc.)
- Passwords never returned in API responses (`select: false`)
- Unique indexes to prevent duplicates

---

## 📱 Frontend Features (To be built)

### Pages
1. **Login/Register Page**
2. **Dashboard** (role-specific)
   - Admin: Overview stats, pending leaves, today's attendance
   - Employee: Own stats, quick actions
3. **Employee Management** [ADMIN]
   - List, add, edit, delete employees
4. **Department Management** [ADMIN]
5. **Attendance Page**
   - Employee: Check-in/out buttons, own history
   - Admin: View all attendance, filters by date/employee
6. **Leave Management**
   - Employee: Apply leave form, leave history
   - Admin: Pending leaves list, approve/reject actions
7. **Reports** [ADMIN]
   - Monthly attendance reports
   - Department-wise stats


## 🔮 Future Enhancements
- Dashboard analytics with charts
- Export reports (PDF/Excel)
- Biometric integration

---

**Status**: In Development  
**Current Phase**: Backend Foundation  
**Last Updated**: Feb 2026