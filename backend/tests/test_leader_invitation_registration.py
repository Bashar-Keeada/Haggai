"""
Test suite for Leader Invitation and Registration System
Tests the full flow: Admin sends invitation -> Leader registers -> Admin approves/rejects -> Leader logs in
"""
import pytest
import requests
import os
import uuid
from datetime import datetime

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://leadership-hub-34.preview.emergentagent.com')

# Test data prefix for cleanup
TEST_PREFIX = "TEST_LEADER_"

class TestLeaderInvitationEndpoints:
    """Test leader invitation CRUD operations"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test data"""
        self.test_email = f"{TEST_PREFIX}{uuid.uuid4().hex[:8]}@test.com"
        self.test_name = f"{TEST_PREFIX}Leader Name"
        yield
        # Cleanup will be done in individual tests
    
    def test_get_leader_invitations_empty_or_list(self):
        """GET /api/leader-invitations - Returns list of invitations"""
        response = requests.get(f"{BASE_URL}/api/leader-invitations")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/leader-invitations returns list with {len(data)} invitations")
    
    def test_create_leader_invitation(self):
        """POST /api/leader-invitations - Creates invitation and sends email"""
        payload = {
            "name": self.test_name,
            "email": self.test_email,
            "workshop_id": "",
            "workshop_title": "Test Workshop"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/leader-invitations",
            json=payload
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "invitation_id" in data
        assert data["message"] == "Inbjudan skickad"
        
        invitation_id = data["invitation_id"]
        print(f"✓ POST /api/leader-invitations created invitation: {invitation_id}")
        
        # Verify invitation exists
        invitations = requests.get(f"{BASE_URL}/api/leader-invitations").json()
        created = next((i for i in invitations if i["id"] == invitation_id), None)
        assert created is not None
        assert created["email"] == self.test_email.lower()
        assert created["name"] == self.test_name
        assert created["status"] == "pending"
        print(f"✓ Invitation verified in database with status 'pending'")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/leader-invitations/{invitation_id}")
    
    def test_create_duplicate_invitation_fails(self):
        """POST /api/leader-invitations - Fails for duplicate pending invitation"""
        payload = {
            "name": self.test_name,
            "email": self.test_email
        }
        
        # Create first invitation
        response1 = requests.post(f"{BASE_URL}/api/leader-invitations", json=payload)
        assert response1.status_code == 200
        invitation_id = response1.json()["invitation_id"]
        
        # Try to create duplicate
        response2 = requests.post(f"{BASE_URL}/api/leader-invitations", json=payload)
        assert response2.status_code == 400
        assert "redan skickats" in response2.json()["detail"]
        print(f"✓ Duplicate invitation correctly rejected")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/leader-invitations/{invitation_id}")
    
    def test_get_invitation_by_token(self):
        """GET /api/leader-invitations/{token} - Returns invitation by token"""
        # Create invitation first
        payload = {"name": self.test_name, "email": self.test_email}
        create_response = requests.post(f"{BASE_URL}/api/leader-invitations", json=payload)
        invitation_id = create_response.json()["invitation_id"]
        
        # Get all invitations to find the token
        invitations = requests.get(f"{BASE_URL}/api/leader-invitations").json()
        invitation = next((i for i in invitations if i["id"] == invitation_id), None)
        token = invitation["token"]
        
        # Get by token
        response = requests.get(f"{BASE_URL}/api/leader-invitations/{token}")
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == self.test_email.lower()
        assert data["name"] == self.test_name
        print(f"✓ GET /api/leader-invitations/{{token}} returns correct invitation")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/leader-invitations/{invitation_id}")
    
    def test_get_invitation_invalid_token(self):
        """GET /api/leader-invitations/{token} - Returns 404 for invalid token"""
        response = requests.get(f"{BASE_URL}/api/leader-invitations/invalid-token-12345")
        assert response.status_code == 404
        print(f"✓ Invalid token returns 404")
    
    def test_delete_invitation(self):
        """DELETE /api/leader-invitations/{id} - Deletes invitation"""
        # Create invitation
        payload = {"name": self.test_name, "email": self.test_email}
        create_response = requests.post(f"{BASE_URL}/api/leader-invitations", json=payload)
        invitation_id = create_response.json()["invitation_id"]
        
        # Delete
        response = requests.delete(f"{BASE_URL}/api/leader-invitations/{invitation_id}")
        assert response.status_code == 200
        assert response.json()["message"] == "Inbjudan raderad"
        print(f"✓ DELETE /api/leader-invitations/{{id}} works correctly")
        
        # Verify deleted
        invitations = requests.get(f"{BASE_URL}/api/leader-invitations").json()
        assert not any(i["id"] == invitation_id for i in invitations)


class TestLeaderRegistrationEndpoints:
    """Test leader registration flow"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test data"""
        self.test_email = f"{TEST_PREFIX}{uuid.uuid4().hex[:8]}@test.com"
        self.test_name = f"{TEST_PREFIX}Leader Name"
        self.test_password = "TestPassword123!"
        yield
    
    def test_register_leader_with_valid_token(self):
        """POST /api/leaders/register/{token} - Registers leader with valid token"""
        # Create invitation
        invite_payload = {"name": self.test_name, "email": self.test_email}
        invite_response = requests.post(f"{BASE_URL}/api/leader-invitations", json=invite_payload)
        invitation_id = invite_response.json()["invitation_id"]
        
        # Get token
        invitations = requests.get(f"{BASE_URL}/api/leader-invitations").json()
        invitation = next((i for i in invitations if i["id"] == invitation_id), None)
        token = invitation["token"]
        
        # Register
        register_payload = {
            "name": self.test_name,
            "email": self.test_email,
            "phone": "+46701234567",
            "password": self.test_password,
            "bio_sv": "Test bio in Swedish",
            "bio_en": "Test bio in English",
            "role_sv": "Testledare",
            "role_en": "Test Leader",
            "topics_sv": ["Ledarskap", "Kommunikation"],
            "topics_en": ["Leadership", "Communication"],
            "cost_preference": "self",
            "arrival_date": "2026-03-01",
            "departure_date": "2026-03-05",
            "special_dietary": "Vegetarian",
            "other_needs": "",
            "bank_name": "Nordea",
            "bank_account": "1234567890",
            "bank_clearing": "1234",
            "bank_iban": "SE1234567890",
            "bank_swift": "NDEASESS"
        }
        
        response = requests.post(f"{BASE_URL}/api/leaders/register/{token}", json=register_payload)
        assert response.status_code == 200
        data = response.json()
        assert "leader_id" in data
        assert "Registrering genomförd" in data["message"]
        leader_id = data["leader_id"]
        print(f"✓ POST /api/leaders/register/{{token}} created registration: {leader_id}")
        
        # Verify invitation status changed
        invitations = requests.get(f"{BASE_URL}/api/leader-invitations").json()
        updated_invitation = next((i for i in invitations if i["id"] == invitation_id), None)
        assert updated_invitation["status"] == "registered"
        print(f"✓ Invitation status updated to 'registered'")
        
        # Verify registration exists
        registrations = requests.get(f"{BASE_URL}/api/leader-registrations").json()
        registration = next((r for r in registrations if r["id"] == leader_id), None)
        assert registration is not None
        assert registration["status"] == "pending"
        assert registration["email"] == self.test_email.lower()
        print(f"✓ Registration verified with status 'pending'")
        
        # Cleanup - delete registration and invitation
        # Note: We'll leave these for the approve/reject tests
        return leader_id, invitation_id
    
    def test_register_with_invalid_token(self):
        """POST /api/leaders/register/{token} - Fails with invalid token"""
        register_payload = {
            "name": "Test",
            "email": "test@test.com",
            "password": "password123"
        }
        
        response = requests.post(f"{BASE_URL}/api/leaders/register/invalid-token", json=register_payload)
        assert response.status_code == 404
        print(f"✓ Invalid token returns 404")
    
    def test_register_with_used_token(self):
        """POST /api/leaders/register/{token} - Fails with already used token"""
        # Create and use invitation
        invite_payload = {"name": self.test_name, "email": self.test_email}
        invite_response = requests.post(f"{BASE_URL}/api/leader-invitations", json=invite_payload)
        invitation_id = invite_response.json()["invitation_id"]
        
        invitations = requests.get(f"{BASE_URL}/api/leader-invitations").json()
        invitation = next((i for i in invitations if i["id"] == invitation_id), None)
        token = invitation["token"]
        
        # First registration
        register_payload = {
            "name": self.test_name,
            "email": self.test_email,
            "password": self.test_password
        }
        response1 = requests.post(f"{BASE_URL}/api/leaders/register/{token}", json=register_payload)
        assert response1.status_code == 200
        leader_id = response1.json()["leader_id"]
        
        # Try to use same token again
        new_email = f"{TEST_PREFIX}{uuid.uuid4().hex[:8]}@test.com"
        register_payload2 = {
            "name": "Another Leader",
            "email": new_email,
            "password": self.test_password
        }
        response2 = requests.post(f"{BASE_URL}/api/leaders/register/{token}", json=register_payload2)
        assert response2.status_code == 400
        assert "redan använts" in response2.json()["detail"]
        print(f"✓ Used token correctly rejected")
        
        # Cleanup
        # Delete registration from leader_registrations collection
        requests.delete(f"{BASE_URL}/api/leader-invitations/{invitation_id}")


class TestLeaderRegistrationApproval:
    """Test admin approval/rejection of registrations"""
    
    @pytest.fixture
    def create_pending_registration(self):
        """Create a pending registration for testing"""
        test_email = f"{TEST_PREFIX}{uuid.uuid4().hex[:8]}@test.com"
        test_name = f"{TEST_PREFIX}Approval Test"
        
        # Create invitation
        invite_response = requests.post(
            f"{BASE_URL}/api/leader-invitations",
            json={"name": test_name, "email": test_email}
        )
        invitation_id = invite_response.json()["invitation_id"]
        
        # Get token
        invitations = requests.get(f"{BASE_URL}/api/leader-invitations").json()
        invitation = next((i for i in invitations if i["id"] == invitation_id), None)
        token = invitation["token"]
        
        # Register
        register_response = requests.post(
            f"{BASE_URL}/api/leaders/register/{token}",
            json={
                "name": test_name,
                "email": test_email,
                "password": "TestPassword123!"
            }
        )
        leader_id = register_response.json()["leader_id"]
        
        yield {
            "leader_id": leader_id,
            "invitation_id": invitation_id,
            "email": test_email,
            "name": test_name
        }
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/leader-invitations/{invitation_id}")
    
    def test_get_leader_registrations(self):
        """GET /api/leader-registrations - Returns list of registrations"""
        response = requests.get(f"{BASE_URL}/api/leader-registrations")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/leader-registrations returns list with {len(data)} registrations")
    
    def test_get_leader_registrations_by_status(self):
        """GET /api/leader-registrations?status=pending - Filters by status"""
        response = requests.get(f"{BASE_URL}/api/leader-registrations?status=pending")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # All returned should be pending
        for reg in data:
            assert reg["status"] == "pending"
        print(f"✓ GET /api/leader-registrations?status=pending filters correctly")
    
    def test_approve_registration(self, create_pending_registration):
        """POST /api/leader-registrations/{id}/approve - Approves registration"""
        reg_data = create_pending_registration
        leader_id = reg_data["leader_id"]
        
        # Approve
        response = requests.post(f"{BASE_URL}/api/leader-registrations/{leader_id}/approve")
        assert response.status_code == 200
        assert "godkänts" in response.json()["message"]
        print(f"✓ POST /api/leader-registrations/{{id}}/approve works")
        
        # Verify status changed
        registrations = requests.get(f"{BASE_URL}/api/leader-registrations").json()
        registration = next((r for r in registrations if r["id"] == leader_id), None)
        assert registration["status"] == "approved"
        assert registration.get("approved_at") is not None
        print(f"✓ Registration status updated to 'approved'")
        
        # Verify leader added to leaders collection
        leaders = requests.get(f"{BASE_URL}/api/leaders?active_only=false").json()
        leader = next((l for l in leaders if l["id"] == leader_id), None)
        assert leader is not None
        # is_registered_leader may or may not be present depending on implementation
        print(f"✓ Leader added to leaders collection")
    
    def test_reject_registration(self, create_pending_registration):
        """POST /api/leader-registrations/{id}/reject - Rejects registration"""
        reg_data = create_pending_registration
        leader_id = reg_data["leader_id"]
        
        # Reject with reason
        response = requests.post(
            f"{BASE_URL}/api/leader-registrations/{leader_id}/reject?reason=Test%20rejection"
        )
        assert response.status_code == 200
        assert "avslagits" in response.json()["message"]
        print(f"✓ POST /api/leader-registrations/{{id}}/reject works")
        
        # Verify status changed
        registrations = requests.get(f"{BASE_URL}/api/leader-registrations").json()
        registration = next((r for r in registrations if r["id"] == leader_id), None)
        assert registration["status"] == "rejected"
        assert registration.get("admin_notes") == "Test rejection"
        print(f"✓ Registration status updated to 'rejected' with reason")


class TestLeaderLogin:
    """Test leader login functionality"""
    
    @pytest.fixture
    def create_approved_leader(self):
        """Create an approved leader for login testing"""
        test_email = f"{TEST_PREFIX}{uuid.uuid4().hex[:8]}@test.com"
        test_name = f"{TEST_PREFIX}Login Test"
        test_password = "TestPassword123!"
        
        # Create invitation
        invite_response = requests.post(
            f"{BASE_URL}/api/leader-invitations",
            json={"name": test_name, "email": test_email}
        )
        invitation_id = invite_response.json()["invitation_id"]
        
        # Get token
        invitations = requests.get(f"{BASE_URL}/api/leader-invitations").json()
        invitation = next((i for i in invitations if i["id"] == invitation_id), None)
        token = invitation["token"]
        
        # Register
        register_response = requests.post(
            f"{BASE_URL}/api/leaders/register/{token}",
            json={
                "name": test_name,
                "email": test_email,
                "password": test_password
            }
        )
        leader_id = register_response.json()["leader_id"]
        
        # Approve
        requests.post(f"{BASE_URL}/api/leader-registrations/{leader_id}/approve")
        
        yield {
            "leader_id": leader_id,
            "invitation_id": invitation_id,
            "email": test_email,
            "password": test_password,
            "name": test_name
        }
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/leader-invitations/{invitation_id}")
    
    def test_login_approved_leader(self, create_approved_leader):
        """POST /api/leaders/login - Login with approved leader"""
        leader_data = create_approved_leader
        
        response = requests.post(
            f"{BASE_URL}/api/leaders/login",
            json={
                "email": leader_data["email"],
                "password": leader_data["password"]
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert "leader" in data
        assert data["leader"]["email"] == leader_data["email"].lower()
        assert data["leader"]["name"] == leader_data["name"]
        print(f"✓ POST /api/leaders/login works for approved leader")
        
        return data["token"]
    
    def test_login_wrong_password(self, create_approved_leader):
        """POST /api/leaders/login - Fails with wrong password"""
        leader_data = create_approved_leader
        
        response = requests.post(
            f"{BASE_URL}/api/leaders/login",
            json={
                "email": leader_data["email"],
                "password": "WrongPassword123!"
            }
        )
        
        assert response.status_code == 401
        print(f"✓ Wrong password returns 401")
    
    def test_login_nonexistent_email(self):
        """POST /api/leaders/login - Fails with nonexistent email"""
        response = requests.post(
            f"{BASE_URL}/api/leaders/login",
            json={
                "email": "nonexistent@test.com",
                "password": "password123"
            }
        )
        
        assert response.status_code == 401
        print(f"✓ Nonexistent email returns 401")
    
    def test_login_pending_leader(self):
        """POST /api/leaders/login - Fails for pending (not approved) leader"""
        test_email = f"{TEST_PREFIX}{uuid.uuid4().hex[:8]}@test.com"
        test_password = "TestPassword123!"
        
        # Create invitation
        invite_response = requests.post(
            f"{BASE_URL}/api/leader-invitations",
            json={"name": "Pending Leader", "email": test_email}
        )
        invitation_id = invite_response.json()["invitation_id"]
        
        # Get token
        invitations = requests.get(f"{BASE_URL}/api/leader-invitations").json()
        invitation = next((i for i in invitations if i["id"] == invitation_id), None)
        token = invitation["token"]
        
        # Register but don't approve
        requests.post(
            f"{BASE_URL}/api/leaders/register/{token}",
            json={
                "name": "Pending Leader",
                "email": test_email,
                "password": test_password
            }
        )
        
        # Try to login
        response = requests.post(
            f"{BASE_URL}/api/leaders/login",
            json={"email": test_email, "password": test_password}
        )
        
        assert response.status_code == 403
        assert "väntar" in response.json()["detail"]
        print(f"✓ Pending leader login returns 403")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/leader-invitations/{invitation_id}")


class TestLeaderPortalEndpoints:
    """Test leader portal endpoints (authenticated)"""
    
    @pytest.fixture
    def authenticated_leader(self):
        """Create and login an approved leader"""
        test_email = f"{TEST_PREFIX}{uuid.uuid4().hex[:8]}@test.com"
        test_name = f"{TEST_PREFIX}Portal Test"
        test_password = "TestPassword123!"
        
        # Create invitation
        invite_response = requests.post(
            f"{BASE_URL}/api/leader-invitations",
            json={"name": test_name, "email": test_email}
        )
        invitation_id = invite_response.json()["invitation_id"]
        
        # Get token
        invitations = requests.get(f"{BASE_URL}/api/leader-invitations").json()
        invitation = next((i for i in invitations if i["id"] == invitation_id), None)
        token = invitation["token"]
        
        # Register
        register_response = requests.post(
            f"{BASE_URL}/api/leaders/register/{token}",
            json={
                "name": test_name,
                "email": test_email,
                "password": test_password,
                "phone": "+46701234567",
                "bio_sv": "Original bio"
            }
        )
        leader_id = register_response.json()["leader_id"]
        
        # Approve
        requests.post(f"{BASE_URL}/api/leader-registrations/{leader_id}/approve")
        
        # Login
        login_response = requests.post(
            f"{BASE_URL}/api/leaders/login",
            json={"email": test_email, "password": test_password}
        )
        auth_token = login_response.json()["token"]
        
        yield {
            "leader_id": leader_id,
            "invitation_id": invitation_id,
            "email": test_email,
            "token": auth_token,
            "name": test_name
        }
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/leader-invitations/{invitation_id}")
    
    def test_get_current_leader_profile(self, authenticated_leader):
        """GET /api/leaders/me - Returns current leader profile"""
        response = requests.get(
            f"{BASE_URL}/api/leaders/me",
            headers={"Authorization": f"Bearer {authenticated_leader['token']}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == authenticated_leader["email"].lower()
        assert data["name"] == authenticated_leader["name"]
        assert "password_hash" not in data  # Should not expose password
        print(f"✓ GET /api/leaders/me returns profile without password_hash")
    
    def test_get_current_leader_unauthorized(self):
        """GET /api/leaders/me - Fails without auth token"""
        response = requests.get(f"{BASE_URL}/api/leaders/me")
        # Should return 401 or 422 (validation error for missing header)
        assert response.status_code in [401, 422]
        print(f"✓ GET /api/leaders/me without token returns {response.status_code}")
    
    def test_update_leader_profile(self, authenticated_leader):
        """PUT /api/leaders/me - Updates leader profile"""
        update_data = {
            "phone": "+46709876543",
            "bio_sv": "Updated bio in Swedish",
            "bio_en": "Updated bio in English",
            "special_dietary": "Vegan"
        }
        
        response = requests.put(
            f"{BASE_URL}/api/leaders/me",
            headers={"Authorization": f"Bearer {authenticated_leader['token']}"},
            json=update_data
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["phone"] == "+46709876543"
        assert data["bio_sv"] == "Updated bio in Swedish"
        assert data["special_dietary"] == "Vegan"
        print(f"✓ PUT /api/leaders/me updates profile correctly")
    
    def test_get_leader_sessions(self, authenticated_leader):
        """GET /api/leaders/me/sessions - Returns leader's sessions"""
        response = requests.get(
            f"{BASE_URL}/api/leaders/me/sessions",
            headers={"Authorization": f"Bearer {authenticated_leader['token']}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/leaders/me/sessions returns list with {len(data)} sessions")


class TestFullLeaderFlow:
    """Test the complete leader invitation -> registration -> approval -> login flow"""
    
    def test_complete_leader_flow(self):
        """Test the entire leader flow from invitation to portal access"""
        test_email = f"{TEST_PREFIX}{uuid.uuid4().hex[:8]}@test.com"
        test_name = f"{TEST_PREFIX}Full Flow Test"
        test_password = "TestPassword123!"
        
        print("\n=== FULL LEADER FLOW TEST ===")
        
        # Step 1: Admin creates invitation
        print("\n1. Admin creates invitation...")
        invite_response = requests.post(
            f"{BASE_URL}/api/leader-invitations",
            json={
                "name": test_name,
                "email": test_email,
                "workshop_title": "Test Workshop 2026"
            }
        )
        assert invite_response.status_code == 200
        invitation_id = invite_response.json()["invitation_id"]
        print(f"   ✓ Invitation created: {invitation_id}")
        
        # Step 2: Get invitation token (simulating email link)
        print("\n2. Getting invitation token...")
        invitations = requests.get(f"{BASE_URL}/api/leader-invitations").json()
        invitation = next((i for i in invitations if i["id"] == invitation_id), None)
        token = invitation["token"]
        print(f"   ✓ Token retrieved: {token[:20]}...")
        
        # Step 3: Leader accesses registration form
        print("\n3. Leader accesses registration form...")
        form_response = requests.get(f"{BASE_URL}/api/leader-invitations/{token}")
        assert form_response.status_code == 200
        form_data = form_response.json()
        assert form_data["name"] == test_name
        assert form_data["workshop_title"] == "Test Workshop 2026"
        print(f"   ✓ Registration form loaded with pre-filled data")
        
        # Step 4: Leader submits registration
        print("\n4. Leader submits registration...")
        register_response = requests.post(
            f"{BASE_URL}/api/leaders/register/{token}",
            json={
                "name": test_name,
                "email": test_email,
                "phone": "+46701234567",
                "password": test_password,
                "bio_sv": "Jag är en erfaren ledare",
                "bio_en": "I am an experienced leader",
                "role_sv": "Pastor",
                "role_en": "Pastor",
                "topics_sv": ["Ledarskap", "Vision"],
                "topics_en": ["Leadership", "Vision"],
                "cost_preference": "haggai_support",
                "arrival_date": "2026-03-01",
                "departure_date": "2026-03-05",
                "bank_name": "Swedbank",
                "bank_account": "1234567890"
            }
        )
        assert register_response.status_code == 200
        leader_id = register_response.json()["leader_id"]
        print(f"   ✓ Registration submitted: {leader_id}")
        
        # Step 5: Verify registration appears in admin panel
        print("\n5. Verifying registration in admin panel...")
        registrations = requests.get(f"{BASE_URL}/api/leader-registrations?status=pending").json()
        registration = next((r for r in registrations if r["id"] == leader_id), None)
        assert registration is not None
        assert registration["status"] == "pending"
        assert registration["cost_preference"] == "haggai_support"
        print(f"   ✓ Registration visible in admin with status 'pending'")
        
        # Step 6: Admin approves registration
        print("\n6. Admin approves registration...")
        approve_response = requests.post(f"{BASE_URL}/api/leader-registrations/{leader_id}/approve")
        assert approve_response.status_code == 200
        print(f"   ✓ Registration approved")
        
        # Step 7: Leader logs in
        print("\n7. Leader logs in...")
        login_response = requests.post(
            f"{BASE_URL}/api/leaders/login",
            json={"email": test_email, "password": test_password}
        )
        assert login_response.status_code == 200
        auth_token = login_response.json()["token"]
        print(f"   ✓ Login successful, token received")
        
        # Step 8: Leader accesses portal
        print("\n8. Leader accesses portal...")
        profile_response = requests.get(
            f"{BASE_URL}/api/leaders/me",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert profile_response.status_code == 200
        profile = profile_response.json()
        assert profile["status"] == "approved"
        assert profile["name"] == test_name
        print(f"   ✓ Portal access successful, profile loaded")
        
        # Step 9: Leader updates profile
        print("\n9. Leader updates profile...")
        update_response = requests.put(
            f"{BASE_URL}/api/leaders/me",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"bio_sv": "Uppdaterad bio"}
        )
        assert update_response.status_code == 200
        assert update_response.json()["bio_sv"] == "Uppdaterad bio"
        print(f"   ✓ Profile updated successfully")
        
        # Step 10: Verify leader appears in public leaders list
        print("\n10. Verifying leader in public list...")
        leaders = requests.get(f"{BASE_URL}/api/leaders").json()
        leader = next((l for l in leaders if l["id"] == leader_id), None)
        assert leader is not None
        # is_registered_leader may or may not be present
        print(f"   ✓ Leader visible in public leaders list")
        
        print("\n=== FULL FLOW TEST COMPLETED SUCCESSFULLY ===\n")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/leader-invitations/{invitation_id}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
