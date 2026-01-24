"""
Test suite for Nomination API endpoints
Tests the admin-moderated nomination flow for Haggai Sweden
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestNominationEndpoints:
    """Test nomination CRUD operations and admin actions"""
    
    # Store created nomination IDs for cleanup
    created_nomination_ids = []
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup before each test"""
        yield
        # Cleanup after tests
    
    def test_get_nominations_list(self):
        """GET /api/nominations - should return list of nominations"""
        response = requests.get(f"{BASE_URL}/api/nominations")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/nominations returned {len(data)} nominations")
    
    def test_get_nominations_stats(self):
        """GET /api/nominations/stats - should return statistics"""
        response = requests.get(f"{BASE_URL}/api/nominations/stats")
        assert response.status_code == 200
        data = response.json()
        
        # Verify stats structure
        assert "total" in data
        assert "pending" in data
        assert "approved" in data
        assert "rejected" in data
        assert "contacted" in data
        assert "top_nominators" in data
        assert "by_event" in data
        
        # Verify data types
        assert isinstance(data["total"], int)
        assert isinstance(data["pending"], int)
        assert isinstance(data["top_nominators"], list)
        assert isinstance(data["by_event"], list)
        
        print(f"✓ GET /api/nominations/stats - Total: {data['total']}, Pending: {data['pending']}, Approved: {data['approved']}")
    
    def test_create_nomination_with_all_fields(self):
        """POST /api/nominations - create nomination with all new fields"""
        test_id = str(uuid.uuid4())[:8]
        nomination_data = {
            "event_id": f"TEST_event_{test_id}",
            "event_title": "TEST Leader Experience 2025",
            "event_date": "2025-06-15",
            # Nominator info
            "nominator_name": f"TEST_Nominator_{test_id}",
            "nominator_email": f"test_nominator_{test_id}@test.se",
            "nominator_phone": "070-1234567",
            "nominator_church": "TEST Kyrka Stockholm",
            "nominator_relation": "Pastor och mentor",
            # Nominee info
            "nominee_name": f"TEST_Nominee_{test_id}",
            "nominee_email": f"test_nominee_{test_id}@test.se",
            "nominee_phone": "070-7654321",
            "nominee_church": "TEST Församling Göteborg",
            "nominee_role": "Ungdomsledare och diakon",
            "nominee_activities": "Leder ungdomsgrupp, organiserar läger, mentor för nya medlemmar",
            "motivation": "Denna person har visat exceptionella ledaregenskaper och skulle dra stor nytta av programmet."
        }
        
        response = requests.post(f"{BASE_URL}/api/nominations", json=nomination_data)
        assert response.status_code == 200
        
        data = response.json()
        
        # Verify all fields are saved correctly
        assert data["event_id"] == nomination_data["event_id"]
        assert data["event_title"] == nomination_data["event_title"]
        assert data["nominator_name"] == nomination_data["nominator_name"]
        assert data["nominator_email"] == nomination_data["nominator_email"]
        assert data["nominator_church"] == nomination_data["nominator_church"]
        assert data["nominator_relation"] == nomination_data["nominator_relation"]
        assert data["nominee_name"] == nomination_data["nominee_name"]
        assert data["nominee_email"] == nomination_data["nominee_email"]
        assert data["nominee_church"] == nomination_data["nominee_church"]
        assert data["nominee_role"] == nomination_data["nominee_role"]
        assert data["nominee_activities"] == nomination_data["nominee_activities"]
        assert data["motivation"] == nomination_data["motivation"]
        
        # Verify default status is pending
        assert data["status"] == "pending"
        
        # Verify ID was generated
        assert "id" in data
        assert len(data["id"]) > 0
        
        # Store for cleanup
        self.created_nomination_ids.append(data["id"])
        
        print(f"✓ POST /api/nominations - Created nomination with ID: {data['id']}")
        return data["id"]
    
    def test_get_nomination_by_id(self):
        """GET /api/nominations/{id} - get specific nomination"""
        # First create a nomination
        test_id = str(uuid.uuid4())[:8]
        nomination_data = {
            "event_id": f"TEST_event_{test_id}",
            "event_title": "TEST Event for GET",
            "nominator_name": f"TEST_Nominator_{test_id}",
            "nominator_email": f"test_{test_id}@test.se",
            "nominee_name": f"TEST_Nominee_{test_id}",
            "nominee_email": f"nominee_{test_id}@test.se",
            "nominee_church": "TEST Church",
            "nominee_role": "TEST Role"
        }
        
        create_response = requests.post(f"{BASE_URL}/api/nominations", json=nomination_data)
        assert create_response.status_code == 200
        created = create_response.json()
        nomination_id = created["id"]
        self.created_nomination_ids.append(nomination_id)
        
        # Now GET the nomination
        get_response = requests.get(f"{BASE_URL}/api/nominations/{nomination_id}")
        assert get_response.status_code == 200
        
        data = get_response.json()
        assert data["id"] == nomination_id
        assert data["nominator_name"] == nomination_data["nominator_name"]
        assert data["nominee_name"] == nomination_data["nominee_name"]
        
        print(f"✓ GET /api/nominations/{nomination_id} - Retrieved nomination successfully")
    
    def test_get_nominations_filtered_by_status(self):
        """GET /api/nominations?status=pending - filter by status"""
        response = requests.get(f"{BASE_URL}/api/nominations?status=pending")
        assert response.status_code == 200
        data = response.json()
        
        # All returned nominations should have pending status
        for nomination in data:
            assert nomination["status"] == "pending"
        
        print(f"✓ GET /api/nominations?status=pending - Returned {len(data)} pending nominations")
    
    def test_approve_nomination(self):
        """POST /api/nominations/{id}/approve - approve nomination and verify status change"""
        # First create a nomination
        test_id = str(uuid.uuid4())[:8]
        nomination_data = {
            "event_id": f"TEST_approve_{test_id}",
            "event_title": "TEST Event for Approval",
            "nominator_name": f"TEST_Nominator_{test_id}",
            "nominator_email": f"test_approve_{test_id}@test.se",
            "nominee_name": f"TEST_Nominee_{test_id}",
            "nominee_email": f"nominee_approve_{test_id}@test.se",
            "nominee_church": "TEST Church",
            "nominee_role": "TEST Role",
            "motivation": "Test motivation for approval"
        }
        
        create_response = requests.post(f"{BASE_URL}/api/nominations", json=nomination_data)
        assert create_response.status_code == 200
        created = create_response.json()
        nomination_id = created["id"]
        self.created_nomination_ids.append(nomination_id)
        
        # Verify initial status is pending
        assert created["status"] == "pending"
        
        # Approve the nomination
        approve_response = requests.post(f"{BASE_URL}/api/nominations/{nomination_id}/approve")
        assert approve_response.status_code == 200
        
        approved = approve_response.json()
        
        # Verify status changed to approved
        assert approved["status"] == "approved"
        assert approved["approved_at"] is not None
        
        # Verify by GET
        get_response = requests.get(f"{BASE_URL}/api/nominations/{nomination_id}")
        assert get_response.status_code == 200
        fetched = get_response.json()
        assert fetched["status"] == "approved"
        
        print(f"✓ POST /api/nominations/{nomination_id}/approve - Status changed to 'approved'")
    
    def test_reject_nomination(self):
        """POST /api/nominations/{id}/reject - reject nomination and verify status change"""
        # First create a nomination
        test_id = str(uuid.uuid4())[:8]
        nomination_data = {
            "event_id": f"TEST_reject_{test_id}",
            "event_title": "TEST Event for Rejection",
            "nominator_name": f"TEST_Nominator_{test_id}",
            "nominator_email": f"test_reject_{test_id}@test.se",
            "nominee_name": f"TEST_Nominee_{test_id}",
            "nominee_email": f"nominee_reject_{test_id}@test.se",
            "nominee_church": "TEST Church",
            "nominee_role": "TEST Role"
        }
        
        create_response = requests.post(f"{BASE_URL}/api/nominations", json=nomination_data)
        assert create_response.status_code == 200
        created = create_response.json()
        nomination_id = created["id"]
        self.created_nomination_ids.append(nomination_id)
        
        # Verify initial status is pending
        assert created["status"] == "pending"
        
        # Reject the nomination with reason
        reject_reason = "Test rejection reason"
        reject_response = requests.post(f"{BASE_URL}/api/nominations/{nomination_id}/reject?reason={reject_reason}")
        assert reject_response.status_code == 200
        
        rejected = reject_response.json()
        
        # Verify status changed to rejected
        assert rejected["status"] == "rejected"
        assert rejected["admin_notes"] == reject_reason
        
        # Verify by GET
        get_response = requests.get(f"{BASE_URL}/api/nominations/{nomination_id}")
        assert get_response.status_code == 200
        fetched = get_response.json()
        assert fetched["status"] == "rejected"
        
        print(f"✓ POST /api/nominations/{nomination_id}/reject - Status changed to 'rejected'")
    
    def test_update_nomination(self):
        """PUT /api/nominations/{id} - update nomination"""
        # First create a nomination
        test_id = str(uuid.uuid4())[:8]
        nomination_data = {
            "event_id": f"TEST_update_{test_id}",
            "event_title": "TEST Event for Update",
            "nominator_name": f"TEST_Nominator_{test_id}",
            "nominator_email": f"test_update_{test_id}@test.se",
            "nominee_name": f"TEST_Nominee_{test_id}",
            "nominee_email": f"nominee_update_{test_id}@test.se",
            "nominee_church": "TEST Church",
            "nominee_role": "TEST Role"
        }
        
        create_response = requests.post(f"{BASE_URL}/api/nominations", json=nomination_data)
        assert create_response.status_code == 200
        created = create_response.json()
        nomination_id = created["id"]
        self.created_nomination_ids.append(nomination_id)
        
        # Update the nomination
        update_data = {
            "status": "contacted",
            "admin_notes": "Contacted nominee via phone"
        }
        
        update_response = requests.put(f"{BASE_URL}/api/nominations/{nomination_id}", json=update_data)
        assert update_response.status_code == 200
        
        updated = update_response.json()
        assert updated["status"] == "contacted"
        assert updated["admin_notes"] == "Contacted nominee via phone"
        
        print(f"✓ PUT /api/nominations/{nomination_id} - Updated status to 'contacted'")
    
    def test_delete_nomination(self):
        """DELETE /api/nominations/{id} - delete nomination"""
        # First create a nomination
        test_id = str(uuid.uuid4())[:8]
        nomination_data = {
            "event_id": f"TEST_delete_{test_id}",
            "event_title": "TEST Event for Delete",
            "nominator_name": f"TEST_Nominator_{test_id}",
            "nominator_email": f"test_delete_{test_id}@test.se",
            "nominee_name": f"TEST_Nominee_{test_id}",
            "nominee_email": f"nominee_delete_{test_id}@test.se",
            "nominee_church": "TEST Church",
            "nominee_role": "TEST Role"
        }
        
        create_response = requests.post(f"{BASE_URL}/api/nominations", json=nomination_data)
        assert create_response.status_code == 200
        created = create_response.json()
        nomination_id = created["id"]
        
        # Delete the nomination
        delete_response = requests.delete(f"{BASE_URL}/api/nominations/{nomination_id}")
        assert delete_response.status_code == 200
        
        # Verify deletion by GET (should return 404)
        get_response = requests.get(f"{BASE_URL}/api/nominations/{nomination_id}")
        assert get_response.status_code == 404
        
        print(f"✓ DELETE /api/nominations/{nomination_id} - Nomination deleted successfully")
    
    def test_approve_already_approved_nomination(self):
        """POST /api/nominations/{id}/approve - should fail for already approved"""
        # First create and approve a nomination
        test_id = str(uuid.uuid4())[:8]
        nomination_data = {
            "event_id": f"TEST_double_approve_{test_id}",
            "event_title": "TEST Event for Double Approve",
            "nominator_name": f"TEST_Nominator_{test_id}",
            "nominator_email": f"test_double_{test_id}@test.se",
            "nominee_name": f"TEST_Nominee_{test_id}",
            "nominee_email": f"nominee_double_{test_id}@test.se",
            "nominee_church": "TEST Church",
            "nominee_role": "TEST Role"
        }
        
        create_response = requests.post(f"{BASE_URL}/api/nominations", json=nomination_data)
        assert create_response.status_code == 200
        created = create_response.json()
        nomination_id = created["id"]
        self.created_nomination_ids.append(nomination_id)
        
        # First approval
        approve_response1 = requests.post(f"{BASE_URL}/api/nominations/{nomination_id}/approve")
        assert approve_response1.status_code == 200
        
        # Second approval should fail
        approve_response2 = requests.post(f"{BASE_URL}/api/nominations/{nomination_id}/approve")
        assert approve_response2.status_code == 400
        
        print(f"✓ POST /api/nominations/{nomination_id}/approve - Correctly returns 400 for already approved")
    
    def test_get_nonexistent_nomination(self):
        """GET /api/nominations/{id} - should return 404 for non-existent"""
        fake_id = "nonexistent-nomination-id-12345"
        response = requests.get(f"{BASE_URL}/api/nominations/{fake_id}")
        assert response.status_code == 404
        
        print(f"✓ GET /api/nominations/{fake_id} - Correctly returns 404")


