import requests
import json

# Test the backend API endpoints
BASE_URL = "http://localhost:8080"

def test_user_registration():
    """Test user registration endpoint"""
    print("🧪 Testing user registration...")
    
    user_data = {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=user_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 201 or response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_sensor_data():
    """Test sensor data endpoint"""
    print("\n🧪 Testing sensor data...")
    
    try:
        response = requests.get(f"{BASE_URL}/data")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_post_sensor_data():
    """Test posting sensor data"""
    print("\n🧪 Testing posting sensor data...")
    
    sensor_data = {
        "temperature": 26.5,
        "smoke": 12.0,
        "flame_detected": False,
        "fire_alert": False,
        "humidity": 48.0
    }
    
    try:
        response = requests.post(f"{BASE_URL}/data", json=sensor_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_get_all_users():
    """Test getting all users"""
    print("\n🧪 Testing get all users...")
    
    try:
        response = requests.get(f"{BASE_URL}/auth/users")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Testing FireWatch Backend API")
    print("=" * 50)
    
    # Run tests
    tests = [
        ("User Registration", test_user_registration),
        ("Sensor Data GET", test_sensor_data),
        ("Sensor Data POST", test_post_sensor_data),
        ("Get All Users", test_get_all_users),
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n📋 Running: {test_name}")
        success = test_func()
        results.append((test_name, success))
        print(f"Result: {'✅ PASS' if success else '❌ FAIL'}")
    
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"  {test_name}: {status}")
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    print(f"\nTotal: {passed}/{total} tests passed")
