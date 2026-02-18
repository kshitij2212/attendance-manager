# ER Diagram - Employee Management System

## 📊 Complete ER Diagram

```mermaid
erDiagram
    USER ||--|| EMPLOYEE : "has one"
    EMPLOYEE }o--|| DEPARTMENT : "belongs to"
    EMPLOYEE ||--o{ ATTENDANCE : "has many"
    EMPLOYEE ||--o{ LEAVE : "applies many"
    USER ||--o{ LEAVE : "approves as admin"
    
    USER {
        ObjectId _id PK
        string email UK "unique, validated"
        string password "hashed, min 6 chars"
        string role "EMPLOYEE or ADMIN"
        boolean isActive "default true"
        timestamp createdAt
        timestamp updatedAt
    }
    
    EMPLOYEE {
        ObjectId _id PK
        ObjectId user FK,UK "unique reference to User"
        string name "lowercase, min 2 chars"
        string phone "10 digits"
        ObjectId department FK "nullable"
        string shiftStartTime "default 09:00"
        string shiftEndTime "default 18:00"
        date joinDate "default now"
        timestamp createdAt
        timestamp updatedAt
    }
    
    DEPARTMENT {
        ObjectId _id PK
        string name UK "unique, lowercase"
        string description "nullable"
        timestamp createdAt
        timestamp updatedAt
    }
    
    ATTENDANCE {
        ObjectId _id PK
        ObjectId employee FK "indexed"
        date date "normalized to midnight, indexed"
        datetime checkInTime "nullable"
        datetime checkOutTime "nullable, must be > checkIn"
        number totalHours "0-24, auto-calculated"
        string status "PRESENT, ABSENT, LEAVE"
        boolean lateArrival "auto-detected if > 9 AM"
        timestamp createdAt
        timestamp updatedAt
    }
    
    LEAVE {
        ObjectId _id PK
        ObjectId employee FK "indexed"
        string leaveType "CASUAL, SICK, EARNED"
        number totalDays "min 1"
        date startDate
        date endDate
        string reason "max 500 chars"
        string status "PENDING, APPROVED, REJECTED"
        ObjectId approvedBy FK "nullable, User reference"
        timestamp createdAt
        timestamp updatedAt
    }
```

---

## 📋 Table Summary

| Table | Description | Key Relationships |
|-------|-------------|-------------------|
| **USER** | All platform users with authentication credentials (employees and admins) | → Employee (1:1), → Leave as approver |
| **EMPLOYEE** | Employee profiles with personal details and work information | ← User (1:1), → Department, → Attendance, → Leave |
| **DEPARTMENT** | Organizational departments for employee grouping | ← Employee (many employees per department) |
| **ATTENDANCE** | Daily attendance records with check-in/out times and auto-calculations | ← Employee, auto-calculates hours and late arrivals |
| **LEAVE** | Leave applications with approval workflow and status tracking | ← Employee (applicant), ← User (approver) |

---

**Last Updated**: Feb 2026