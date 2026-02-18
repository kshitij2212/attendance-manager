# Use Case Diagram - Employee Management System

## 🎭 Actors

- **👤 Employee** - Regular user (manages own data)
- **👨‍💼 Admin** - System administrator (full access)
- **⚙️ System** - Automated processes

---

## 📊 Complete System Use Case Diagram
```mermaid
graph TB
    Employee((Employee))
    Admin((Admin))
    System((System))
    
    subgraph EMS["Employee Management System"]
        
        subgraph Auth["Authentication"]
            Login[Login]
            Register[Register]
            ViewProfile[View Profile]
        end
        
        subgraph EmpMgmt["Employee Module"]
            CreateEmp[Create Employee]
            ListEmp[List Employees]
            UpdateEmp[Update Employee]
            DeleteEmp[Delete Employee]
        end
        
        subgraph DeptMgmt["Department Module"]
            CreateDept[Create Department]
            ManageDept[Manage Departments]
        end
        
        subgraph AttMgmt["Attendance Module"]
            CheckIn[Mark Check-In]
            CheckOut[Mark Check-Out]
            ViewAtt[View Attendance]
            Reports[Generate Reports]
            AutoCalc[Auto Calculate]
        end
        
        subgraph LeaveMgmt["Leave Module"]
            ApplyLeave[Apply Leave]
            ViewLeaves[View Leaves]
            ApproveLeave[Approve/Reject]
            AutoAtt[Auto Mark Attendance]
        end
    end


    Employee --> Login
    Employee --> Register
    Employee --> ViewProfile
    Employee --> CheckIn
    Employee --> CheckOut
    Employee --> ViewAtt
    Employee --> ApplyLeave
    Employee --> ViewLeaves
    
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
    
    System --> AutoCalc
    System --> AutoAtt
    
    CheckIn -.-> AutoCalc
    CheckOut -.-> AutoCalc
    ApproveLeave -.-> AutoAtt
```

---

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
    
    UC1 --> Hash[Hash Password]
    UC2 --> Verify[Verify Credentials]
    UC2 --> JWT[Generate JWT]
```
---

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
    Employee -.-> UC6
    
    UC4 --> ValidUser[User Must Exist]
    UC7 --> NoPending[No Pending Leaves]
```


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
```

---
