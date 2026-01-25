"""
Test suite for Shareable Nomination Link and QR Code Feature
Tests:
- GET /api/workshops/:id - Get single workshop for public nomination form
- POST /api/nominations - Create nomination from public form
- GET /api/nominations - List nominations
"""

import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test workshop ID from existing data
TEST_WORKSHOP_ID = "f60eb66e-3956-428d-8060-181ceeb498f8"


class TestWorkshopEndpointForNomination:
    """Test GET /api/workshops/:id endpoint used by public nomination form"""
    
    def test_get_workshop_by_id_success(self):
        """Test fetching a specific workshop by ID"""
        response = requests.get(f"{BASE_URL}/api/workshops/{TEST_WORKSHOP_ID}")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "id" in data
        assert data["id"] == TEST_WORKSHOP_ID
        assert "title" in data
        assert "date" in data
        assert "location" in data
        print(f"✓ GET /api/workshops/{TEST_WORKSHOP_ID} - Workshop fetched successfully")
        print(f"  Workshop title: {data.get('title', {}).get('sv', data.get('title'))}")
    
    def test_get_workshop_by_id_not_found(self):
        """Test fetching a non-existent workshop returns 404"""
        fake_id = str(uuid.uuid4())
        response = requests.get(f"{BASE_URL}/api/workshops/{fake_id}")
        
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print(f"✓ GET /api/workshops/{fake_id} - Returns 404 for non-existent workshop")
    
    def test_workshop_has_required_fields_for_nomination_form(self):
        """Test that workshop response has all fields needed for public nomination form"""
        response = requests.get(f"{BASE_URL}/api/workshops/{TEST_WORKSHOP_ID}")
        
        assert response.status_code == 200
        data = response.json()
        
        # Fields required by PublicNominationForm.jsx
        required_fields = ["id", "title", "date", "location"]
        for field in required_fields:
            assert field in data, f"Missing required field: {field}"
        
        # Title should be localized (object with sv/en/ar keys)
        title = data.get("title")
        if isinstance(title, dict):
            assert "sv" in title or "en" in title, "Title should have localized versions"
        
        print("✓ Workshop has all required fields for nomination form")


