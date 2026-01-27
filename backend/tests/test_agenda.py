"""
Backend tests for Workshop Agenda API endpoints
Tests: GET/POST agenda, publish agenda, public agenda view, send reminder
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://haggai-training.preview.emergentagent.com')

# Test workshop ID provided in the review request
TEST_WORKSHOP_ID = "f60eb66e-3956-428d-8060-181ceeb498f8"


class TestWorkshopAgendaAPI:
    """Test Workshop Agenda CRUD operations"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test session"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
    
    def test_get_workshop_agenda(self):
        """GET /api/workshops/{id}/agenda - Get agenda for a workshop"""
        response = self.session.get(f"{BASE_URL}/api/workshops/{TEST_WORKSHOP_ID}/agenda")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "workshop_id" in data or "days" in data, "Response should contain workshop_id or days"
        assert "days" in data, "Response should contain days array"
        assert "is_published" in data, "Response should contain is_published flag"
        
        print(f"✓ GET agenda returned {len(data.get('days', []))} days, is_published: {data.get('is_published')}")
    
    def test_get_workshop_agenda_nonexistent(self):
        """GET /api/workshops/{id}/agenda - Returns empty structure for nonexistent workshop"""
        fake_id = str(uuid.uuid4())
        response = self.session.get(f"{BASE_URL}/api/workshops/{fake_id}/agenda")
        
        # Should return empty agenda structure, not 404
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data.get("days") == [], "Should return empty days array"
        assert data.get("is_published") == False, "Should return is_published as False"
        
        print("✓ GET agenda for nonexistent workshop returns empty structure")
    
    def test_create_agenda_with_days_and_sessions(self):
        """POST /api/workshops/{id}/agenda - Create agenda with days and sessions"""
        # First, we need a workshop to test with - use the test workshop
        agenda_payload = {
            "workshop_id": TEST_WORKSHOP_ID,
            "days": [
                {
                    "date": "2026-03-15",
                    "day_number": 1,
                    "title": "TEST_Dag 1 - Introduktion",
                    "sessions": [
                        {
                            "start_time": "09:00",
                            "end_time": "10:00",
                            "title": "TEST_Välkomst och registrering",
                            "session_type": "registration",
                            "order": 0
                        },
                        {
                            "start_time": "10:00",
                            "end_time": "11:00",
                            "title": "TEST_Ledarskap i praktiken",
                            "description": "En introduktion till ledarskap",
                            "session_type": "session",
                            "order": 1
                        },
                        {
                            "start_time": "11:00",
                            "end_time": "11:15",
                            "title": "Paus",
                            "session_type": "break",
                            "order": 2
                        }
                    ]
                }
            ],
            "is_published": False,
            "notify_participants": False
        }
        
        response = self.session.post(
            f"{BASE_URL}/api/workshops/{TEST_WORKSHOP_ID}/agenda",
            json=agenda_payload
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data.get("workshop_id") == TEST_WORKSHOP_ID, "workshop_id should match"
        assert len(data.get("days", [])) >= 1, "Should have at least 1 day"
        
        # Verify sessions were created
        first_day = data["days"][0]
        assert len(first_day.get("sessions", [])) >= 3, "First day should have at least 3 sessions"
        
        print(f"✓ POST agenda created with {len(data['days'])} days")
    
    def test_update_existing_agenda(self):
        """POST /api/workshops/{id}/agenda - Update existing agenda"""
        # Create/update agenda with new data
        agenda_payload = {
            "workshop_id": TEST_WORKSHOP_ID,
            "days": [
                {
                    "date": "2026-03-15",
                    "day_number": 1,
                    "title": "TEST_Dag 1 - Uppdaterad",
                    "sessions": [
                        {
                            "start_time": "09:00",
                            "end_time": "10:00",
                            "title": "TEST_Uppdaterad session",
                            "session_type": "session",
                            "order": 0
                        }
                    ]
                },
                {
                    "date": "2026-03-16",
                    "day_number": 2,
                    "title": "TEST_Dag 2 - Ny dag",
                    "sessions": [
                        {
                            "start_time": "09:00",
                            "end_time": "12:00",
                            "title": "TEST_Dag 2 session",
                            "session_type": "session",
                            "order": 0
                        }
                    ]
                }
            ],
            "is_published": False,
            "notify_participants": False
        }
        
        response = self.session.post(
            f"{BASE_URL}/api/workshops/{TEST_WORKSHOP_ID}/agenda",
            json=agenda_payload
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert len(data.get("days", [])) == 2, "Should have 2 days after update"
        
        # Verify GET returns updated data
        get_response = self.session.get(f"{BASE_URL}/api/workshops/{TEST_WORKSHOP_ID}/agenda")
        get_data = get_response.json()
        assert len(get_data.get("days", [])) == 2, "GET should return 2 days"
        
        print("✓ POST agenda update successful - 2 days now")
    
    def test_agenda_session_types(self):
        """POST /api/workshops/{id}/agenda - Test different session types"""
        agenda_payload = {
            "workshop_id": TEST_WORKSHOP_ID,
            "days": [
                {
                    "date": "2026-03-15",
                    "day_number": 1,
                    "title": "TEST_Session Types Test",
                    "sessions": [
                        {"start_time": "08:00", "end_time": "09:00", "title": "Registrering", "session_type": "registration", "order": 0},
                        {"start_time": "09:00", "end_time": "10:00", "title": "Session 1", "session_type": "session", "order": 1},
                        {"start_time": "10:00", "end_time": "10:15", "title": "Paus", "session_type": "break", "order": 2},
                        {"start_time": "12:00", "end_time": "13:00", "title": "Lunch", "session_type": "lunch", "order": 3},
                        {"start_time": "15:00", "end_time": "15:30", "title": "Övrigt", "session_type": "other", "order": 4}
                    ]
                }
            ],
            "is_published": False,
            "notify_participants": False
        }
        
        response = self.session.post(
            f"{BASE_URL}/api/workshops/{TEST_WORKSHOP_ID}/agenda",
            json=agenda_payload
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        sessions = data["days"][0]["sessions"]
        session_types = [s["session_type"] for s in sessions]
        
        assert "registration" in session_types, "Should have registration session"
        assert "session" in session_types, "Should have session type"
        assert "break" in session_types, "Should have break type"
        assert "lunch" in session_types, "Should have lunch type"
        assert "other" in session_types, "Should have other type"
        
        print("✓ All session types (registration, session, break, lunch, other) work correctly")


class TestAgendaPublish:
    """Test agenda publishing functionality"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test session"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
    
    def test_publish_agenda(self):
        """PUT /api/workshops/{id}/agenda/publish - Publish agenda"""
        # First ensure agenda exists
        agenda_payload = {
            "workshop_id": TEST_WORKSHOP_ID,
            "days": [
                {
                    "date": "2026-03-15",
                    "day_number": 1,
                    "title": "TEST_Publish Test Day",
                    "sessions": [
                        {"start_time": "09:00", "end_time": "10:00", "title": "TEST_Session", "session_type": "session", "order": 0}
                    ]
                }
            ],
            "is_published": False,
            "notify_participants": False
        }
        
        self.session.post(f"{BASE_URL}/api/workshops/{TEST_WORKSHOP_ID}/agenda", json=agenda_payload)
        
        # Now publish
        response = self.session.put(
            f"{BASE_URL}/api/workshops/{TEST_WORKSHOP_ID}/agenda/publish?notify=false"
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data.get("success") == True, "Should return success: true"
        
        # Verify agenda is now published
        get_response = self.session.get(f"{BASE_URL}/api/workshops/{TEST_WORKSHOP_ID}/agenda")
        get_data = get_response.json()
        assert get_data.get("is_published") == True, "Agenda should be published"
        
        print("✓ PUT publish agenda successful")
    
    def test_publish_nonexistent_agenda(self):
        """PUT /api/workshops/{id}/agenda/publish - Returns 404 for nonexistent agenda"""
        fake_id = str(uuid.uuid4())
        response = self.session.put(f"{BASE_URL}/api/workshops/{fake_id}/agenda/publish")
        
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        
        print("✓ PUT publish nonexistent agenda returns 404")


class TestPublicAgenda:
    """Test public agenda view"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test session"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
    
    def test_get_public_agenda_published(self):
        """GET /api/agenda/public/{id} - Get published agenda"""
        # Ensure agenda is published first
        agenda_payload = {
            "workshop_id": TEST_WORKSHOP_ID,
            "days": [
                {
                    "date": "2026-03-15",
                    "day_number": 1,
                    "title": "TEST_Public View Day",
                    "sessions": [
                        {"start_time": "09:00", "end_time": "10:00", "title": "TEST_Public Session", "session_type": "session", "order": 0}
                    ]
                }
            ],
            "is_published": True,
            "notify_participants": False
        }
        
        self.session.post(f"{BASE_URL}/api/workshops/{TEST_WORKSHOP_ID}/agenda", json=agenda_payload)
        
        # Get public agenda
        response = self.session.get(f"{BASE_URL}/api/agenda/public/{TEST_WORKSHOP_ID}")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "days" in data, "Should contain days"
        assert "workshop" in data, "Should contain workshop info"
        assert data.get("is_published") == True, "Should be published"
        
        print(f"✓ GET public agenda returned {len(data.get('days', []))} days with workshop info")
    
    def test_get_public_agenda_not_published(self):
        """GET /api/agenda/public/{id} - Returns 404 for unpublished agenda"""
        # Create unpublished agenda for a different workshop
        # First check if there's an unpublished workshop
        fake_id = str(uuid.uuid4())
        response = self.session.get(f"{BASE_URL}/api/agenda/public/{fake_id}")
        
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        
        print("✓ GET public agenda for unpublished/nonexistent returns 404")


class TestAgendaReminder:
    """Test agenda reminder functionality"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test session"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
    
    def test_send_reminder_for_day(self):
        """POST /api/workshops/{id}/agenda/send-reminder - Send reminder for a day"""
        # Ensure agenda exists with at least one day
        agenda_payload = {
            "workshop_id": TEST_WORKSHOP_ID,
            "days": [
                {
                    "date": "2026-03-15",
                    "day_number": 1,
                    "title": "TEST_Reminder Day",
                    "sessions": [
                        {"start_time": "09:00", "end_time": "10:00", "title": "TEST_Session", "session_type": "session", "order": 0}
                    ]
                }
            ],
            "is_published": True,
            "notify_participants": False
        }
        
        self.session.post(f"{BASE_URL}/api/workshops/{TEST_WORKSHOP_ID}/agenda", json=agenda_payload)
        
        # Send reminder for day 1
        response = self.session.post(
            f"{BASE_URL}/api/workshops/{TEST_WORKSHOP_ID}/agenda/send-reminder?day_number=1"
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert data.get("success") == True, "Should return success: true"
        
        print("✓ POST send-reminder for day 1 successful")
    
    def test_send_reminder_nonexistent_day(self):
        """POST /api/workshops/{id}/agenda/send-reminder - Returns 404 for nonexistent day"""
        response = self.session.post(
            f"{BASE_URL}/api/workshops/{TEST_WORKSHOP_ID}/agenda/send-reminder?day_number=999"
        )
        
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        
        print("✓ POST send-reminder for nonexistent day returns 404")
    
    def test_send_reminder_nonexistent_agenda(self):
        """POST /api/workshops/{id}/agenda/send-reminder - Returns 404 for nonexistent agenda"""
        fake_id = str(uuid.uuid4())
        response = self.session.post(
            f"{BASE_URL}/api/workshops/{fake_id}/agenda/send-reminder?day_number=1"
        )
        
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        
        print("✓ POST send-reminder for nonexistent agenda returns 404")


class TestWorkshopEndpoints:
    """Test workshop endpoints needed for agenda"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test session"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
    
    def test_get_workshop(self):
        """GET /api/workshops/{id} - Get workshop details"""
        response = self.session.get(f"{BASE_URL}/api/workshops/{TEST_WORKSHOP_ID}")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "id" in data, "Should contain id"
        assert "title" in data, "Should contain title"
        
        print(f"✓ GET workshop returned: {data.get('title', {})}")
    
    def test_get_workshops_list(self):
        """GET /api/workshops - Get list of workshops"""
        response = self.session.get(f"{BASE_URL}/api/workshops?active_only=false")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert isinstance(data, list), "Should return a list"
        
        print(f"✓ GET workshops returned {len(data)} workshops")
    
    def test_get_leaders(self):
        """GET /api/leaders - Get list of leaders (for session assignment)"""
        response = self.session.get(f"{BASE_URL}/api/leaders")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert isinstance(data, list), "Should return a list"
        
        print(f"✓ GET leaders returned {len(data)} leaders")


class TestAgendaCleanup:
    """Cleanup test data and restore original agenda"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test session"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
    
    def test_restore_original_agenda(self):
        """Restore the original agenda for the test workshop"""
        # Restore with the original 2-day agenda mentioned in the context
        agenda_payload = {
            "workshop_id": TEST_WORKSHOP_ID,
            "days": [
                {
                    "date": "2026-03-15",
                    "day_number": 1,
                    "title": "Dag 1",
                    "sessions": [
                        {"start_time": "09:00", "end_time": "10:00", "title": "Välkomst och registrering", "session_type": "registration", "order": 0},
                        {"start_time": "10:00", "end_time": "11:00", "title": "Ledarskap i praktiken", "session_type": "session", "order": 1},
                        {"start_time": "11:00", "end_time": "11:15", "title": "Paus", "session_type": "break", "order": 2},
                        {"start_time": "11:15", "end_time": "12:15", "title": "Gruppdiskussion", "session_type": "session", "order": 3},
                        {"start_time": "12:15", "end_time": "13:15", "title": "Lunch", "session_type": "lunch", "order": 4}
                    ]
                },
                {
                    "date": "2026-03-16",
                    "day_number": 2,
                    "title": "Dag 2",
                    "sessions": [
                        {"start_time": "09:00", "end_time": "10:00", "title": "Morgonsamling", "session_type": "session", "order": 0},
                        {"start_time": "10:00", "end_time": "11:00", "title": "Workshop", "session_type": "session", "order": 1},
                        {"start_time": "11:00", "end_time": "11:15", "title": "Paus", "session_type": "break", "order": 2},
                        {"start_time": "11:15", "end_time": "12:00", "title": "Avslutning", "session_type": "session", "order": 3}
                    ]
                }
            ],
            "is_published": True,
            "notify_participants": False
        }
        
        response = self.session.post(
            f"{BASE_URL}/api/workshops/{TEST_WORKSHOP_ID}/agenda",
            json=agenda_payload
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        print("✓ Original agenda restored with 2 days")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
