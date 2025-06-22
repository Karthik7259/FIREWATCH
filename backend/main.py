from flask import Flask, request, jsonify
from pymongo import MongoClient
import requests


from flask_cors import CORS

from bson import ObjectId
import json

app = Flask(__name__)
latest_data = {}

CORS(app)



# MongoDB connection URI
mongo_uri = "mongodb+srv://thenameismonisha:lEu15R9y1WM9NN6Q@cluster0.ippxuwz.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(mongo_uri)
db = client['firewatch']         # Database name
collection = db['data']          # Collection name
user_collection = db['users']    # User collection

# Custom JSON encoder to handle ObjectId
class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

app.json_encoder = JSONEncoder

@app.route('/sensor', methods=['POST'])
def receive_sensor_data():
    print("🚨 Entered /sensor POST route")
    global latest_data
    latest_data = request.json
    print("📥 Received sensor data:", latest_data)
    
    try:
        response = requests.post(
            'https://firewatch-backend-2cri.onrender.com/data',
            json=latest_data,
            timeout=5  # optional timeout in seconds
        )
        response.raise_for_status()  # raise error for bad responses (4xx or 5xx)
    except requests.RequestException as e:
        # Handle any errors in posting the data
        print(f"Failed to send data to firewatch backend: {e}")
     
    try:
        print("📦 Attempting to insert into MongoDB...")
        result = collection.insert_one(latest_data)
        inserted_id = str(result.inserted_id)
        print(f"✅ Inserted into MongoDB with _id: {inserted_id}")
        print("--------------------------------------------------")
        return jsonify({
            "status": "inserted",
            "inserted_id": inserted_id
        }), 200
    except Exception as e:
        print("❌ MongoDB Insertion Error:", str(e))
        print("--------------------------------------------------")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/sensor', methods=['GET'])
def get_latest_sensor_data():
    return jsonify(latest_data), 200

