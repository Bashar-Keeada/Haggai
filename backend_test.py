#!/usr/bin/env python3
"""
Backend API Testing for Haggai Sweden Website
Tests all backend endpoints with realistic data
"""

import requests
import json
import sys
from datetime import datetime

# Get backend URL from frontend .env
BACKEND_URL = "https://haggai-sweden.preview.emergentagent.com/api"

def print_test_result(test_name, success, details=""):
    """Print formatted test results"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} {test_name}")
    if details:
        print(f"   {details}")
    print()

def test_leaders_api():
    """Test Leaders CRUD API endpoints"""
    print("=" * 60)
    print("TESTING LEADERS CRUD API")
    print("=" * 60)
    
    # Test 1: GET /api/leaders (should return empty array initially)
    try:
        response = requests.get(f"{BACKEND_URL}/leaders")
        success = response.status_code == 200
        leaders = response.json() if success else []
        print_test_result(
            "GET /api/leaders (initial)", 
            success, 
            f"Status: {response.status_code}, Count: {len(leaders)}"
        )
    except Exception as e:
        print_test_result("GET /api/leaders (initial)", False, f"Error: {str(e)}")
        return False
    
    # Test 2: POST /api/leaders - Create a leader
    leader_data = {
        "name": "Anna Lindström",
        "role": {
            "sv": "Ledarskapsutvecklare", 
            "en": "Leadership Developer", 
            "ar": "مطور القيادة"
        },
        "bio": {
            "sv": "Anna har över 15 års erfarenhet av ledarskap inom kyrkan och organisationer.", 
            "en": "Anna has over 15 years of leadership experience in church and organizations.", 
            "ar": "آنا لديها أكثر من 15 عامًا من الخبرة في القيادة في الكنيسة والمنظمات."
        },
        "topics": {
            "sv": ["Ledarskap", "Teambyggande", "Konfliktlösning"], 
            "en": ["Leadership", "Team Building", "Conflict Resolution"], 
            "ar": ["القيادة", "بناء الفريق", "حل النزاعات"]
        },
        "email": "anna.lindstrom@haggai.se",
        "phone": "+46 70 123 4567"
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/leaders", json=leader_data)
        success = response.status_code == 200
        created_leader = response.json() if success else {}
        leader_id = created_leader.get('id') if success else None
        print_test_result(
            "POST /api/leaders (create)", 
            success, 
            f"Status: {response.status_code}, ID: {leader_id}"
        )
    except Exception as e:
        print_test_result("POST /api/leaders (create)", False, f"Error: {str(e)}")
        return False
    
    if not success or not leader_id:
        print("Cannot continue tests without successful leader creation")
        return False
    
    # Test 3: GET /api/leaders (should return the created leader)
    try:
        response = requests.get(f"{BACKEND_URL}/leaders")
        success = response.status_code == 200
        leaders = response.json() if success else []
        found_leader = any(leader.get('id') == leader_id for leader in leaders)
        print_test_result(
            "GET /api/leaders (after create)", 
            success and found_leader, 
            f"Status: {response.status_code}, Count: {len(leaders)}, Found created leader: {found_leader}"
        )
    except Exception as e:
        print_test_result("GET /api/leaders (after create)", False, f"Error: {str(e)}")
    
    # Test 4: GET /api/leaders/{id} - Get specific leader
    try:
        response = requests.get(f"{BACKEND_URL}/leaders/{leader_id}")
        success = response.status_code == 200
        leader = response.json() if success else {}
        name_matches = leader.get('name') == leader_data['name']
        print_test_result(
            "GET /api/leaders/{id}", 
            success and name_matches, 
            f"Status: {response.status_code}, Name matches: {name_matches}"
        )
    except Exception as e:
        print_test_result("GET /api/leaders/{id}", False, f"Error: {str(e)}")
    
    # Test 5: PUT /api/leaders/{id} - Update leader
    update_data = {
        "name": "Anna Lindström-Johansson",
        "phone": "+46 70 987 6543"
    }
    
    try:
        response = requests.put(f"{BACKEND_URL}/leaders/{leader_id}", json=update_data)
        success = response.status_code == 200
        updated_leader = response.json() if success else {}
        name_updated = updated_leader.get('name') == update_data['name']
        print_test_result(
            "PUT /api/leaders/{id} (update)", 
            success and name_updated, 
            f"Status: {response.status_code}, Name updated: {name_updated}"
        )
    except Exception as e:
        print_test_result("PUT /api/leaders/{id} (update)", False, f"Error: {str(e)}")
    
    # Test 6: DELETE /api/leaders/{id} - Delete leader
    try:
        response = requests.delete(f"{BACKEND_URL}/leaders/{leader_id}")
        success = response.status_code == 200
        print_test_result(
            "DELETE /api/leaders/{id}", 
            success, 
            f"Status: {response.status_code}"
        )
    except Exception as e:
        print_test_result("DELETE /api/leaders/{id}", False, f"Error: {str(e)}")
    
    # Test 7: Verify deletion - GET /api/leaders/{id} should return 404
    try:
        response = requests.get(f"{BACKEND_URL}/leaders/{leader_id}")
        success = response.status_code == 404
        print_test_result(
            "GET /api/leaders/{id} (after delete)", 
            success, 
            f"Status: {response.status_code} (should be 404)"
        )
    except Exception as e:
        print_test_result("GET /api/leaders/{id} (after delete)", False, f"Error: {str(e)}")
    
    return True

def test_contact_api():
    """Test Contact Form API"""
    print("=" * 60)
    print("TESTING CONTACT FORM API")
    print("=" * 60)
    
    contact_data = {
        "name": "Erik Svensson",
        "email": "erik.svensson@example.com",
        "subject": "Fråga om ledarskapsutbildning",
        "message": "Hej! Jag är intresserad av att veta mer om era ledarskapsutbildningar. Kan ni kontakta mig?"
    }
    
    # Test POST /api/contact
    try:
        response = requests.post(f"{BACKEND_URL}/contact", json=contact_data)
        success = response.status_code == 200
        submission = response.json() if success else {}
        submission_id = submission.get('id')
        print_test_result(
            "POST /api/contact", 
            success, 
            f"Status: {response.status_code}, ID: {submission_id}"
        )
    except Exception as e:
        print_test_result("POST /api/contact", False, f"Error: {str(e)}")
    
    # Test GET /api/contact (admin endpoint)
    try:
        response = requests.get(f"{BACKEND_URL}/contact")
        success = response.status_code == 200
        submissions = response.json() if success else []
        print_test_result(
            "GET /api/contact (admin)", 
            success, 
            f"Status: {response.status_code}, Count: {len(submissions)}"
        )
    except Exception as e:
        print_test_result("GET /api/contact (admin)", False, f"Error: {str(e)}")

def test_membership_api():
    """Test Membership Application API"""
    print("=" * 60)
    print("TESTING MEMBERSHIP APPLICATION API")
    print("=" * 60)
    
    membership_data = {
        "member_type": "individual",
        "first_name": "Maria",
        "last_name": "Andersson",
        "email": "maria.andersson@example.com",
        "phone": "+46 70 555 1234",
        "city": "Stockholm",
        "message": "Jag vill gärna bli medlem för att utveckla mitt ledarskap."
    }
    
    # Test POST /api/membership
    try:
        response = requests.post(f"{BACKEND_URL}/membership", json=membership_data)
        success = response.status_code == 200
        application = response.json() if success else {}
        application_id = application.get('id')
        print_test_result(
            "POST /api/membership", 
            success, 
            f"Status: {response.status_code}, ID: {application_id}"
        )
    except Exception as e:
        print_test_result("POST /api/membership", False, f"Error: {str(e)}")
    
    # Test GET /api/membership (admin endpoint)
    try:
        response = requests.get(f"{BACKEND_URL}/membership")
        success = response.status_code == 200
        applications = response.json() if success else []
        print_test_result(
            "GET /api/membership (admin)", 
            success, 
            f"Status: {response.status_code}, Count: {len(applications)}"
        )
    except Exception as e:
        print_test_result("GET /api/membership (admin)", False, f"Error: {str(e)}")

def test_leader_experience_api():
    """Test Leader Experience Application API"""
    print("=" * 60)
    print("TESTING LEADER EXPERIENCE APPLICATION API")
    print("=" * 60)
    
    application_data = {
        "program_id": "leadership-intensive-2024",
        "nomination_type": "self",
        "first_name": "Lars",
        "last_name": "Nilsson",
        "email": "lars.nilsson@example.com",
        "phone": "+46 70 777 8888",
        "city": "Göteborg",
        "country": "Sverige",
        "church_or_organization": "Pingstkyrkan Göteborg",
        "current_role": "Ungdomsledare",
        "years_in_role": 5,
        "ministry_description": "Jag leder ungdomsverksamheten med 50+ ungdomar varje vecka.",
        "why_apply": "Jag vill utveckla mina ledarskapsförmågor för att bättre tjäna ungdomarna.",
        "expectations": "Jag förväntar mig att lära mig praktiska verktyg för ledarskap och teambyggande."
    }
    
    # Test POST /api/leader-experience-applications
    try:
        response = requests.post(f"{BACKEND_URL}/leader-experience-applications", json=application_data)
        success = response.status_code == 200
        application = response.json() if success else {}
        application_id = application.get('id')
        print_test_result(
            "POST /api/leader-experience-applications", 
            success, 
            f"Status: {response.status_code}, ID: {application_id}"
        )
    except Exception as e:
        print_test_result("POST /api/leader-experience-applications", False, f"Error: {str(e)}")
    
    # Test GET /api/leader-experience-applications (admin endpoint)
    try:
        response = requests.get(f"{BACKEND_URL}/leader-experience-applications")
        success = response.status_code == 200
        applications = response.json() if success else []
        print_test_result(
            "GET /api/leader-experience-applications (admin)", 
            success, 
            f"Status: {response.status_code}, Count: {len(applications)}"
        )
    except Exception as e:
        print_test_result("GET /api/leader-experience-applications (admin)", False, f"Error: {str(e)}")
    
    # Test GET /api/leader-experience-applications/{program_id}
    try:
        response = requests.get(f"{BACKEND_URL}/leader-experience-applications/{application_data['program_id']}")
        success = response.status_code == 200
        applications = response.json() if success else []
        print_test_result(
            "GET /api/leader-experience-applications/{program_id}", 
            success, 
            f"Status: {response.status_code}, Count: {len(applications)}"
        )
    except Exception as e:
        print_test_result("GET /api/leader-experience-applications/{program_id}", False, f"Error: {str(e)}")

def main():
    """Run all backend API tests"""
    print("🚀 Starting Backend API Tests for Haggai Sweden Website")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Test all APIs
    test_leaders_api()
    test_contact_api()
    test_membership_api()
    test_leader_experience_api()
    
    print("=" * 60)
    print("🏁 Backend API Testing Complete")
    print("=" * 60)

if __name__ == "__main__":
    main()