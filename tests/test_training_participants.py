"""
Test suite for Training Participants API endpoints
Tests: GET list, PUT status, PUT attendance, POST generate-diploma, POST send-diploma
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://haggai-members.preview.emergentagent.com')

# Test participant ID provided in the review request
TEST_PARTICIPANT_ID = "ee1f7ae1-0e59-410a-83a5-98c8918c051f"


class TestTrainingParticipantsAPI:
    """Training Participants API endpoint tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test session"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
    
    def test_get_training_participants_list(self):
        """Test GET /api/training-participants returns list of participants"""
        response = self.session.get(f"{BASE_URL}/api/training-participants")
        
        # Status code assertion
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        # Data assertions
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        print(f"✓ GET /api/training-participants returned {len(data)} participants")
        
        # If we have participants, verify structure
        if len(data) > 0:
            participant = data[0]
            # Check expected fields exist
            assert "id" in participant, "Participant should have 'id' field"
            assert "registration_completed" in participant, "Participant should have 'registration_completed' field"
            print(f"✓ First participant ID: {participant.get('id')}")
            print(f"✓ First participant name: {participant.get('registration_data', {}).get('full_name', participant.get('nominee_name', 'N/A'))}")
    
    def test_get_specific_training_participant(self):
        """Test GET /api/training-participants/{id} returns specific participant"""
        response = self.session.get(f"{BASE_URL}/api/training-participants/{TEST_PARTICIPANT_ID}")
        
        # Status code assertion
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        # Data assertions
        data = response.json()
        assert data.get("id") == TEST_PARTICIPANT_ID, f"Expected ID {TEST_PARTICIPANT_ID}, got {data.get('id')}"
        assert data.get("registration_completed") == True, "Participant should have registration_completed=True"
        print(f"✓ GET /api/training-participants/{TEST_PARTICIPANT_ID} returned participant")
        print(f"  - Name: {data.get('registration_data', {}).get('full_name', data.get('nominee_name', 'N/A'))}")
        print(f"  - Status: {data.get('status')}")
        print(f"  - Attendance hours: {data.get('attendance_hours', 0)}")
    
    def test_get_nonexistent_participant_returns_404(self):
        """Test GET /api/training-participants/{id} returns 404 for non-existent participant"""
        fake_id = "nonexistent-participant-id-12345"
        response = self.session.get(f"{BASE_URL}/api/training-participants/{fake_id}")
        
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print(f"✓ GET /api/training-participants/{fake_id} correctly returned 404")
    
    def test_update_participant_status_to_accepted(self):
        """Test PUT /api/training-participants/{id}/status updates status to accepted"""
        # First get current status
        get_response = self.session.get(f"{BASE_URL}/api/training-participants/{TEST_PARTICIPANT_ID}")
        assert get_response.status_code == 200
        original_status = get_response.json().get("status")
        
        # Update to accepted
        response = self.session.put(
            f"{BASE_URL}/api/training-participants/{TEST_PARTICIPANT_ID}/status",
            json={"status": "accepted"}
        )
        
        # Status code assertion
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        # Data assertions
        data = response.json()
        assert data.get("status") == "accepted", f"Expected status 'accepted', got {data.get('status')}"
        print(f"✓ PUT /api/training-participants/{TEST_PARTICIPANT_ID}/status updated to 'accepted'")
        
        # Verify persistence with GET
        verify_response = self.session.get(f"{BASE_URL}/api/training-participants/{TEST_PARTICIPANT_ID}")
        assert verify_response.status_code == 200
        assert verify_response.json().get("status") == "accepted", "Status change not persisted"
        print(f"✓ Status change verified via GET")
    
    def test_update_participant_status_to_rejected(self):
        """Test PUT /api/training-participants/{id}/status updates status to rejected"""
        response = self.session.put(
            f"{BASE_URL}/api/training-participants/{TEST_PARTICIPANT_ID}/status",
            json={"status": "rejected"}
        )
        
        # Status code assertion
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        # Data assertions
        data = response.json()
        assert data.get("status") == "rejected", f"Expected status 'rejected', got {data.get('status')}"
        print(f"✓ PUT /api/training-participants/{TEST_PARTICIPANT_ID}/status updated to 'rejected'")
    
    def test_update_participant_attendance_hours(self):
        """Test PUT /api/training-participants/{id}/attendance updates attendance hours"""
        # First set status to accepted so we can test attendance
        self.session.put(
            f"{BASE_URL}/api/training-participants/{TEST_PARTICIPANT_ID}/status",
            json={"status": "accepted"}
        )
        
        # Update attendance to 15 hours
        response = self.session.put(
            f"{BASE_URL}/api/training-participants/{TEST_PARTICIPANT_ID}/attendance",
            json={"attendance_hours": 15}
        )
        
        # Status code assertion
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        # Data assertions
        data = response.json()
        assert data.get("attendance_hours") == 15, f"Expected 15 hours, got {data.get('attendance_hours')}"
        print(f"✓ PUT /api/training-participants/{TEST_PARTICIPANT_ID}/attendance updated to 15 hours")
        
        # Verify persistence
        verify_response = self.session.get(f"{BASE_URL}/api/training-participants/{TEST_PARTICIPANT_ID}")
        assert verify_response.json().get("attendance_hours") == 15, "Attendance hours not persisted"
        print(f"✓ Attendance hours verified via GET")
    
    def test_attendance_21_hours_auto_completes(self):
        """Test PUT /api/training-participants/{id}/attendance auto-sets status to completed at 21 hours"""
        # Update attendance to 21 hours
        response = self.session.put(
            f"{BASE_URL}/api/training-participants/{TEST_PARTICIPANT_ID}/attendance",
            json={"attendance_hours": 21}
        )
        
        # Status code assertion
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        # Data assertions - should auto-complete
        data = response.json()
        assert data.get("attendance_hours") == 21, f"Expected 21 hours, got {data.get('attendance_hours')}"
        assert data.get("status") == "completed", f"Expected status 'completed', got {data.get('status')}"
        print(f"✓ PUT /api/training-participants/{TEST_PARTICIPANT_ID}/attendance with 21 hours auto-completed")
        print(f"  - Attendance hours: {data.get('attendance_hours')}")
        print(f"  - Status: {data.get('status')}")
    
    def test_generate_diploma_pdf(self):
        """Test POST /api/training-participants/{id}/generate-diploma returns PDF file"""
        # Ensure participant has 21 hours
        self.session.put(
            f"{BASE_URL}/api/training-participants/{TEST_PARTICIPANT_ID}/attendance",
            json={"attendance_hours": 21}
        )
        
        response = self.session.post(f"{BASE_URL}/api/training-participants/{TEST_PARTICIPANT_ID}/generate-diploma")
        
        # Status code assertion
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        # Content type should be PDF
        content_type = response.headers.get("content-type", "")
        assert "application/pdf" in content_type, f"Expected PDF content type, got {content_type}"
        
        # Should have content-disposition header for download
        content_disposition = response.headers.get("content-disposition", "")
        assert "attachment" in content_disposition, f"Expected attachment disposition, got {content_disposition}"
        assert ".pdf" in content_disposition.lower(), "Expected .pdf in filename"
        
        # PDF should have content
        assert len(response.content) > 0, "PDF content should not be empty"
        print(f"✓ POST /api/training-participants/{TEST_PARTICIPANT_ID}/generate-diploma returned PDF")
        print(f"  - Content-Type: {content_type}")
        print(f"  - Content-Disposition: {content_disposition}")
        print(f"  - PDF size: {len(response.content)} bytes")
    
    def test_generate_diploma_fails_without_21_hours(self):
        """Test POST /api/training-participants/{id}/generate-diploma fails if < 21 hours"""
        # Set attendance to less than 21 hours
        self.session.put(
            f"{BASE_URL}/api/training-participants/{TEST_PARTICIPANT_ID}/attendance",
            json={"attendance_hours": 10}
        )
        
        response = self.session.post(f"{BASE_URL}/api/training-participants/{TEST_PARTICIPANT_ID}/generate-diploma")
        
        # Should fail with 400
        assert response.status_code == 400, f"Expected 400, got {response.status_code}: {response.text}"
        print(f"✓ POST /api/training-participants/{TEST_PARTICIPANT_ID}/generate-diploma correctly rejected (< 21 hours)")
        
        # Restore 21 hours for other tests
        self.session.put(
            f"{BASE_URL}/api/training-participants/{TEST_PARTICIPANT_ID}/attendance",
            json={"attendance_hours": 21}
        )
    
    def test_send_diploma_email(self):
        """Test POST /api/training-participants/{id}/send-diploma sends diploma email"""
        # Ensure participant has 21 hours
        self.session.put(
            f"{BASE_URL}/api/training-participants/{TEST_PARTICIPANT_ID}/attendance",
            json={"attendance_hours": 21}
        )
        
        response = self.session.post(f"{BASE_URL}/api/training-participants/{TEST_PARTICIPANT_ID}/send-diploma")
        
        # Status code assertion
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        # Data assertions
        data = response.json()
        assert data.get("success") == True, f"Expected success=True, got {data.get('success')}"
        assert "message" in data, "Response should have 'message' field"
        print(f"✓ POST /api/training-participants/{TEST_PARTICIPANT_ID}/send-diploma sent email")
        print(f"  - Message: {data.get('message')}")
        
        # Verify diploma_sent flag is set
        verify_response = self.session.get(f"{BASE_URL}/api/training-participants/{TEST_PARTICIPANT_ID}")
        assert verify_response.status_code == 200
        assert verify_response.json().get("diploma_sent") == True, "diploma_sent flag not set"
        print(f"✓ diploma_sent flag verified via GET")
    
    def test_update_status_nonexistent_participant(self):
        """Test PUT /api/training-participants/{id}/status returns 404 for non-existent participant"""
        fake_id = "nonexistent-participant-id-12345"
        response = self.session.put(
            f"{BASE_URL}/api/training-participants/{fake_id}/status",
            json={"status": "accepted"}
        )
        
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print(f"✓ PUT /api/training-participants/{fake_id}/status correctly returned 404")
    
    def test_update_attendance_nonexistent_participant(self):
        """Test PUT /api/training-participants/{id}/attendance returns 404 for non-existent participant"""
        fake_id = "nonexistent-participant-id-12345"
        response = self.session.put(
            f"{BASE_URL}/api/training-participants/{fake_id}/attendance",
            json={"attendance_hours": 10}
        )
        
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print(f"✓ PUT /api/training-participants/{fake_id}/attendance correctly returned 404")


class TestAPIHealth:
    """Basic API health checks"""
    
    def test_api_root_endpoint(self):
        """Test GET /api/ returns success"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print(f"✓ GET /api/ returned 200")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
