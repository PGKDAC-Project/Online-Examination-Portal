import requests

url = "http://localhost:8080/oep/auth/signin"
data = {
    "email": "admin@oep.com",
    "password": "admin@123"
}
headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, json=data, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
