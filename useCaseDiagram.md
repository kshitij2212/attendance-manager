# Use Case Diagram - Employee Management System

## 🎭 Actors

- **👤 Employee** - Regular user (manages own data)
- **👨‍💼 Admin** - System administrator (full access)
- **⚙️ System** - Automated processes

---

## 📊 Complete System Use Case Diagram

```mermaid
graph TB
    Employee((👤<br/>Employee))
    Admin((👨‍💼<br/>Admin))
    System((⚙️<br/>System))
    
    subgraph EMS["Employee Management System"]
        
        subgraph Auth["🔐 Authentication"]
            Login[Login]
            Register[Register]
            ViewProfile[View Profile]
        end
        
        subgraph EmpMgmt["👥 Employee Module"]
            CreateEmp[Create Employee]
            ListEmp[List Employees]
            UpdateEmp[Update Employee]
            DeleteEmp[Delete Employee]
        end
        
        subgraph DeptMgmt["🏢 Department Module"]
            CreateDept[Create Department]
            ManageDept[Manage Departments]
        end
        
        subgraph AttMgmt["📅 Attendance Module"]
            CheckIn[Mark Check-In]
            CheckOut[Mark Check-Out]
            ViewAtt[View Attendance]
            Reports[Generate Reports]
            AutoCalc[Auto Calculate]
        end
        
        subgraph LeaveMgmt["🏖️ Leave Module"]
            ApplyLeave[Apply Leave]
            ViewLeaves[View Leaves]
            ApproveLeave[Approve/Reject]
            AutoAtt[Auto Mark Attendance]
        end
    end
    
    %% Employee actions
    Employee --> Login
    Employee --> Register
    Employee --> ViewProfile
    Employee --> CheckIn
    Employee --> CheckOut
    Employee --> ViewAtt
    Employee --> ApplyLeave
    Employee --> ViewLeaves
    
    %% Admin actions
    Admin --> Login
    Admin --> ViewProfile
    Admin --> CreateEmp
    Admin --> ListEmp
    Admin --> UpdateEmp
    Admin --> DeleteEmp
    Admin --> CreateDept
    Admin --> ManageDept
    Admin --> ViewAtt
    Admin --> Reports
    Admin --> ViewLeaves
    Admin --> ApproveLeave
    
    %% System automated
    System --> AutoCalc
    System --> AutoAtt
    
    %% Triggers
    CheckIn -.trigger.-> AutoCalc
    CheckOut -.trigger.-> AutoCalc
    ApproveLeave -.trigger.-> AutoAtt
    
    style EMS fill:#f9f9f9,stroke:#333,stroke-width:3px
    style Auth fill:#e1f5ff,stroke:#01579b,stroke-width:2px
    style EmpMgmt fill:#fff3e0,stroke:#e65100,stroke-width:2px
    style DeptMgmt fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    style AttMgmt fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style LeaveMgmt fill:#fff9c4,stroke:#f57f17,stroke-width:2px
```

---

## 🔐 Authentication Use Cases

```mermaid
graph LR
    Employee((Employee))
    Admin((Admin))
    
    subgraph Auth["Authentication"]
        UC1[Register]
        UC2[Login]
        UC3[View Profile]
    end
    
    Employee --> UC1
    Employee --> UC2
    Employee --> UC3
    Admin --> UC2
    Admin --> UC3
    
    UC1 -->|includes| Hash[Hash Password]
    UC2 -->|includes| Verify[Verify Credentials]
    UC2 -->|includes| JWT[Generate JWT]
    
    style Auth fill:#e1f5ff,stroke:#01579b,stroke-width:2px
```

---

## 👥 Employee Management Use Cases

```mermaid
graph TB
    Admin((Admin))
    Employee((Employee))
    
    subgraph EmpModule["Employee Management"]
        UC4[Create Employee]
        UC5[List Employees]
        UC6[Update Employee]
        UC7[Delete Employee]
    end
    
    Admin --> UC4
    Admin --> UC5
    Admin --> UC6
    Admin --> UC7
    Employee -.own data only.-> UC6
    
    UC4 -->|requires| ValidUser[User Must Exist]
    UC7 -->|checks| NoPending[No Pending Leaves]
    
    style EmpModule fill:#fff3e0,stroke:#e65100,stroke-width:2px
```

---

## 🏢 Department Management Use Cases

```mermaid
graph TB
    Admin((Admin))
    
    subgraph DeptModule["Department Management"]
        UC8[Create Department]
        UC9[View Departments]
        UC10[Update Department]
        UC11[Delete Department]
    end
    
    Admin --> UC8
    Admin --> UC9
    Admin --> UC10
    Admin --> UC11
    
    UC8 -->|validates| Unique[Unique Name]
    UC11 -->|requires| NoEmp[No Employees Assigned]
    
    style DeptModule fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
```

---

## 📅 Attendance Management Use Cases

```mermaid
graph TB
    Employee((Employee))
    Admin((Admin))
    System((System))
    
    subgraph AttModule["Attendance Management"]
        UC12[Mark Check-In]
        UC13[Mark Check-Out]
        UC14[View My Attendance]
        UC15[View All Attendance]
        UC16[Generate Reports]
        UC17[Auto Calculate Hours]
        UC18[Detect Late Arrival]
    end
    
    Employee --> UC12
    Employee --> UC13
    Employee --> UC14
    
    Admin --> UC15
    Admin --> UC16
    
    System -.automated.-> UC17
    System -.automated.-> UC18
    
    UC12 -.triggers.-> UC18
    UC13 -.triggers.-> UC17
    
    style AttModule fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
```