class TestNominationCreation:
    """Test POST /api/nominations endpoint for public nomination form submission"""
    
    def test_create_nomination_success(self):
        """Test creating a nomination from public form"""
        unique_id = str(uuid.uuid4())[:8]
        
        nomination_data = {
            "event_id": TEST_WORKSHOP_ID,
            "event_title": "Workshop – Nationell mars 2026",
            "event_date": "2026-03-13",
            "nominator_name": f"TEST_Nominator_{unique_id}",
            "nominator_email": f"test_nominator_{unique_id}@test.se",
            "nominator_phone": "070-1234567",
            "nominator_church": "Test Kyrka",
            "nominator_relation": "Pastor",
            "nominee_name": f"TEST_Nominee_{unique_id}",
            "nominee_email": f"test_nominee_{unique_id}@test.se",
            "nominee_phone": "070-7654321",
            "nominee_church": "Test Församling",
            "nominee_role": "Ungdomsledare",
            "nominee_activities": "Leder ungdomsgrupp, deltar i körtjänst",
            "motivation": "En engagerad ledare med stor potential för tillväxt."
        }
        
        response = requests.post(
            f"{BASE_URL}/api/nominations",
            json=nomination_data,
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "id" in data
        assert data["event_id"] == TEST_WORKSHOP_ID
        assert data["nominator_name"] == nomination_data["nominator_name"]
        assert data["nominee_name"] == nomination_data["nominee_name"]
        assert data["status"] == "pending"  # New nominations start as pending
        
        print(f"✓ POST /api/nominations - Nomination created successfully")
        print(f"  Nomination ID: {data['id']}")
        print(f"  Status: {data['status']}")
        
        # Store for cleanup
        return data["id"]
    
    def test_create_nomination_minimal_fields(self):
        """Test creating nomination with only required fields"""
        unique_id = str(uuid.uuid4())[:8]
        
        nomination_data = {
            "event_id": TEST_WORKSHOP_ID,
            "event_title": "Workshop – Nationell mars 2026",
            "nominator_name": f"TEST_MinNominator_{unique_id}",
            "nominator_email": f"test_min_nominator_{unique_id}@test.se",
            "nominee_name": f"TEST_MinNominee_{unique_id}",
            "nominee_email": f"test_min_nominee_{unique_id}@test.se",
            "motivation": "Test motivation"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/nominations",
            json=nomination_data,
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "id" in data
        assert data["status"] == "pending"
        
        print("✓ POST /api/nominations - Nomination with minimal fields created")
    
    def test_create_nomination_missing_required_fields(self):
        """Test that nomination fails without required fields"""
        incomplete_data = {
            "event_id": TEST_WORKSHOP_ID,
            "nominator_name": "Test Nominator"
            # Missing: nominator_email, nominee_name, nominee_email, event_title
        }
        
        response = requests.post(
            f"{BASE_URL}/api/nominations",
            json=incomplete_data,
            headers={"Content-Type": "application/json"}
        )
        
        # Should return 422 (validation error) for missing required fields
        assert response.status_code == 422, f"Expected 422, got {response.status_code}"
        print("✓ POST /api/nominations - Returns 422 for missing required fields")


class TestNominationRetrieval:
    """Test GET /api/nominations endpoint"""
    
    def test_get_all_nominations(self):
        """Test fetching all nominations"""
        response = requests.get(f"{BASE_URL}/api/nominations")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/nominations - Retrieved {len(data)} nominations")
    
    def test_get_nominations_by_event_id(self):
        """Test filtering nominations by event_id"""
        response = requests.get(f"{BASE_URL}/api/nominations?event_id={TEST_WORKSHOP_ID}")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert isinstance(data, list)
        
        # All returned nominations should have the specified event_id
        for nomination in data:
            assert nomination["event_id"] == TEST_WORKSHOP_ID
        
        print(f"✓ GET /api/nominations?event_id={TEST_WORKSHOP_ID} - Filtered by event_id")
    
    def test_get_nominations_by_status(self):
        """Test filtering nominations by status"""
        response = requests.get(f"{BASE_URL}/api/nominations?status=pending")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert isinstance(data, list)
        
        # All returned nominations should have pending status
        for nomination in data:
            assert nomination["status"] == "pending"
        
        print(f"✓ GET /api/nominations?status=pending - Filtered by status")


class TestNominationLinkWorkflow:
    """Test the complete nomination link workflow"""
    
    def test_full_nomination_workflow(self):
        """Test the complete flow: get workshop -> submit nomination -> verify"""
        unique_id = str(uuid.uuid4())[:8]
        
        # Step 1: Get workshop info (simulates public form loading)
        workshop_response = requests.get(f"{BASE_URL}/api/workshops/{TEST_WORKSHOP_ID}")
        assert workshop_response.status_code == 200
        workshop = workshop_response.json()
        print(f"Step 1: ✓ Fetched workshop: {workshop.get('title', {}).get('sv', workshop.get('title'))}")
        
        # Step 2: Submit nomination (simulates form submission)
        nomination_data = {
            "event_id": workshop["id"],
            "event_title": workshop.get("title", {}).get("sv", str(workshop.get("title"))),
            "event_date": workshop.get("date"),
            "nominator_name": f"TEST_Workflow_Nominator_{unique_id}",
            "nominator_email": f"test_workflow_{unique_id}@test.se",
            "nominator_church": "Test Workflow Kyrka",
            "nominator_relation": "Kollega",
            "nominee_name": f"TEST_Workflow_Nominee_{unique_id}",
            "nominee_email": f"test_workflow_nominee_{unique_id}@test.se",
            "nominee_church": "Test Workflow Församling",
            "nominee_role": "Diakon",
            "motivation": "Workflow test nomination"
        }
        
        nomination_response = requests.post(
            f"{BASE_URL}/api/nominations",
            json=nomination_data,
            headers={"Content-Type": "application/json"}
        )
        assert nomination_response.status_code == 200
        nomination = nomination_response.json()
        print(f"Step 2: ✓ Created nomination: {nomination['id']}")
        
        # Step 3: Verify nomination exists in list
        list_response = requests.get(f"{BASE_URL}/api/nominations?event_id={TEST_WORKSHOP_ID}")
        assert list_response.status_code == 200
        nominations = list_response.json()
        
        found = any(n["id"] == nomination["id"] for n in nominations)
        assert found, "Created nomination not found in list"
        print(f"Step 3: ✓ Verified nomination exists in database")
        
        # Step 4: Get specific nomination
        get_response = requests.get(f"{BASE_URL}/api/nominations/{nomination['id']}")
        assert get_response.status_code == 200
        fetched = get_response.json()
        assert fetched["id"] == nomination["id"]
        assert fetched["status"] == "pending"
        print(f"Step 4: ✓ Fetched specific nomination, status: {fetched['status']}")
        
        print("\n✓ Full nomination workflow completed successfully!")


class TestCleanup:
    """Cleanup test data"""
    
    def test_cleanup_test_nominations(self):
        """Delete test nominations created during testing"""
        response = requests.get(f"{BASE_URL}/api/nominations")
        if response.status_code == 200:
            nominations = response.json()
            deleted_count = 0
            for nomination in nominations:
                if nomination.get("nominator_name", "").startswith("TEST_"):
                    delete_response = requests.delete(f"{BASE_URL}/api/nominations/{nomination['id']}")
                    if delete_response.status_code == 200:
                        deleted_count += 1
            print(f"✓ Cleaned up {deleted_count} test nominations")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
