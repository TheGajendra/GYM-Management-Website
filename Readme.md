# 🏋️‍♂️ GymSphere – Gym Management System

**GymSphere** is a complete gym management web application built using **Firebase** for authentication and real-time database functionalities. It supports both **members** and **admins** with separate dashboards and dynamic access to information.

---

## 🚀 Features

### 👤 For Normal Users (Gym Members)

- **User Registration**: Members can register themselves by filling out a registration form.
- **Subscription**: After registration, members can choose a gym plan and subscribe.
- **Login**: Members can securely log in using Firebase Authentication.
- **Profile Dashboard**: Members get a personal dashboard to:
  - View their gym profile
  - Download/view monthly **bills**
  - Receive **notifications** like reminders or diet plans
  - See assigned **fee packages**
- **Realtime Updates**: Changes made by admin reflect instantly in the member dashboard.

---

### 🛠️ For Admin

- **Admin Dashboard**: Accessible via a separate admin login page.
- **Manage Members**: Admin can:
  - View registered members
  - Approve and assign membership plans
  - Update or delete member details
- **Billing System**:
  - Generate and send bills for specific months
  - Store bills in Firebase Firestore
- **Notifications**:
  - Send custom notifications to members (e.g., diet plans, workout schedules)
- **Fee Package Assignment**: Assign monthly or custom packages
- **Reports**: Export data and track payments
- **Supplement Store & Diet Plan Section**: Track extra services
  
---


---

## 🔧 Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Firebase Firestore & Authentication
- **Design**: Custom CSS with responsive layout

---

## 🔐 Firebase Integration

- Firebase Authentication used for login/register
- Firestore Database to store:
  - User profiles
  - Billing records
  - Notifications
  - Admin data

---

## 📌 How It Works

1. **User visits the website** → Clicks on **Join Now**
2. Fills **registration form** → Data goes to Firebase
3. Admin sees the new user in the dashboard → Approves, assigns plan
4. Member logs in → Access to dashboard
5. Admin can send **bills & notifications** anytime → Member can view/download

---

## 📞 Contact

For any queries, suggestions or contributions, feel free to reach out.

---

## 📜 License

This project is licensed under the MIT License. Free to use and modify with attribution.