---

## 🏖️ Leave Management Use Cases

```mermaid
graph TB
    Employee((Employee))
    Admin((Admin))
    System((System))
    
    subgraph LeaveModule["Leave Management"]
        UC19[Apply Leave]
        UC20[View My Leaves]
        UC21[Cancel Leave]
        UC22[View All Leaves]
        UC23[Approve Leave]
        UC24[Reject Leave]
        UC25[Auto Create Attendance]
    end
    
    Employee --> UC19
    Employee --> UC20
    Employee --> UC21
    
    Admin --> UC22
    Admin --> UC23
    Admin --> UC24
    
    System -.automated.-> UC25
    
    UC19 -->|validates| DateRange[Valid Date Range]
    UC21 -->|requires| Pending[Status = PENDING]
    UC23 -.triggers.-> UC25
    
    style LeaveModule fill:#fff9c4,stroke:#f57f17,stroke-width:2px
```

---

## 🔄 Key Workflows

### Daily Attendance Flow

```mermaid
sequenceDiagram
    participant E as Employee
    participant S as System
    participant D as Database
    
    Note over E,D: Morning
    E->>S: Mark Check-In
    S->>D: Create attendance
    Note over D: Auto-detect late<br/>Mark PRESENT
    D-->>E: Check-in success
    
    Note over E,D: Evening
    E->>S: Mark Check-Out
    S->>D: Update attendance
    Note over D: Calculate hours
    D-->>E: Check-out success (8.5 hrs)
```

### Leave Approval Flow

```mermaid
sequenceDiagram
    participant E as Employee
    participant A as Admin
    participant S as System
    participant D as Database
    
    E->>S: Apply Leave
    S->>D: Create (PENDING)
    D-->>E: Application submitted
    
    A->>S: View Pending
    S->>D: Fetch pending leaves
    D-->>A: Show pending list
    
    A->>S: Approve Leave
    S->>D: Update to APPROVED
    Note over D: Loop date range<br/>Create attendance<br/>status=LEAVE
    D-->>A: Approved + Auto-marked
```

---

## 📋 Use Case Summary Table

### Authentication Module
| ID | Use Case | Actor | Description |
|----|----------|-------|-------------|
| UC-01 | Register | Employee | Create user account |
| UC-02 | Login | Employee, Admin | Authenticate & get JWT |
| UC-03 | View Profile | Employee, Admin | View own details |

### Employee Module
| ID | Use Case | Actor | Description |
|----|----------|-------|-------------|
| UC-04 | Create Employee | Admin | Add new employee |
| UC-05 | List Employees | Admin | View all employees |
| UC-06 | Update Employee | Admin, Employee | Modify employee data |
| UC-07 | Delete Employee | Admin | Remove employee |

### Department Module
| ID | Use Case | Actor | Description |
|----|----------|-------|-------------|
| UC-08 | Create Department | Admin | Add new department |
| UC-09 | View Departments | Admin, Employee | List all departments |
| UC-10 | Update Department | Admin | Modify department |
| UC-11 | Delete Department | Admin | Remove department |

### Attendance Module
| ID | Use Case | Actor | Description |
|----|----------|-------|-------------|
| UC-12 | Mark Check-In | Employee | Record arrival |
| UC-13 | Mark Check-Out | Employee | Record departure |
| UC-14 | View My Attendance | Employee | See own history |
| UC-15 | View All Attendance | Admin | See everyone's attendance |
| UC-16 | Generate Reports | Admin | Daily/monthly reports |
| UC-17 | Auto Calculate | System | Calculate hours worked |
| UC-18 | Detect Late | System | Check if late arrival |

### Leave Module
| ID | Use Case | Actor | Description |
|----|----------|-------|-------------|
| UC-19 | Apply Leave | Employee | Submit leave request |
| UC-20 | View My Leaves | Employee | See own leave history |
| UC-21 | Cancel Leave | Employee | Cancel pending leave |
| UC-22 | View All Leaves | Admin | See all leave requests |
| UC-23 | Approve Leave | Admin | Approve leave request |
| UC-24 | Reject Leave | Admin | Reject leave request |
| UC-25 | Auto Create Attendance | System | Mark attendance for approved leaves |

---

## 🎯 Priority Matrix

```mermaid
quadrantChart
    title Use Case Implementation Priority
    x-axis Low Complexity --> High Complexity
    y-axis Low Value --> High Value
    
    Login: [0.2, 0.9]
    Register: [0.25, 0.85]
    Check-In: [0.3, 0.95]
    Check-Out: [0.3, 0.9]
    Apply Leave: [0.4, 0.85]
    Approve Leave: [0.6, 0.9]
    Create Employee: [0.45, 0.8]
    Monthly Report: [0.75, 0.85]
    Delete Employee: [0.35, 0.4]
    Update Profile: [0.3, 0.5]
```

---

**Last Updated**: Feb 2026