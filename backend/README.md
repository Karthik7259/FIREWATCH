# 🔥 FireWatch Backend API

<div align="center">
  
  ## 🐍 Flask-based RESTful API Server
  
  *Powering the FireWatch IoT Fire Detection System*
  
  ![Python](https://img.shields.io/badge/Python-3.8+-blue?logo=python&logoColor=white)
  ![Flask](https://img.shields.io/badge/Flask-3.0.0-red?logo=flask&logoColor=white)
  ![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?logo=mongodb&logoColor=white)
  ![Render](https://img.shields.io/badge/Deployed%20on-Render-purple?logo=render&logoColor=white)
  
</div>

---

## 📋 Overview

The FireWatch Backend API is a robust Flask-based RESTful web service that serves as the central hub for the FireWatch IoT fire detection system. It handles sensor data collection, user authentication, real-time data processing, and provides endpoints for the mobile application.

### 🎯 Key Responsibilities
- **📡 IoT Data Collection**: Receives and processes sensor data from fire detection devices
- **🗄️ Data Storage**: Manages MongoDB database operations for sensor readings and user data
- **👤 User Management**: Handles user registration, authentication, and session management
- **📊 Real-time API**: Provides real-time data endpoints for the mobile application
- **🔗 Cross-platform Support**: CORS-enabled for web and mobile app integration

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Python 3.8+** 🐍
- **MongoDB Atlas Account** 🗄️ (or local MongoDB instance)
- **pip** (Python package manager) 📦

### 🛠️ Installation

1. **📂 Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **📦 Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **⚙️ Environment Setup**
   
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=your_mongodb_connection_string_here
   FLASK_ENV=development
   FLASK_DEBUG=True
   ```

4. **🏃‍♂️ Run the server**
   ```bash
   python main.py
   ```

   The server will start on `http://localhost:8080`

---

## 📊 API Documentation

### 🔥 Sensor Data Endpoints

#### **📤 POST /sensor**
Receives sensor data from IoT devices and stores it in MongoDB.

**Request Body:**
```json
{
  "temperature": 25.5,
  "smoke": 120,
  "flame_detected": false,
  "humidity": 60.2,
  "fire_alert": false
}
```

**Response:**
```json
{
  "status": "inserted",
  "inserted_id": "60f8b8c8e1b2a3c4d5e6f7g8"
}
```

#### **📥 GET /sensor**
Returns the latest sensor data from memory.

**Response:**
```json
{
  "temperature": 25.5,
  "smoke": 120,
  "flame_detected": false,
  "humidity": 60.2,
  "fire_alert": false
}
```

#### **📊 GET /data**
Returns the latest sensor data for dashboard display.

**Response:**
```json
{
  "temperature": 25.5,
  "smoke": 8.0,
  "flame_detected": false,
  "fire_alert": false,
  "humidity": 45.0
}
```

#### **📡 POST /data**
Alternative endpoint for receiving sensor data.

**Request Body:**
```json
{
  "temperature": 28.0,
  "smoke": 95,
  "flame_detected": true,
  "humidity": 55.0,
  "fire_alert": true
}
```

---

### 🗄️ Database Query Endpoints

#### **🔍 GET /latest**
Fetches the most recent document from MongoDB.

**Response:**
```json
{
  "status": "success",
  "data": {
    "_id": "60f8b8c8e1b2a3c4d5e6f7g8",
    "temperature": 25.5,
    "smoke": 120,
    "flame_detected": false,
    "humidity": 60.2,
    "fire_alert": false
  }
}
```

#### **📅 GET /latest-by-timestamp**
Fetches latest data sorted by timestamp field.

#### **📈 GET /recent/{limit}**
Fetches the most recent N documents.

**Example:** `GET /recent/5`

**Response:**
```json
{
  "status": "success",
  "count": 5,
  "data": [
    {
      "_id": "...",
      "temperature": 25.5,
      "smoke": 120,
      "flame_detected": false,
      "humidity": 60.2,
      "fire_alert": false
    }
  ]
}
```

---

### 👤 User Authentication Endpoints

#### **✍️ POST /auth/register**
Register a new user or login existing user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (New User):**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "user": {
    "id": "60f8b8c8e1b2a3c4d5e6f7g8",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Response (Existing User):**
```json
{
  "status": "success",
  "message": "Login successful",
  "user": {
    "id": "60f8b8c8e1b2a3c4d5e6f7g8",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### **🔑 POST /login**
Login with username and password.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "status": "success",
  "user_id": "60f8b8c8e1b2a3c4d5e6f7g8",
  "username": "johndoe"
}
```

#### **👥 GET /auth/users**
Get all registered users (admin endpoint).

**Response:**
```json
{
  "status": "success",
  "count": 2,
  "users": [
    {
      "id": "60f8b8c8e1b2a3c4d5e6f7g8",
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2025-06-23T10:30:00Z",
      "last_login": "2025-06-23T10:30:00Z"
    }
  ]
}
```

---

## 🏗️ Architecture

```
┌─────────────────────┐
│   IoT Sensors       │
│  (POST /sensor)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐    ┌─────────────────────┐
│   Flask API Server  │───▶│   MongoDB Atlas     │
│   (main.py)         │    │   (Database)        │
│   Port: 8080        │    │   Collections:      │
│                     │    │   - data            │
│   Routes:           │    │   - users           │
│   • /sensor         │    └─────────────────────┘
│   • /data           │
│   • /auth/*         │
│   • /latest         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Mobile App        │
│   (React Native)    │
│   Expo Client       │
└─────────────────────┘
```

---

## 🔧 Technology Stack

### 🐍 Core Framework
- **Flask 3.0.0** - Lightweight WSGI web application framework
- **Python 3.8+** - Programming language

### 🗄️ Database
- **PyMongo 4.6.1** - MongoDB driver for Python
- **MongoDB Atlas** - Cloud database service
- **BSON** - Binary JSON for MongoDB document handling

### 🌐 HTTP & CORS
- **Flask-CORS 4.0.0** - Cross-Origin Resource Sharing support
- **Requests 2.31.0** - HTTP library for API calls

### 🔧 Additional Dependencies
- **Werkzeug 3.0.1** - WSGI utility library
- **Jinja2 3.1.2** - Template engine
- **MarkupSafe 2.1.3** - String handling
- **itsdangerous 2.1.2** - Cryptographic signing

---

## 🗄️ Database Schema

### 📊 Sensor Data Collection (`data`)
```json
{
  "_id": "ObjectId",
  "temperature": "Number (°C)",
  "smoke": "Number (ppm)",
  "flame_detected": "Boolean",
  "humidity": "Number (%)",
  "fire_alert": "Boolean",
  "timestamp": "Date (auto-generated by _id)"
}
```

### 👤 User Collection (`users`)
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String (unique)",
  "password": "String (plaintext - hash in production)",
  "created_at": "Date",
  "last_login": "Date"
}
```

---

## 🔥 Fire Detection Logic

The backend implements intelligent fire detection by analyzing multiple sensor inputs:

### 🚨 Alert Conditions
1. **Temperature Threshold**: > 35°C
2. **Smoke Threshold**: > 300 ppm  
3. **Flame Detection**: Boolean true
4. **Combined Fire Alert**: Temperature + Smoke + Flame

### 📊 Data Flow
1. **IoT Sensors** send data to `/sensor` endpoint
2. **Flask API** receives and validates data
3. **MongoDB** stores the sensor readings
4. **Mobile App** requests data via `/data` endpoint
5. **Real-time Updates** provided through latest data endpoints

---

## 🚀 Deployment

### 🌐 Production Deployment (Render)

The backend is deployed on **Render** cloud platform:

- **Live URL**: `https://firewatch-backend-2cri.onrender.com`
- **Auto-deployment** from GitHub repository
- **Environment variables** configured in Render dashboard
- **24/7 uptime** monitoring

### 🔧 Environment Variables
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/firewatch
FLASK_ENV=production
FLASK_DEBUG=False
PORT=8080
```

### 📊 Health Monitoring
- **Endpoint Health**: All endpoints return proper HTTP status codes
- **Database Connection**: MongoDB Atlas connectivity monitored
- **Error Handling**: Comprehensive try-catch blocks
- **Logging**: Detailed console logging with emojis for clarity

---

## 🧪 Testing

### 🔍 Manual Testing

Test the API endpoints using curl or Postman:

#### **Test Sensor Data Endpoint**
```bash
curl -X POST http://localhost:8080/sensor \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 28.5,
    "smoke": 150,
    "flame_detected": false,
    "humidity": 55.0,
    "fire_alert": false
  }'
```

#### **Test Data Retrieval**
```bash
curl http://localhost:8080/data
```

#### **Test User Registration**
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testpassword123"
  }'
```

### 🧪 Testing with Python
```python
import requests

# Test sensor data
sensor_data = {
    "temperature": 25.5,
    "smoke": 120,
    "flame_detected": False,
    "humidity": 60.2,
    "fire_alert": False
}

response = requests.post('http://localhost:8080/sensor', json=sensor_data)
print(response.json())
```

---

## 📝 Error Handling

The API implements comprehensive error handling:

### ⚠️ Common Error Responses

#### **400 Bad Request**
```json
{
  "status": "error",
  "message": "Missing required field: temperature"
}
```

#### **401 Unauthorized**
```json
{
  "status": "error",
  "message": "Invalid username or password"
}
```

#### **404 Not Found**
```json
{
  "status": "not_found",
  "message": "No data found in database"
}
```

#### **500 Internal Server Error**
```json
{
  "status": "error",
  "message": "MongoDB connection failed"
}
```

---

## 🔒 Security Considerations

### 🛡️ Current Security Features
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Basic validation on required fields
- **Error Handling**: Graceful error responses without exposing internals

### 🚨 Security Improvements Needed
> **Note**: This is a development/demo version. For production use:

- **Password Hashing**: Use bcrypt or similar for password storage
- **JWT Authentication**: Implement JSON Web Tokens for session management
- **Rate Limiting**: Add request rate limiting to prevent abuse
- **Input Sanitization**: Validate and sanitize all user inputs
- **HTTPS**: Enforce HTTPS in production
- **Environment Variables**: Use proper secret management

---

## 📊 Performance & Monitoring

### 📈 Performance Features
- **In-memory Caching**: Latest sensor data cached for fast retrieval
- **Connection Pooling**: MongoDB connection reuse
- **Async Operations**: Non-blocking external API calls
- **Error Recovery**: Graceful handling of external service failures

### 🔍 Monitoring & Logging
- **Console Logging**: Detailed request/response logging
- **Emoji Indicators**: Visual status indicators in logs
- **Request Tracking**: Each endpoint logs entry and results
- **Error Tracking**: Comprehensive error logging

---

## 🔄 Integration Points

### 📡 IoT Device Integration
```python
# Example IoT device code to send data
import requests
import json

def send_sensor_data(temp, smoke, flame, humidity):
    data = {
        "temperature": temp,
        "smoke": smoke,
        "flame_detected": flame,
        "humidity": humidity,
        "fire_alert": temp > 35 or smoke > 300 or flame
    }
    
    response = requests.post(
        'https://firewatch-backend-2cri.onrender.com/sensor',
        json=data
    )
    return response.json()
```

### 📱 Mobile App Integration
```javascript
// React Native fetch example
const fetchSensorData = async () => {
  try {
    const response = await fetch('https://firewatch-backend-2cri.onrender.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sensor data:', error);
  }
};
```

---

## 🛠️ Development

### 🔧 Local Development Setup
1. **Clone repository**
2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```
4. **Set environment variables**
5. **Run development server**
   ```bash
   python main.py
   ```

### 🧪 Adding New Endpoints
1. **Define route function**
2. **Add proper error handling**
3. **Update this README**
4. **Test thoroughly**

### 📊 Code Structure
```
backend/
├── main.py              # Main Flask application
├── requirements.txt     # Python dependencies
├── README.md           # This documentation
└── .env               # Environment variables (not in repo)
```

---

## 🤝 Contributing

1. **🍴 Fork the repository**
2. **🌿 Create feature branch**
3. **💾 Make changes**
4. **🧪 Test thoroughly**
5. **📝 Update documentation**
6. **📤 Submit pull request**

---

## 📞 Support

### 🆘 Having Issues?
- **📧 Email**: backend-support@firewatch.com
- **🐛 Bug Reports**: Create an issue in the main repository
- **📖 Documentation**: Check the main project README
- **💬 Discord**: Join our developer community

---

## 📄 License

This project is licensed under the **MIT License**. See the main project LICENSE file for details.

---

<div align="center">

**🔥 Powering FireWatch IoT Fire Detection System 🔥**

*Built with Flask, MongoDB, and Python*

**© 2025 FireWatch Team. All rights reserved.**

</div>
