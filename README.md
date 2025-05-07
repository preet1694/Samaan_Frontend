# 📦 Samaan: Peer-to-Peer Package Delivery Platform

![React](https://img.shields.io/badge/frontend-React.js-61dafb?logo=react)
![Spring Boot](https://img.shields.io/badge/backend-Spring%20Boot-6DB33F?logo=springboot)
![MongoDB](https://img.shields.io/badge/database-MongoDB-4EA94B?logo=mongodb)

Live Project: 👉 [Visit Now](https://samaan.onrender.com)  
Backend Repository: 👉 [GitHub - Backend Repo](https://github.com/preet1694/Samaan-Backend)

---

## 🚀 Overview

**Samaan** is a peer-to-peer logistics platform that connects senders with carriers having spare vehicle space. It offers an innovative solution to traditional courier limitations through a community-driven delivery model. The system supports trip creation, package selection, and real-time communication via WebSocket.

---

## 🔑 Key Features

- 🧑‍💼 Role-based Authentication (Sender & Carrier)
- 🚗 Add/View Trips with Source, Destination & Capacity
- 💬 Real-Time Chat (WebSocket powered)
- 📊 Dynamic Dashboards for Both Roles
- 🔒 Secure Login & MongoDB Integration
- 🔍 Trip Matching and Package Request System
- 📦 Sender Feedback on Completed Trips

---

## 🧱 Tech Stack

| Category      | Technology                     |
|---------------|--------------------------------|
| Frontend      | React.js, Tailwind CSS         |
| Backend       | Spring Boot (Java)             |
| Database      | MongoDB Atlas                  |
| Real-Time     | WebSocket (STOMP protocol)     |
| Hosting       | Render (Backend), Render (Frontend) |
| Distance Calculation   | OpenCage Api   |

---

## 📚 Installation & Setup

### 🔧 Prerequisites
- Node.js v14+
- Java 17+
- MongoDB Atlas account
- Git

### 📦 Frontend Setup

```bash
git clone https://github.com/preet1694/Samaan.git
cd SamaanPooling
npm install
npm start
```

### 🔧 Backend Setup

```bash
git clone https://github.com/preet1694/Samaan-Backend.git
cd SamaanPooling-Backend
# Configure MongoDB URI and JWT_SECRET in application.properties
# Configure the application.properties file and add appropriate values
mvn spring-boot:run
```

---

## 🛠️ Core Modules

| Module              | Description                                      |
|---------------------|--------------------------------------------------|
| Authentication      | Login, registration, role management             |
| Trip Management     | Carrier adds/view trips                          |
| Trip Search         | Sender filters trips by city and date            |
| Chat System         | Real-time 1:1 messaging via WebSocket            |
| Dashboards          | Sender & Carrier views for trip management       |

---

## 📋 Usage Instructions

### 👤 Sender
- Register and login as a sender
- Search for carrier trips by location and date
- Chat with carrier and confirm delivery
- Provide feedback on completed trips

### 🚗 Carrier
- Register and login as a carrier
- Add new trips and view trip statistics
- Receive chat requests from senders
- Mark trips as completed

---


## 👨‍🎓 Authors

- **Preet Ketankumar Brahmbhatt** (IT116)  
- **Ranipa Vraj Munesh** (IT120)  
> *Department of Information Technology, Dharmsinh Desai University*

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📬 Contact

If you have any questions or suggestions:

- 📧 Email: `preet.brahmbhatt16@gmail.com`, `vrajranipa7@gmail.com`
- 🔗 LinkedIn : [Preet Brahmbhatt](https://linkedin.com/in/preet-brahmbhatt) [Vraj Ranipa](https://www.linkedin.com/in/vraj-ranipa-3ba173265/)
