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
BACKEND_URL = "https://members-portal-10.preview.emergentagent.com/api"

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

def test_board_members_api():
    """Test Board Members CRUD API endpoints"""
    print("=" * 60)
    print("TESTING BOARD MEMBERS CRUD API")
    print("=" * 60)
    
    # Test 1: GET /api/board-members?current_only=true (should return current members)
    try:
        response = requests.get(f"{BACKEND_URL}/board-members?current_only=true")
        success = response.status_code == 200
        current_members = response.json() if success else []
        print_test_result(
            "GET /api/board-members?current_only=true", 
            success, 
            f"Status: {response.status_code}, Current members count: {len(current_members)}"
        )
        
        # Check if we have the expected 5 current members (Bashar, Ravi, Mazin, Peter, Alen)
        expected_names = ["Bashar", "Ravi", "Mazin", "Peter", "Alen"]
        found_names = [member.get('name', '') for member in current_members]
        expected_found = all(any(expected in found for found in found_names) for expected in expected_names)
        
        if len(current_members) == 5 and expected_found:
            print("   ✅ Found all 5 expected current board members")
        else:
            print(f"   ⚠️  Expected 5 members with names containing {expected_names}, found {len(current_members)}: {found_names}")
            
    except Exception as e:
        print_test_result("GET /api/board-members?current_only=true", False, f"Error: {str(e)}")
        return False
    
    # Test 2: GET /api/board-members?current_only=false (should return all members)
    try:
        response = requests.get(f"{BACKEND_URL}/board-members?current_only=false")
        success = response.status_code == 200
        all_members = response.json() if success else []
        print_test_result(
            "GET /api/board-members?current_only=false", 
            success, 
            f"Status: {response.status_code}, Total members count: {len(all_members)}"
        )
    except Exception as e:
        print_test_result("GET /api/board-members?current_only=false", False, f"Error: {str(e)}")
    
    # Test 3: GET /api/board-members/archive (should return archived members)
    try:
        response = requests.get(f"{BACKEND_URL}/board-members/archive")
        success = response.status_code == 200
        archived_members = response.json() if success else []
        print_test_result(
            "GET /api/board-members/archive", 
            success, 
            f"Status: {response.status_code}, Archived members count: {len(archived_members)}"
        )
    except Exception as e:
        print_test_result("GET /api/board-members/archive", False, f"Error: {str(e)}")
    
    # Test 4: POST /api/board-members - Create a new member
    new_member_data = {
        "name": "Sofia Eriksson",
        "role": "Sekreterare",
        "email": "sofia.eriksson@haggai.se",
        "phone": "+46 70 123 9876",
        "bio": "Sofia har arbetat med administration och kommunikation i över 10 år.",
        "term_start": "2025",
        "is_current": True
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/board-members", json=new_member_data)
        success = response.status_code == 200
        created_member = response.json() if success else {}
        member_id = created_member.get('id') if success else None
        print_test_result(
            "POST /api/board-members", 
            success, 
            f"Status: {response.status_code}, ID: {member_id}, Name: {created_member.get('name', 'N/A')}"
        )
    except Exception as e:
        print_test_result("POST /api/board-members", False, f"Error: {str(e)}")
        return False
    
    if not success or not member_id:
        print("Cannot continue tests without successful member creation")
        return False
    
    # Test 5: GET /api/board-members/{id} - Get specific member
    try:
        response = requests.get(f"{BACKEND_URL}/board-members/{member_id}")
        success = response.status_code == 200
        member = response.json() if success else {}
        name_matches = member.get('name') == new_member_data['name']
        print_test_result(
            "GET /api/board-members/{id}", 
            success and name_matches, 
            f"Status: {response.status_code}, Name matches: {name_matches}"
        )
    except Exception as e:
        print_test_result("GET /api/board-members/{id}", False, f"Error: {str(e)}")
    
    # Test 6: PUT /api/board-members/{id} - Update a member
    update_data = {
        "name": "Sofia Eriksson-Lindberg",
        "phone": "+46 70 987 1234",
        "bio": "Sofia har arbetat med administration och kommunikation i över 12 år och har nu även ansvar för styrelsearbete."
    }
    
    try:
        response = requests.put(f"{BACKEND_URL}/board-members/{member_id}", json=update_data)
        success = response.status_code == 200
        updated_member = response.json() if success else {}
        name_updated = updated_member.get('name') == update_data['name']
        print_test_result(
            "PUT /api/board-members/{id}", 
            success and name_updated, 
            f"Status: {response.status_code}, Name updated: {name_updated}"
        )
    except Exception as e:
        print_test_result("PUT /api/board-members/{id}", False, f"Error: {str(e)}")
    
    # Test 7: PUT /api/board-members/{id}/archive?term_end=2024 - Archive a member
    try:
        response = requests.put(f"{BACKEND_URL}/board-members/{member_id}/archive?term_end=2024")
        success = response.status_code == 200
        print_test_result(
            "PUT /api/board-members/{id}/archive", 
            success, 
            f"Status: {response.status_code}"
        )
        
        # Verify the member is now archived
        if success:
            verify_response = requests.get(f"{BACKEND_URL}/board-members/{member_id}")
            if verify_response.status_code == 200:
                archived_member = verify_response.json()
                is_archived = not archived_member.get('is_current', True)
                term_end_set = archived_member.get('term_end') == "2024"
                print(f"   ✅ Member archived: is_current={archived_member.get('is_current')}, term_end={archived_member.get('term_end')}")
            
    except Exception as e:
        print_test_result("PUT /api/board-members/{id}/archive", False, f"Error: {str(e)}")
    
    # Test 8: Verify archived member appears in archive endpoint
    try:
        response = requests.get(f"{BACKEND_URL}/board-members/archive")
        success = response.status_code == 200
        archived_members = response.json() if success else []
        found_archived = any(member.get('id') == member_id for member in archived_members)
        print_test_result(
            "GET /api/board-members/archive (after archive)", 
            success and found_archived, 
            f"Status: {response.status_code}, Archived member found: {found_archived}, Total archived: {len(archived_members)}"
        )
    except Exception as e:
        print_test_result("GET /api/board-members/archive (after archive)", False, f"Error: {str(e)}")
    
    # Test 9: DELETE /api/board-members/{id} - Delete a member permanently
    try:
        response = requests.delete(f"{BACKEND_URL}/board-members/{member_id}")
        success = response.status_code == 200
        print_test_result(
            "DELETE /api/board-members/{id}", 
            success, 
            f"Status: {response.status_code}"
        )
    except Exception as e:
        print_test_result("DELETE /api/board-members/{id}", False, f"Error: {str(e)}")
    
    # Test 10: Verify deletion - GET /api/board-members/{id} should return 404
    try:
        response = requests.get(f"{BACKEND_URL}/board-members/{member_id}")
        success = response.status_code == 404
        print_test_result(
            "GET /api/board-members/{id} (after delete)", 
            success, 
            f"Status: {response.status_code} (should be 404)"
        )
    except Exception as e:
        print_test_result("GET /api/board-members/{id} (after delete)", False, f"Error: {str(e)}")
    
    return True

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
    test_board_members_api()
    
    print("=" * 60)
    print("🏁 Backend API Testing Complete")
    print("=" * 60)

if __name__ == "__main__":
    main()