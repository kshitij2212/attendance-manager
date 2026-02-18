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

## 🔐 User & Employee Classes

```mermaid
classDiagram
    class User {
        <<Model>>
        +ObjectId _id
        +String email UK
        -String password
        +String role
        +Boolean isActive
        +Date createdAt
        +Date updatedAt
        ---
        +pre_save() void
        +comparePassword(pwd) Boolean
    }
    
    class Employee {
        <<Model>>
        +ObjectId _id
        +ObjectId user FK UK
        +String name
        +String phone
        +ObjectId department FK
        +String shiftStartTime
        +String shiftEndTime
        +Date joinDate
        +Date createdAt
        +Date updatedAt
    }
    
    User "1" -- "1" Employee : references
    
    note for User "email: unique, validated\npassword: min 6 chars, hashed\nrole: enum [EMPLOYEE, ADMIN]\ndefault isActive: true"
    
    note for Employee "name: lowercase, min 2 chars\nphone: 10 digits validation\ndefault shift: 09:00 - 18:00"
```

---

## 🏢 Department Class

```mermaid
classDiagram
    class Department {
        <<Model>>
        +ObjectId _id
        +String name UK
        +String description
        +Date createdAt
        +Date updatedAt
        ---
        +employees() Virtual~Array~
    }
    
    class Employee {
        +ObjectId _id
        +ObjectId department FK
        +String name
    }
    
    Department "1" <-- "many" Employee : assigned to
    
    note for Department "name: unique, lowercase\nvirtual field populates employees"
```

---

## 📅 Attendance Class

```mermaid
classDiagram
    class Attendance {
        <<Model>>
        +ObjectId _id
        +ObjectId employee FK
        +Date date
        +Date checkInTime
        +Date checkOutTime
        +Number totalHours
        +String status
        +Boolean lateArrival
        +Date createdAt
        +Date updatedAt
        ---
        +pre_save() void
    }
    
    class Employee {
        +ObjectId _id
        +String name
    }
    
    Employee "1" <-- "many" Attendance : tracks
    
    note for Attendance "Compound Index: (employee, date) - unique\nstatus: enum [PRESENT, ABSENT, LEAVE]\npre-save: auto-calculate hours & late"
```

### Pre-save Hook Logic
```javascript
1. Normalize date to midnight
2. If status=LEAVE → clear checkIn/Out, hours, late
3. If checkIn exists → auto-mark PRESENT
4. Calculate totalHours if both times exist
5. Detect lateArrival if checkIn > 9:00 AM
```

---

## 🏖️ Leave Class

```mermaid
classDiagram
    class Leave {
        <<Model>>
        +ObjectId _id
        +ObjectId employee FK
        +String leaveType
        +Number totalDays
        +Date startDate
        +Date endDate
        +String reason
        +String status
        +ObjectId approvedBy FK
        +Date createdAt
        +Date updatedAt
    }
    
    class Employee {
        +ObjectId _id
        +String name
    }
    
    class User {
        +ObjectId _id
        +String role
    }
    
    Employee "1" <-- "many" Leave : applies
    User "1" <-- "many" Leave : approves
    
    note for Leave "leaveType: [CASUAL, SICK, EARNED]\nstatus: [PENDING, APPROVED, REJECTED]\nreason: max 500 chars\napprovedBy: admin user reference"
```

---

## 🔗 Relationships Summary

```mermaid
erDiagram
    User ||--|| Employee : "1:1"
    Employee }o--|| Department : "N:1"
    Employee ||--o{ Attendance : "1:N"
    Employee ||--o{ Leave : "1:N"
    User ||--o{ Leave : "approves"
    
    User {
        ObjectId _id PK
        String email UK
        String password
        String role
    }
    
    Employee {
        ObjectId _id PK
        ObjectId user FK,UK
        ObjectId department FK
        String name
    }
    
    Department {
        ObjectId _id PK
        String name UK
    }
    
    Attendance {
        ObjectId _id PK
        ObjectId employee FK
        Date date
        String status
    }
    
    Leave {
        ObjectId _id PK
        ObjectId employee FK
        ObjectId approvedBy FK
        String status
    }
```

---

## 📊 Class Properties Details

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

### Default Values

| Class | Field | Default |
|-------|-------|---------|
| User | role | "EMPLOYEE" |
| User | isActive | true |
| Employee | shiftStartTime | "09:00" |
| Employee | shiftEndTime | "18:00" |
| Employee | joinDate | Date.now |
| Attendance | status | "ABSENT" |
| Attendance | lateArrival | false |
| Leave | status | "PENDING" |
| Department | description | null |

---

## 🎯 Key Design Patterns

### 1. Repository Pattern
- Models encapsulate data access
- Mongoose handles CRUD operations
- Pre/post hooks for business logic

### 2. Virtual Properties
- Department has virtual `employees` field
- Populates related employees dynamically

### 3. Middleware Hooks
- **User pre-save**: Hash password if modified
- **Attendance pre-save**: Auto-calculations
- **User methods**: comparePassword()

### 4. Referential Integrity
- Foreign keys with `ref` to other models
- Populated queries for related data

---

## 📝 Method Signatures

```javascript
// User methods
userSchema.methods.comparePassword(enteredPassword: String): Promise<Boolean>

// Attendance pre-save hook
attendanceSchema.pre("save", function(next: Function): void)

// Department virtual field
departmentSchema.virtual("employees", {
  ref: "Employee",
  localField: "_id",
  foreignField: "department"
})
```

---

**Last Updated**: Feb 2026