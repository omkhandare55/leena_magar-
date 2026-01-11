# Approval System Documentation

## 📋 Overview

Your application has a **hierarchical approval system** where:
- **Admin** approves **Teachers**
- **Teachers** approve **Students**

This ensures proper access control and prevents unauthorized users from accessing the system.

## 🔐 How It Works

### Registration Flow

```
1. User Registers
   ↓
2. Account Created (approved: false)
   ↓
3. Cannot Login (pending approval)
   ↓
4. Approver Logs In
   ↓
5. Approver Sees Pending User
   ↓
6. Approver Clicks "Approve"
   ↓
7. User Can Now Login ✅
```

## 👥 User Roles & Permissions

| Role | Can Approve | Can Upload Notes | Can View Notes | Self-Approved |
|------|-------------|------------------|----------------|---------------|
| **Admin** | ✅ Teachers | ❌ No | ✅ Yes | ✅ Yes |
| **Teacher** | ✅ Students | ✅ Yes | ✅ Yes | ❌ No (Admin approves) |
| **Student** | ❌ None | ❌ No | ✅ Yes | ❌ No (Teacher approves) |

## 🎯 Approval Workflows

### Workflow 1: Approving a Teacher

**Prerequisites**: You must be logged in as **Admin**

1. A new teacher registers at `/register.html`
2. Teacher receives message: "Registration successful. Please wait for approval from your teacher or admin."
3. Teacher **cannot login** yet
4. Admin logs in with admin@example.com
5. Admin clicks "**Approvals**" in the sidebar menu
6. Admin sees the pending teacher with details:
   - Full Name
   - Email
   - Role: Teacher
   - Registration Date
7. Admin clicks "**✅ Approve**" button
8. Success message appears
9. Teacher can now login successfully

### Workflow 2: Approving a Student

**Prerequisites**: You must be logged in as **Teacher**

1. A new student registers at `/register.html`
2. Student receives message: "Registration successful. Please wait for approval from your teacher or admin."
3. Student **cannot login** yet
4. Teacher logs in (e.g., teacher1@example.com)
5. Teacher clicks "**Approvals**" in the sidebar menu
6. Teacher sees the pending student with details:
   - Full Name
   - Email
   - Role: Student
   - Registration Date
7. Teacher clicks "**✅ Approve**" button
8. Success message appears
9. Student can now login successfully

## 🔗 API Endpoints

### Get Pending Approvals

```
GET /api/approvals/pending
```

**Authentication**: Required (Admin or Teacher)

**Response for Admin**:
```json
{
  "pendingUsers": [
    {
      "id": "123",
      "email": "newteacher@example.com",
      "fullName": "John Doe",
      "role": "teacher",
      "approved": false,
      "createdAt": "2026-01-11T05:00:00Z"
    }
  ]
}
```

**Response for Teacher**:
```json
{
  "pendingUsers": [
    {
      "id": "456",
      "email": "newstudent@example.com",
      "fullName": "Jane Smith",
      "role": "student",
      "approved": false,
      "createdAt": "2026-01-11T05:00:00Z"
    }
  ]
}
```

### Approve User

```
POST /api/approvals/approve/:userId
```

**Authentication**: Required (Admin or Teacher)

**Permissions**:
- Admin can only approve teachers
- Teachers can only approve students
- Students cannot approve anyone

**Request**:
```
POST /api/approvals/approve/123
```

**Success Response**:
```json
{
  "message": "John Doe has been approved successfully"
}
```

**Error Responses**:
```json
// User not found
{ "error": "User not found" }

// Permission denied
{ "error": "Admin can only approve teachers" }
{ "error": "Teachers can only approve students" }
{ "error": "Students cannot approve users" }
```

## 🧪 Testing the Approval System

### Test Case 1: Teacher Approval by Admin

```bash
# 1. Start server
npm start

# 2. Open browser: http://localhost:3000/register.html
# 3. Fill form:
#    - Full Name: Test Teacher
#    - Email: testteacher@example.com
#    - Password: test123
#    - Role: Teacher
# 4. Click Register
# 5. Try to login → Should fail with "pending approval" message

# 6. Login as admin:
#    Email: admin@example.com
#    Password: admin123
# 7. Click "Approvals" in menu
# 8. See "Test Teacher" in pending list
# 9. Click "✅ Approve"
# 10. Logout

# 11. Login as testteacher@example.com → Should succeed ✅
```

### Test Case 2: Student Approval by Teacher

```bash
# 1. Open browser: http://localhost:3000/register.html
# 2. Fill form:
#    - Full Name: Test Student
#    - Email: teststudent@example.com
#    - Password: test123
#    - Role: Student
# 3. Click Register
# 4. Try to login → Should fail with "pending approval" message

# 5. Login as teacher:
#    Email: teacher1@example.com
#    Password: teacher123
# 6. Click "Approvals" in menu
# 7. See "Test Student" in pending list
# 8. Click "✅ Approve"
# 9. Logout

# 10. Login as teststudent@example.com → Should succeed ✅
```

## 🚫 Login Restrictions

### Before Approval

When a user tries to login before being approved:

**Error Message**:
```
"Your account is pending approval. Please contact your administrator."
```

**HTTP Status**: 403 Forbidden

### After Approval

User can login normally and access the dashboard.

## 📊 Current System Status

Run the verification script to see current approval status:

```bash
node test_approval_system.js
```

This will show:
- Current user status (approved/pending)
- Pending approvals by type
- Approval workflow diagram
- Testing instructions

## 🎬 Quick Demo

**For testing the complete flow right now:**

```bash
# 1. Start server
npm start
```

Then in your browser:

1. **Test Admin Approval**:
   - Login as admin (admin@example.com / admin123)
   - Click "Approvals" menu
   - See if there are pending teachers
   - Currently there is 1: ansari (omkh4242g@gmail.comm)
   - Approve them to test the flow

2. **Test Teacher Approval**:
   - Login as teacher (teacher1@example.com / teacher123)
   - Click "Approvals" menu
   - Register a new student first
   - Then approve that student

## 📱 UI/UX

### Approvals Page Features

- **Pending User Card** displays:
  - Full Name
  - Email Address
  - Role (Teacher/Student)
  - Registration Date
  - Approve Button

- **After Approval**:
  - Success notification appears
  - User removed from pending list
  - List automatically refreshes

### User Experience

- **Clear Feedback**: Users know they're pending approval
- **Role-Based Access**: Only see relevant pending approvals
- **One-Click Approval**: Simple approve button
- **Real-time Updates**: List refreshes after approval

## 🔒 Security Features

1. **Cannot Bypass Approval**: Unapproved users cannot login
2. **Role-Based Permissions**: Each role can only approve specific roles
3. **Session-Based Auth**: Secure session management
4. **Validation**: Server-side validation of approval permissions

## 🎉 Summary

✅ **Approval system is fully functional**
- Admin approves teachers
- Teachers approve students
- Unapproved users cannot login
- Clear UI for managing approvals
- Secure role-based permissions

The system is ready for deployment with proper access control!
