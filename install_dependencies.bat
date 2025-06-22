@echo off
echo 🔧 Installing Python dependencies...
pip install -r requirements.txt

echo.
echo ✅ Dependencies installed successfully!
echo.
echo 🚀 To start the backend server, run:
echo python backend/main.py
echo.
echo 📱 The server will be available at: http://localhost:8080
echo.
echo 🔗 API Endpoints:
echo   POST /auth/register - User registration/login
echo   GET /auth/users - Get all users
echo   GET /data - Get latest sensor data
echo   POST /data - Receive sensor data
echo   POST /sensor - Receive sensor data (alternative)
echo   GET /latest - Get latest data from MongoDB
pause
