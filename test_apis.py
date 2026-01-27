import requests
import json

# Test Spring Boot Service APIs
print("=== Testing Spring Boot Service (Port 8080) ===")

# Test health endpoint
try:
    response = requests.get("http://localhost:8080/oep/actuator/health")
    print(f"Health Check: {response.status_code} - {response.text}")
except Exception as e:
    print(f"Health Check Error: {e}")

# Test login endpoint
try:
    login_data = {
        "email": "admin@oep.com",
        "password": "password123"
    }
    response = requests.post("http://localhost:8080/oep/auth/signin", json=login_data)
    print(f"Login Test: {response.status_code} - {response.text[:200]}...")
    
    if response.status_code == 200:
        token = response.json().get("jwtToken")
        headers = {"Authorization": f"Bearer {token}"}
        
        # Test get users
        response = requests.get("http://localhost:8080/oep/admin/users", headers=headers)
        print(f"Get Users: {response.status_code} - Found {len(response.json()) if response.status_code == 200 else 'Error'} users")
        
        # Test get courses
        response = requests.get("http://localhost:8080/oep/admin/courses", headers=headers)
        print(f"Get Courses: {response.status_code} - Found {len(response.json()) if response.status_code == 200 else 'Error'} courses")
        
except Exception as e:
    print(f"Spring Boot API Error: {e}")

print("\n=== Testing .NET Admin Service (Port 7097) ===")

# Test health endpoint
try:
    response = requests.get("http://localhost:7097/health")
    print(f"Health Check: {response.status_code} - {response.text}")
except Exception as e:
    print(f"Health Check Error: {e}")

# Test get batches (should work without auth for testing)
try:
    response = requests.get("http://localhost:7097/admin/batches")
    print(f"Get Batches: {response.status_code} - {response.text[:200]}...")
except Exception as e:
    print(f"Batches API Error: {e}")

# Test get announcements
try:
    response = requests.get("http://localhost:7097/admin/announcements")
    print(f"Get Announcements: {response.status_code} - {response.text[:200]}...")
except Exception as e:
    print(f"Announcements API Error: {e}")

print("\n=== Swagger UI Links ===")
print("Spring Boot Swagger: http://localhost:8080/oep/swagger-ui/index.html")
print(".NET Admin Swagger: http://localhost:7097/swagger/index.html")