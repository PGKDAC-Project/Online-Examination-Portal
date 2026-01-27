import requests
import json
import time
import sys
from datetime import datetime

class OEPTester:
    def __init__(self):
        self.spring_base_url = "http://localhost:8080/oep"
        self.admin_base_url = "http://localhost:7097"
        self.frontend_url = "http://localhost:5173"
        self.auth_token = None
        self.admin_token = None
        self.instructor_token = None
        self.student_token = None
        self.test_results = []
        
    def log_test(self, test_name, status, details=""):
        result = {
            "test": test_name,
            "status": status,
            "timestamp": datetime.now().isoformat(),
            "details": details
        }
        self.test_results.append(result)
        status_symbol = "✅" if status == "PASS" else "❌"
        print(f"{status_symbol} {test_name}: {status} - {details}")
        
    def test_service_health(self):
        """Test if all services are running"""
        print("\n🔍 Testing Service Health...")
        
        # Test Spring Boot Backend
        try:
            response = requests.get(f"{self.spring_base_url}/actuator/health", timeout=5)
            if response.status_code == 200:
                self.log_test("Spring Boot Health", "PASS", "Service is running")
            else:
                self.log_test("Spring Boot Health", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Spring Boot Health", "FAIL", str(e))
            
        # Test Admin Service
        try:
            response = requests.get(f"{self.admin_base_url}/health", timeout=5)
            if response.status_code == 200:
                self.log_test("Admin Service Health", "PASS", "Service is running")
            else:
                self.log_test("Admin Service Health", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Admin Service Health", "FAIL", str(e))
            
        # Test Frontend
        try:
            response = requests.get(self.frontend_url, timeout=5)
            if response.status_code == 200:
                self.log_test("Frontend Health", "PASS", "Frontend is accessible")
            else:
                self.log_test("Frontend Health", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Frontend Health", "FAIL", str(e))
    
    def test_authentication(self):
        """Test authentication endpoints"""
        print("\n🔐 Testing Authentication...")
        
        # Test Admin Login
        admin_login_data = {
            "email": "admin@oep.com",
            "password": "admin123"
        }
        
        try:
            response = requests.post(f"{self.spring_base_url}/auth/signin", 
                                   json=admin_login_data, timeout=10)
            if response.status_code == 200:
                data = response.json()
                self.admin_token = data.get('token')
                self.log_test("Admin Authentication", "PASS", "Admin login successful")
            else:
                self.log_test("Admin Authentication", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Admin Authentication", "FAIL", str(e))
            
        # Test Instructor Login
        instructor_login_data = {
            "email": "instructor@oep.com", 
            "password": "instructor123"
        }
        
        try:
            response = requests.post(f"{self.spring_base_url}/auth/signin",
                                   json=instructor_login_data, timeout=10)
            if response.status_code == 200:
                data = response.json()
                self.instructor_token = data.get('token')
                self.log_test("Instructor Authentication", "PASS", "Instructor login successful")
            else:
                self.log_test("Instructor Authentication", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Instructor Authentication", "FAIL", str(e))
            
        # Test Student Login
        student_login_data = {
            "email": "student@oep.com",
            "password": "student123"
        }
        
        try:
            response = requests.post(f"{self.spring_base_url}/auth/signin",
                                   json=student_login_data, timeout=10)
            if response.status_code == 200:
                data = response.json()
                self.student_token = data.get('token')
                self.log_test("Student Authentication", "PASS", "Student login successful")
            else:
                self.log_test("Student Authentication", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Student Authentication", "FAIL", str(e))
    
    def test_admin_features(self):
        """Test all admin panel features"""
        print("\n👨‍💼 Testing Admin Features...")
        
        if not self.admin_token:
            self.log_test("Admin Features", "SKIP", "No admin token available")
            return
            
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        
        # Test User Management
        try:
            response = requests.get(f"{self.admin_base_url}/admin/users", headers=headers, timeout=10)
            if response.status_code == 200:
                self.log_test("Admin - User Management", "PASS", "User list retrieved")
            else:
                self.log_test("Admin - User Management", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Admin - User Management", "FAIL", str(e))
            
        # Test Batch Management
        try:
            response = requests.get(f"{self.admin_base_url}/admin/batches", headers=headers, timeout=10)
            if response.status_code == 200:
                self.log_test("Admin - Batch Management", "PASS", "Batch list retrieved")
            else:
                self.log_test("Admin - Batch Management", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Admin - Batch Management", "FAIL", str(e))
            
        # Test Course Governance
        try:
            response = requests.get(f"{self.spring_base_url}/admin/courses", headers=headers, timeout=10)
            if response.status_code == 200:
                self.log_test("Admin - Course Governance", "PASS", "Course list retrieved")
            else:
                self.log_test("Admin - Course Governance", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Admin - Course Governance", "FAIL", str(e))
            
        # Test System Settings
        try:
            response = requests.get(f"{self.admin_base_url}/admin/system-settings", headers=headers, timeout=10)
            if response.status_code == 200:
                self.log_test("Admin - System Settings", "PASS", "Settings retrieved")
            else:
                self.log_test("Admin - System Settings", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Admin - System Settings", "FAIL", str(e))
            
        # Test Activity Logs
        try:
            response = requests.get(f"{self.admin_base_url}/admin/logs", headers=headers, timeout=10)
            if response.status_code == 200:
                self.log_test("Admin - Activity Logs", "PASS", "Logs retrieved")
            else:
                self.log_test("Admin - Activity Logs", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Admin - Activity Logs", "FAIL", str(e))
    
    def test_instructor_features(self):
        """Test all instructor panel features"""
        print("\n👨‍🏫 Testing Instructor Features...")
        
        if not self.instructor_token:
            self.log_test("Instructor Features", "SKIP", "No instructor token available")
            return
            
        headers = {"Authorization": f"Bearer {self.instructor_token}"}
        
        # Test Course Management
        try:
            response = requests.get(f"{self.spring_base_url}/instructor/courses", headers=headers, timeout=10)
            if response.status_code == 200:
                self.log_test("Instructor - Course Management", "PASS", "Courses retrieved")
            else:
                self.log_test("Instructor - Course Management", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Instructor - Course Management", "FAIL", str(e))
            
        # Test Question Bank Management
        try:
            response = requests.get(f"{self.spring_base_url}/instructor/questions", headers=headers, timeout=10)
            if response.status_code == 200:
                self.log_test("Instructor - Question Bank", "PASS", "Questions retrieved")
            else:
                self.log_test("Instructor - Question Bank", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Instructor - Question Bank", "FAIL", str(e))
            
        # Test Exam Management
        try:
            response = requests.get(f"{self.spring_base_url}/instructor/exams", headers=headers, timeout=10)
            if response.status_code == 200:
                self.log_test("Instructor - Exam Management", "PASS", "Exams retrieved")
            else:
                self.log_test("Instructor - Exam Management", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Instructor - Exam Management", "FAIL", str(e))
            
        # Test Result Evaluation
        try:
            response = requests.get(f"{self.spring_base_url}/instructor/results", headers=headers, timeout=10)
            if response.status_code == 200:
                self.log_test("Instructor - Result Evaluation", "PASS", "Results retrieved")
            else:
                self.log_test("Instructor - Result Evaluation", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Instructor - Result Evaluation", "FAIL", str(e))
    
    def test_student_features(self):
        """Test all student panel features"""
        print("\n👨‍🎓 Testing Student Features...")
        
        if not self.student_token:
            self.log_test("Student Features", "SKIP", "No student token available")
            return
            
        headers = {"Authorization": f"Bearer {self.student_token}"}
        
        # Test Available Courses
        try:
            response = requests.get(f"{self.spring_base_url}/student/courses/available", headers=headers, timeout=10)
            if response.status_code == 200:
                self.log_test("Student - Available Courses", "PASS", "Courses retrieved")
            else:
                self.log_test("Student - Available Courses", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Student - Available Courses", "FAIL", str(e))
            
        # Test Applied Courses
        try:
            response = requests.get(f"{self.spring_base_url}/student/courses/applied", headers=headers, timeout=10)
            if response.status_code == 200:
                self.log_test("Student - Applied Courses", "PASS", "Applied courses retrieved")
            else:
                self.log_test("Student - Applied Courses", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Student - Applied Courses", "FAIL", str(e))
            
        # Test Available Exams
        try:
            response = requests.get(f"{self.spring_base_url}/student/exams/available", headers=headers, timeout=10)
            if response.status_code == 200:
                self.log_test("Student - Available Exams", "PASS", "Exams retrieved")
            else:
                self.log_test("Student - Available Exams", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Student - Available Exams", "FAIL", str(e))
            
        # Test Exam History
        try:
            response = requests.get(f"{self.spring_base_url}/student/exams/history", headers=headers, timeout=10)
            if response.status_code == 200:
                self.log_test("Student - Exam History", "PASS", "History retrieved")
            else:
                self.log_test("Student - Exam History", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Student - Exam History", "FAIL", str(e))
            
        # Test Results
        try:
            response = requests.get(f"{self.spring_base_url}/student/results", headers=headers, timeout=10)
            if response.status_code == 200:
                self.log_test("Student - Results", "PASS", "Results retrieved")
            else:
                self.log_test("Student - Results", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Student - Results", "FAIL", str(e))
    
    def test_database_operations(self):
        """Test database CRUD operations"""
        print("\n🗄️ Testing Database Operations...")
        
        if not self.admin_token:
            self.log_test("Database Operations", "SKIP", "No admin token available")
            return
            
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        
        # Test User Creation
        test_user = {
            "userName": "Test User",
            "userCode": "TEST001",
            "email": "testuser@oep.com",
            "phoneNumber": "9876543210",
            "role": "ROLE_STUDENT",
            "batchId": 1
        }
        
        try:
            response = requests.post(f"{self.admin_base_url}/admin/users", 
                                   json=test_user, headers=headers, timeout=10)
            if response.status_code in [200, 201]:
                self.log_test("Database - User Creation", "PASS", "User created successfully")
            else:
                self.log_test("Database - User Creation", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Database - User Creation", "FAIL", str(e))
            
        # Test Batch Creation
        test_batch = {
            "batchName": "Test Batch 2024",
            "description": "Test batch for API validation",
            "startDate": "2024-01-01",
            "endDate": "2024-12-31"
        }
        
        try:
            response = requests.post(f"{self.admin_base_url}/admin/batches",
                                   json=test_batch, headers=headers, timeout=10)
            if response.status_code in [200, 201]:
                self.log_test("Database - Batch Creation", "PASS", "Batch created successfully")
            else:
                self.log_test("Database - Batch Creation", "FAIL", f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Database - Batch Creation", "FAIL", str(e))
    
    def generate_report(self):
        """Generate comprehensive test report"""
        print("\n📊 Test Summary Report")
        print("=" * 50)
        
        total_tests = len(self.test_results)
        passed_tests = len([t for t in self.test_results if t['status'] == 'PASS'])
        failed_tests = len([t for t in self.test_results if t['status'] == 'FAIL'])
        skipped_tests = len([t for t in self.test_results if t['status'] == 'SKIP'])
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"⏭️ Skipped: {skipped_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        # Save detailed report
        report_data = {
            "timestamp": datetime.now().isoformat(),
            "summary": {
                "total": total_tests,
                "passed": passed_tests,
                "failed": failed_tests,
                "skipped": skipped_tests,
                "success_rate": (passed_tests/total_tests)*100
            },
            "detailed_results": self.test_results
        }
        
        with open("test_report.json", "w") as f:
            json.dump(report_data, f, indent=2)
            
        print(f"\n📄 Detailed report saved to: test_report.json")
        
        if failed_tests > 0:
            print("\n❌ Failed Tests:")
            for test in self.test_results:
                if test['status'] == 'FAIL':
                    print(f"  - {test['test']}: {test['details']}")
    
    def run_all_tests(self):
        """Run complete test suite"""
        print("🚀 Starting Online Examination Portal API Testing...")
        print("=" * 60)
        
        self.test_service_health()
        time.sleep(2)
        
        self.test_authentication()
        time.sleep(2)
        
        self.test_admin_features()
        time.sleep(2)
        
        self.test_instructor_features()
        time.sleep(2)
        
        self.test_student_features()
        time.sleep(2)
        
        self.test_database_operations()
        
        self.generate_report()

if __name__ == "__main__":
    tester = OEPTester()
    tester.run_all_tests()