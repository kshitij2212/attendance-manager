# Use Case Diagram

## 🎭 Actors
- **Employee** - Regular user
- **Admin** - System administrator  
- **System** - Automated processes

---

## 📊 Main Use Case Diagram
```mermaid
graph LR
    Employee((Employee))
    Admin((Admin))
    System((System))
    
    subgraph HMS["HRMS - SmartHRMS"]
        subgraph Auth["🔐 Authentication"]
            Login[Login]
            ViewProfile[View Profile]
            UpdateProfile[Update Own Profile]
        end
        
        subgraph EmpMgmt["👥 Employee Management"]
            CreateEmp[Create Employee]
            ListEmp[List Employees]
            UpdateEmp[Update Employee]
            DeleteEmp[Delete Employee]
        end
        
        subgraph DeptMgmt["🏢 Department"]
            ManageDept[Manage Departments]
        end
        
        subgraph AttMgmt["⏱️ Attendance"]
            CheckIn[Check-In]
            CheckOut[Check-Out]
            ViewMyAtt[View My Attendance]
            ViewAllAtt[View All Attendance]
            CalcHours[Calculate Hours]
            DetectLate[Detect Late Arrival]
        end
        
        subgraph LeaveMgmt["📅 Leave"]
            ApplyLeave[Apply Leave]
            ViewMyLeaves[View My Leaves]
            ViewAllLeaves[View All Leaves]
            ApproveLeave[Approve/Reject Leave]
            ValidateLeave[Validate Leave Rules]
            MarkAttendance[Mark Leave Attendance]
        end
    end
    
    %% Employee Use Cases
    Employee --> Login
    Employee --> ViewProfile
    Employee --> UpdateProfile
    Employee --> CheckIn
    Employee --> CheckOut
    Employee --> ViewMyAtt
    Employee --> ApplyLeave
    Employee --> ViewMyLeaves
    
    %% Admin Use Cases
    Admin --> Login
    Admin --> ViewProfile
    Admin --> CreateEmp
    Admin --> ListEmp
    Admin --> UpdateEmp
    Admin --> DeleteEmp
    Admin --> ManageDept
    Admin --> ViewAllAtt
    Admin --> ViewAllLeaves
    Admin --> ApproveLeave
    
    %% System Automated
    System -.-> CalcHours
    System -.-> DetectLate
    System -.-> ValidateLeave
    System -.-> MarkAttendance
    
    %% Include/Extend relationships
    CheckOut -.include.-> CalcHours
    CheckIn -.include.-> DetectLate
    ApplyLeave -.include.-> ValidateLeave
    ApproveLeave -.include.-> MarkAttendance
```
---

## 📋 Use Cases Summary

| Use Case | Actor | Description |
|----------|-------|-------------|
| Login | Employee, Admin | Authenticate user with JWT |
| Check-In | Employee | Mark daily check-in with timestamp |
| Check-Out | Employee | Mark check-out, auto-calculate hours |
| View Attendance | Employee, Admin | View attendance history |
| Apply Leave | Employee | Submit leave request with validation |
| Approve/Reject Leave | Admin | Process leave requests |
| Manage Employees | Admin | CRUD operations on employees |
| Manage Departments | Admin | CRUD operations on departments |
| Auto Calculate Hours | System | Calculate total working hours |
| Validate Leave Rules | System | Apply type-specific leave rules |

---