@app.route('/latest', methods=['GET'])
def get_latest_from_mongodb():
    """
    Fetch the latest document from MongoDB based on insertion time
    """
    print("🔍 Fetching latest data from MongoDB...")
    try:
        # Find the latest document by sorting by _id in descending order
        # _id contains timestamp information, so this gets the most recent
        latest_document = collection.find().sort("_id", -1).limit(1)
        
        # Convert cursor to list
        latest_data_list = list(latest_document)
        
        if latest_data_list:
            latest_doc = latest_data_list[0]
            # Convert ObjectId to string for JSON serialization
            latest_doc['_id'] = str(latest_doc['_id'])
            print(f"✅ Found latest document with _id: {latest_doc['_id']}")
            return jsonify({
                "status": "success",
                "data": latest_doc
            }), 200
        else:
            print("⚠️ No documents found in collection")
            return jsonify({
                "status": "not_found",
                "message": "No data found in database"
            }), 404
            
    except Exception as e:
        print(f"❌ Error fetching latest data: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/latest-by-timestamp', methods=['GET'])
def get_latest_by_timestamp():
    """
    Alternative method: Fetch latest data by timestamp field (if your data has a timestamp field)
    """
    print("🔍 Fetching latest data by timestamp from MongoDB...")
    try:
        # Assuming your sensor data has a 'timestamp' field
        # Adjust the field name according to your data structure
        latest_document = collection.find().sort("timestamp", -1).limit(1)
        
        latest_data_list = list(latest_document)
        
        if latest_data_list:
            latest_doc = latest_data_list[0]
            latest_doc['_id'] = str(latest_doc['_id'])
            print(f"✅ Found latest document by timestamp with _id: {latest_doc['_id']}")
            return jsonify({
                "status": "success",
                "data": latest_doc
            }), 200
        else:
            print("⚠️ No documents found in collection")
            return jsonify({
                "status": "not_found",
                "message": "No data found in database"
            }), 404
            
    except Exception as e:
        print(f"❌ Error fetching latest data by timestamp: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/recent/<int:limit>', methods=['GET'])
def get_recent_data(limit):
    """
    Fetch the most recent N documents from MongoDB
    Usage: /recent/5 to get last 5 documents
    """
    print(f"🔍 Fetching {limit} recent documents from MongoDB...")
    try:
        # Limit the number of documents to prevent excessive data transfer
        if limit > 100:
            limit = 100
            
        recent_documents = collection.find().sort("_id", -1).limit(limit)
        recent_data_list = list(recent_documents)
        
        # Convert ObjectId to string for all documents
        for doc in recent_data_list:
            doc['_id'] = str(doc['_id'])
        
        print(f"✅ Found {len(recent_data_list)} recent documents")
        return jsonify({
            "status": "success",
            "count": len(recent_data_list),
            "data": recent_data_list
        }), 200
            
    except Exception as e:
        print(f"❌ Error fetching recent data: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/auth/register', methods=['POST'])
def register_user():
    """
    Register a new user or login an existing user
    """
    print("👤 User registration/login request received")
    try:
        user_data = request.json
        
        # Validate required fields
        required_fields = ['name', 'email', 'password']
        for field in required_fields:
            if not user_data.get(field):
                return jsonify({
                    "status": "error",
                    "message": f"Missing required field: {field}"
                }), 400
        
        # Check if user already exists
        existing_user = user_collection.find_one({"email": user_data['email']})
        
        if existing_user:
            # User exists, perform login validation
            print(f"🔍 Existing user found: {user_data['email']}")
            # In a real app, you'd verify the password hash here
            # For demo purposes, we'll just return success
            return jsonify({
                "status": "success",
                "message": "Login successful",
                "user": {
                    "id": str(existing_user['_id']),
                    "name": existing_user['name'],
                    "email": existing_user['email']
                }
            }), 200
        else:
            # New user, create account
            print(f"✨ Creating new user: {user_data['email']}")
            
            # Prepare user document
            user_document = {
                "name": user_data['name'],
                "email": user_data['email'],
                "password": user_data['password'],  # In production, hash this password
                "created_at": {"$currentDate": True},
                "last_login": {"$currentDate": True}
            }
            
            # Insert user into database
            result = user_collection.insert_one(user_document)
            user_id = str(result.inserted_id)
            
            print(f"✅ User created successfully with ID: {user_id}")
            
            return jsonify({
                "status": "success",
                "message": "User registered successfully",
                "user": {
                    "id": user_id,
                    "name": user_data['name'],
                    "email": user_data['email']
                }
            }), 201
            
    except Exception as e:
        print(f"❌ User registration error: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/auth/users', methods=['GET'])
def get_all_users():
    """
    Get all registered users (for admin purposes)
    """
    print("👥 Fetching all users...")
    try:
        users = list(user_collection.find())
        
        # Convert ObjectId to string and remove password from response
        users_list = []
        for user in users:
            user_data = {
                "id": str(user['_id']),
                "name": user['name'],
                "email": user['email'],
                "created_at": user.get('created_at'),
                "last_login": user.get('last_login')
            }
            users_list.append(user_data)
        
        print(f"✅ Found {len(users_list)} users")
        return jsonify({
            "status": "success",
            "count": len(users_list),
            "users": users_list
        }), 200
        
    except Exception as e:
        print(f"❌ Error fetching users: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/login', methods=['POST'])
def login_user():
    """
    Login an existing user
    """
    print("🔑 Logging in user...")
    credentials = request.json
    
    # Basic validation
    if not credentials.get('username') or not credentials.get('password'):
        return jsonify({
            "status": "error",
            "message": "Username and password are required"
        }), 400
    
    try:
        # Check if the user exists and password matches
        user = user_collection.find_one({
            "username": credentials['username'],
            "password": credentials['password']  # In production, use hashed passwords!
        })
        
        if user:
            print(f"✅ User logged in: {user['username']}")
            return jsonify({
                "status": "success",
                "user_id": str(user['_id']),
                "username": user['username']
            }), 200
        else:
            print("❌ Invalid username or password")
            return jsonify({
                "status": "error",
                "message": "Invalid username or password"
            }), 401
    except Exception as e:
        print(f"❌ Error logging in user: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/data', methods=['GET'])
def get_sensor_data():
    """
    Get latest sensor data for the dashboard
    """
    print("📊 Dashboard requesting sensor data...")
    try:
        # Return the latest in-memory data first (fastest)
        if latest_data:
            print("✅ Returning latest in-memory data")
            return jsonify(latest_data), 200
        
        # If no in-memory data, try to get from MongoDB
        latest_document = collection.find().sort("_id", -1).limit(1)
        latest_data_list = list(latest_document)
        
        if latest_data_list:
            latest_doc = latest_data_list[0]
            # Remove MongoDB _id from response
            if '_id' in latest_doc:
                del latest_doc['_id']
            print("✅ Returning latest data from MongoDB")
            return jsonify(latest_doc), 200
        else:
            # Return default/mock data if no data available
            mock_data = {
                "temperature": 25.0,
                "smoke": 8.0,
                "flame_detected": False,
                "fire_alert": False,
                "humidity": 45.0
            }
            print("⚠️ No data found, returning mock data")
            return jsonify(mock_data), 200
            
    except Exception as e:
        print(f"❌ Error fetching sensor data: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/data', methods=['POST'])
def receive_data():
    """
    Receive data from IoT devices or other sources
    """
    print("📡 Received data via POST /data")
    global latest_data
    try:
        data = request.json
        latest_data = data
        print("📥 Data received:", data)
        
        # Store in MongoDB
        result = collection.insert_one(data)
        print(f"✅ Data stored in MongoDB with ID: {str(result.inserted_id)}")
        
        return jsonify({
            "status": "success",
            "message": "Data received and stored successfully"
        }), 200
        
    except Exception as e:
        print(f"❌ Error storing data: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)

