# Class Diagram - Employee Management System

## 📦 Complete System Class Diagram

```mermaid
classDiagram
    class User {
        +ObjectId _id
        +String email
        -String password
        +String role
        +Boolean isActive
        +Date createdAt
        +Date updatedAt
        +comparePassword(password) Boolean
    }
    
    class Employee {
        +ObjectId _id
        +ObjectId user
        +String name
        +String phone
        +ObjectId department
        +String shiftStartTime
        +String shiftEndTime
        +Date joinDate
        +Date createdAt
        +Date updatedAt
    }
    
    class Department {
        +ObjectId _id
        +String name
        +String description
        +Date createdAt
        +Date updatedAt
        +employees() Virtual
    }
    
    class Attendance {
        +ObjectId _id
        +ObjectId employee
        +Date date
        +Date checkInTime
        +Date checkOutTime
        +Number totalHours
        +String status
        +Boolean lateArrival
        +Date createdAt
        +Date updatedAt
    }
    
    class Leave {
        +ObjectId _id
        +ObjectId employee
        +String leaveType
        +Number totalDays
        +Date startDate
        +Date endDate
        +String reason
        +String status
        +ObjectId approvedBy
        +Date createdAt
        +Date updatedAt
    }
    
    User "1" --> "1" Employee : has
    Employee "many" --> "1" Department : belongs to
    Employee "1" --> "many" Attendance : has
    Employee "1" --> "many" Leave : applies
    User "1" --> "many" Leave : approves as admin
    
    note for User "Roles: EMPLOYEE, ADMIN\nPassword hashed with bcrypt"
    note for Attendance "Status: PRESENT, ABSENT, LEAVE\nAuto-calculates hours & late arrival"
    note for Leave "Type: CASUAL, SICK, EARNED\nStatus: PENDING, APPROVED, REJECTED"
```

---

### Validation Rules

| Class | Field | Validation |
|-------|-------|------------|
| User | email | Unique, regex: `/^\S+@\S+\.\S+$/` |
| User | password | Min 6 chars, hashed with bcrypt |
| User | role | Enum: EMPLOYEE, ADMIN |
| Employee | name | Min 2 chars, lowercase, trimmed |
| Employee | phone | Regex: `/^\d{10}$/` |
| Employee | user | Unique (1-to-1 with User) |
| Department | name | Unique, lowercase, trimmed |
| Attendance | date | Normalized to midnight |
| Attendance | checkOutTime | Must be > checkInTime |
| Attendance | totalHours | Min: 0, Max: 24 |
| Attendance | (employee, date) | Compound unique index |
| Leave | totalDays | Min: 1 |
| Leave | reason | Max 500 chars |

---
**Last Updated**: Feb 2026