class TestNominationDataValidation:
    """Test data validation for nomination fields"""
    
    def test_create_nomination_minimal_fields(self):
        """POST /api/nominations - create with only required fields"""
        test_id = str(uuid.uuid4())[:8]
        nomination_data = {
            "event_id": f"TEST_minimal_{test_id}",
            "event_title": "TEST Minimal Event",
            "nominator_name": f"TEST_Nominator_{test_id}",
            "nominator_email": f"test_minimal_{test_id}@test.se",
            "nominee_name": f"TEST_Nominee_{test_id}",
            "nominee_email": f"nominee_minimal_{test_id}@test.se"
        }
        
        response = requests.post(f"{BASE_URL}/api/nominations", json=nomination_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "pending"
        
        # Optional fields should be None or empty
        assert data.get("nominator_church") is None or data.get("nominator_church") == ""
        assert data.get("nominee_role") is None or data.get("nominee_role") == ""
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/nominations/{data['id']}")
        
        print(f"✓ POST /api/nominations - Created with minimal required fields")


def cleanup_test_nominations():
    """Cleanup all TEST_ prefixed nominations"""
    response = requests.get(f"{BASE_URL}/api/nominations")
    if response.status_code == 200:
        nominations = response.json()
        for nom in nominations:
            if nom.get("event_id", "").startswith("TEST_") or nom.get("nominator_name", "").startswith("TEST_"):
                requests.delete(f"{BASE_URL}/api/nominations/{nom['id']}")
                print(f"Cleaned up test nomination: {nom['id']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
