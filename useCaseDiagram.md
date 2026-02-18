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
