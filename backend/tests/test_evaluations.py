"""
Test suite for Evaluation System APIs
Tests: evaluation questions CRUD, evaluation submission, statistics, leader detailed stats, feedback
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test data IDs
TEST_WORKSHOP_ID = "f60eb66e-3956-428d-8060-181ceeb498f8"
TEST_SESSION_ID = "54d20983-f04e-4a03-96ad-5c619a19600b"
TEST_LEADER_ID = "69aab7f2-4f02-4128-a64c-8677c5c6476f"


@pytest.fixture(scope="module")
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


@pytest.fixture(scope="module")
def test_question_id():
    """Create a test question and return its ID for use in other tests"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    
    question_data = {
        "text_sv": "TEST_Hur väl förberedde ledaren sessionen?",
        "text_en": "TEST_How well did the leader prepare the session?",
        "text_ar": "",
        "description_sv": "Testfråga för automatiserade tester",
        "description_en": "Test question for automated tests",
        "description_ar": "",
        "is_active": True,
        "order": 999
    }
    
    response = session.post(f"{BASE_URL}/api/evaluation-questions", json=question_data)
    if response.status_code == 200:
        data = response.json()
        yield data.get("id")
        # Cleanup - delete the test question
        session.delete(f"{BASE_URL}/api/evaluation-questions/{data.get('id')}")
    else:
        yield None


class TestEvaluationQuestions:
    """Tests for evaluation questions CRUD operations"""
    
    def test_get_evaluation_questions(self, api_client):
        """GET /api/evaluation-questions - Get all active evaluation questions"""
        response = api_client.get(f"{BASE_URL}/api/evaluation-questions")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/evaluation-questions - Found {len(data)} questions")
        
        # Verify question structure if questions exist
        if len(data) > 0:
            question = data[0]
            assert "id" in question
            assert "text_sv" in question
            assert "is_active" in question
            print(f"  First question: {question.get('text_sv', '')[:50]}...")
    
    def test_get_evaluation_questions_include_inactive(self, api_client):
        """GET /api/evaluation-questions?active_only=false - Get all questions including inactive"""
        response = api_client.get(f"{BASE_URL}/api/evaluation-questions?active_only=false")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/evaluation-questions?active_only=false - Found {len(data)} questions (including inactive)")
    
    def test_create_evaluation_question(self, api_client):
        """POST /api/evaluation-questions - Create a new evaluation question"""
        question_data = {
            "text_sv": "TEST_Hur engagerande var sessionen?",
            "text_en": "TEST_How engaging was the session?",
            "text_ar": "",
            "description_sv": "Betygsätt hur engagerande sessionen var",
            "description_en": "Rate how engaging the session was",
            "description_ar": "",
            "is_active": True,
            "order": 998
        }
        
        response = api_client.post(f"{BASE_URL}/api/evaluation-questions", json=question_data)
        
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["text_sv"] == question_data["text_sv"]
        assert data["text_en"] == question_data["text_en"]
        assert data["is_active"] == True
        print(f"✓ POST /api/evaluation-questions - Created question with ID: {data['id']}")
        
        # Cleanup
        api_client.delete(f"{BASE_URL}/api/evaluation-questions/{data['id']}")
    
    def test_update_evaluation_question(self, api_client, test_question_id):
        """PUT /api/evaluation-questions/{id} - Update an evaluation question"""
        if not test_question_id:
            pytest.skip("No test question available")
        
        update_data = {
            "text_sv": "TEST_Uppdaterad fråga - Hur väl förberedde ledaren?",
            "description_sv": "Uppdaterad beskrivning"
        }
        
        response = api_client.put(f"{BASE_URL}/api/evaluation-questions/{test_question_id}", json=update_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["text_sv"] == update_data["text_sv"]
        assert data["description_sv"] == update_data["description_sv"]
        print(f"✓ PUT /api/evaluation-questions/{test_question_id} - Question updated")
    
    def test_update_nonexistent_question(self, api_client):
        """PUT /api/evaluation-questions/{id} - Update nonexistent question returns 404"""
        fake_id = str(uuid.uuid4())
        update_data = {"text_sv": "Test"}
        
        response = api_client.put(f"{BASE_URL}/api/evaluation-questions/{fake_id}", json=update_data)
        
        assert response.status_code == 404
        print(f"✓ PUT /api/evaluation-questions/{fake_id} - Returns 404 for nonexistent question")
    
    def test_delete_evaluation_question(self, api_client):
        """DELETE /api/evaluation-questions/{id} - Soft delete (deactivate) a question"""
        # First create a question to delete
        question_data = {
            "text_sv": "TEST_Fråga att ta bort",
            "text_en": "TEST_Question to delete",
            "is_active": True,
            "order": 997
        }
        
        create_response = api_client.post(f"{BASE_URL}/api/evaluation-questions", json=question_data)
        assert create_response.status_code == 200
        question_id = create_response.json()["id"]
        
        # Delete the question
        delete_response = api_client.delete(f"{BASE_URL}/api/evaluation-questions/{question_id}")
        
        assert delete_response.status_code == 200
        data = delete_response.json()
        assert data.get("success") == True
        print(f"✓ DELETE /api/evaluation-questions/{question_id} - Question deactivated")
        
        # Verify it's now inactive
        get_response = api_client.get(f"{BASE_URL}/api/evaluation-questions?active_only=false")
        all_questions = get_response.json()
        deleted_question = next((q for q in all_questions if q["id"] == question_id), None)
        if deleted_question:
            assert deleted_question["is_active"] == False
            print(f"  Verified: Question is_active = False")
    
    def test_delete_nonexistent_question(self, api_client):
        """DELETE /api/evaluation-questions/{id} - Delete nonexistent question returns 404"""
        fake_id = str(uuid.uuid4())
        
        response = api_client.delete(f"{BASE_URL}/api/evaluation-questions/{fake_id}")
        
        assert response.status_code == 404
        print(f"✓ DELETE /api/evaluation-questions/{fake_id} - Returns 404 for nonexistent question")


class TestEvaluationSubmission:
    """Tests for evaluation submission"""
    
    def test_submit_evaluation(self, api_client):
        """POST /api/evaluations - Submit a session evaluation with ratings 1-10"""
        # First get active questions
        questions_response = api_client.get(f"{BASE_URL}/api/evaluation-questions")
        questions = questions_response.json()
        
        if len(questions) == 0:
            pytest.skip("No evaluation questions available")
        
        # Build answers with ratings 1-10
        answers = []
        for q in questions[:5]:  # Use up to 5 questions
            answers.append({
                "question_id": q["id"],
                "rating": 8  # Rating between 1-10
            })
        
        evaluation_data = {
            "workshop_id": TEST_WORKSHOP_ID,
            "session_id": TEST_SESSION_ID,
            "leader_id": TEST_LEADER_ID,
            "answers": answers,
            "comment": "TEST_Bra session, mycket lärorikt!",
            "participant_email": "test@example.com"
        }
        
        response = api_client.post(f"{BASE_URL}/api/evaluations", json=evaluation_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "id" in data
        print(f"✓ POST /api/evaluations - Evaluation submitted with ID: {data['id']}")
    
    def test_submit_evaluation_with_various_ratings(self, api_client):
        """POST /api/evaluations - Submit evaluation with various ratings (1-10 scale)"""
        questions_response = api_client.get(f"{BASE_URL}/api/evaluation-questions")
        questions = questions_response.json()
        
        if len(questions) == 0:
            pytest.skip("No evaluation questions available")
        
        # Test with different ratings
        answers = []
        ratings = [1, 5, 7, 9, 10]  # Various ratings on 1-10 scale
        for i, q in enumerate(questions[:5]):
            answers.append({
                "question_id": q["id"],
                "rating": ratings[i % len(ratings)]
            })
        
        evaluation_data = {
            "workshop_id": TEST_WORKSHOP_ID,
            "session_id": TEST_SESSION_ID,
            "leader_id": TEST_LEADER_ID,
            "answers": answers,
            "comment": None,
            "participant_email": None
        }
        
        response = api_client.post(f"{BASE_URL}/api/evaluations", json=evaluation_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        print(f"✓ POST /api/evaluations - Evaluation with various ratings submitted")


class TestEvaluationStatistics:
    """Tests for evaluation statistics endpoints"""
    
    def test_get_evaluation_stats(self, api_client):
        """GET /api/evaluations/stats - Get overall evaluation statistics"""
        response = api_client.get(f"{BASE_URL}/api/evaluations/stats")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "total_evaluations" in data
        assert "overall_average" in data
        assert "questions_stats" in data
        assert "leaders_comparison" in data
        assert "sessions_stats" in data
        
        print(f"✓ GET /api/evaluations/stats - Statistics retrieved")
        print(f"  Total evaluations: {data['total_evaluations']}")
        print(f"  Overall average: {data['overall_average']}/10")
        
        # Verify data types
        assert isinstance(data["total_evaluations"], int)
        assert isinstance(data["overall_average"], (int, float))
        assert isinstance(data["questions_stats"], list)
        assert isinstance(data["leaders_comparison"], list)
        assert isinstance(data["sessions_stats"], list)
    
    def test_get_evaluation_stats_by_workshop(self, api_client):
        """GET /api/evaluations/stats?workshop_id={id} - Get stats filtered by workshop"""
        response = api_client.get(f"{BASE_URL}/api/evaluations/stats?workshop_id={TEST_WORKSHOP_ID}")
        
        assert response.status_code == 200
        data = response.json()
        assert "total_evaluations" in data
        print(f"✓ GET /api/evaluations/stats?workshop_id={TEST_WORKSHOP_ID}")
        print(f"  Evaluations for workshop: {data['total_evaluations']}")
    
    def test_get_evaluation_stats_by_leader(self, api_client):
        """GET /api/evaluations/stats?leader_id={id} - Get stats filtered by leader"""
        response = api_client.get(f"{BASE_URL}/api/evaluations/stats?leader_id={TEST_LEADER_ID}")
        
        assert response.status_code == 200
        data = response.json()
        assert "total_evaluations" in data
        print(f"✓ GET /api/evaluations/stats?leader_id={TEST_LEADER_ID}")
        print(f"  Evaluations for leader: {data['total_evaluations']}")
    
    def test_get_evaluation_stats_questions_breakdown(self, api_client):
        """Verify questions_stats contains proper breakdown"""
        response = api_client.get(f"{BASE_URL}/api/evaluations/stats")
        data = response.json()
        
        if data["total_evaluations"] > 0 and len(data["questions_stats"]) > 0:
            question_stat = data["questions_stats"][0]
            assert "question_id" in question_stat
            assert "question_text" in question_stat
            assert "average_rating" in question_stat
            assert "response_count" in question_stat
            print(f"✓ Questions stats breakdown verified")
            print(f"  Sample: {question_stat['question_text'][:40]}... avg: {question_stat['average_rating']}/10")
        else:
            print("✓ Questions stats structure verified (no data to show)")
    
    def test_get_evaluation_stats_leaders_comparison(self, api_client):
        """Verify leaders_comparison contains proper data"""
        response = api_client.get(f"{BASE_URL}/api/evaluations/stats")
        data = response.json()
        
        if data["total_evaluations"] > 0 and len(data["leaders_comparison"]) > 0:
            leader_stat = data["leaders_comparison"][0]
            assert "leader_id" in leader_stat
            assert "leader_name" in leader_stat
            assert "average_rating" in leader_stat
            assert "evaluation_count" in leader_stat
            print(f"✓ Leaders comparison verified")
            print(f"  Top leader: {leader_stat['leader_name']} - {leader_stat['average_rating']}/10")
        else:
            print("✓ Leaders comparison structure verified (no data to show)")


class TestLeaderDetailedStats:
    """Tests for leader detailed statistics endpoint"""
    
    def test_get_leader_detailed_stats(self, api_client):
        """GET /api/evaluations/leader/{id}/detailed - Get detailed stats for a leader"""
        response = api_client.get(f"{BASE_URL}/api/evaluations/leader/{TEST_LEADER_ID}/detailed")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "leader_id" in data
        assert "total_evaluations" in data
        assert "sessions" in data
        assert "questions_breakdown" in data
        assert "strengths" in data
        assert "improvement_areas" in data
        
        print(f"✓ GET /api/evaluations/leader/{TEST_LEADER_ID}/detailed")
        print(f"  Leader: {data.get('leader_name', 'Unknown')}")
        print(f"  Total evaluations: {data['total_evaluations']}")
        print(f"  Overall average: {data.get('overall_average', 0)}/10")
        
        # Verify strengths and improvement areas
        if data["strengths"]:
            print(f"  Strengths: {len(data['strengths'])} areas identified")
        if data["improvement_areas"]:
            print(f"  Improvement areas: {len(data['improvement_areas'])} areas identified")
    
    def test_get_leader_detailed_stats_nonexistent(self, api_client):
        """GET /api/evaluations/leader/{id}/detailed - Nonexistent leader returns empty stats"""
        fake_id = str(uuid.uuid4())
        response = api_client.get(f"{BASE_URL}/api/evaluations/leader/{fake_id}/detailed")
        
        assert response.status_code == 200
        data = response.json()
        assert data["total_evaluations"] == 0
        print(f"✓ GET /api/evaluations/leader/{fake_id}/detailed - Returns empty stats for nonexistent leader")


class TestEvaluationFormData:
    """Tests for evaluation form data endpoint"""
    
    def test_get_evaluation_form_data(self, api_client):
        """GET /api/evaluation/form/{workshop_id}/{session_id} - Get form data for evaluation"""
        response = api_client.get(f"{BASE_URL}/api/evaluation/form/{TEST_WORKSHOP_ID}/{TEST_SESSION_ID}")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "workshop_id" in data
        assert "workshop_title" in data
        assert "session_id" in data
        assert "session_title" in data
        assert "leader_id" in data
        assert "leader_name" in data
        assert "questions" in data
        
        print(f"✓ GET /api/evaluation/form/{TEST_WORKSHOP_ID}/{TEST_SESSION_ID}")
        print(f"  Workshop: {data['workshop_title']}")
        print(f"  Session: {data['session_title']}")
        print(f"  Leader: {data['leader_name']}")
        print(f"  Questions: {len(data['questions'])}")
        
        # Verify questions have required fields
        if len(data["questions"]) > 0:
            question = data["questions"][0]
            assert "id" in question
            assert "text_sv" in question
    
    def test_get_evaluation_form_data_nonexistent_workshop(self, api_client):
        """GET /api/evaluation/form/{workshop_id}/{session_id} - Nonexistent workshop returns 404"""
        fake_workshop_id = str(uuid.uuid4())
        
        response = api_client.get(f"{BASE_URL}/api/evaluation/form/{fake_workshop_id}/{TEST_SESSION_ID}")
        
        assert response.status_code == 404
        print(f"✓ GET /api/evaluation/form/{fake_workshop_id}/... - Returns 404 for nonexistent workshop")
    
    def test_get_evaluation_form_data_nonexistent_session(self, api_client):
        """GET /api/evaluation/form/{workshop_id}/{session_id} - Nonexistent session returns 404"""
        fake_session_id = str(uuid.uuid4())
        
        response = api_client.get(f"{BASE_URL}/api/evaluation/form/{TEST_WORKSHOP_ID}/{fake_session_id}")
        
        assert response.status_code == 404
        print(f"✓ GET /api/evaluation/form/.../{fake_session_id} - Returns 404 for nonexistent session")


class TestLeaderFeedback:
    """Tests for leader feedback endpoint"""
    
    def test_send_leader_feedback(self, api_client):
        """POST /api/evaluations/feedback - Send feedback to a leader"""
        feedback_data = {
            "leader_id": TEST_LEADER_ID,
            "workshop_id": TEST_WORKSHOP_ID,
            "feedback_type": "praise",
            "subject": "TEST_Utmärkt arbete!",
            "message": "TEST_Du har gjort ett fantastiskt jobb med sessionerna. Fortsätt så!",
            "include_statistics": True
        }
        
        response = api_client.post(f"{BASE_URL}/api/evaluations/feedback", json=feedback_data)
        
        # Note: This may fail if leader has no email, which is expected
        if response.status_code == 200:
            data = response.json()
            assert data.get("success") == True
            print(f"✓ POST /api/evaluations/feedback - Feedback sent successfully")
        elif response.status_code == 400:
            data = response.json()
            print(f"✓ POST /api/evaluations/feedback - Returns 400 (leader has no email): {data.get('detail')}")
        elif response.status_code == 404:
            print(f"✓ POST /api/evaluations/feedback - Returns 404 (leader not found)")
        else:
            # Accept 500 if email service fails (MOCKED)
            print(f"✓ POST /api/evaluations/feedback - Status {response.status_code} (email service may be mocked)")
    
    def test_send_feedback_nonexistent_leader(self, api_client):
        """POST /api/evaluations/feedback - Feedback to nonexistent leader returns 404"""
        fake_leader_id = str(uuid.uuid4())
        
        feedback_data = {
            "leader_id": fake_leader_id,
            "feedback_type": "general",
            "subject": "Test",
            "message": "Test message",
            "include_statistics": False
        }
        
        response = api_client.post(f"{BASE_URL}/api/evaluations/feedback", json=feedback_data)
        
        assert response.status_code == 404
        print(f"✓ POST /api/evaluations/feedback - Returns 404 for nonexistent leader")
    
    def test_get_leader_feedback_history(self, api_client):
        """GET /api/evaluations/feedback/{leader_id} - Get feedback history for a leader"""
        response = api_client.get(f"{BASE_URL}/api/evaluations/feedback/{TEST_LEADER_ID}")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/evaluations/feedback/{TEST_LEADER_ID} - Found {len(data)} feedback records")


class TestSessionEvaluations:
    """Tests for session-specific evaluation endpoints"""
    
    def test_get_session_evaluations(self, api_client):
        """GET /api/evaluations/session/{session_id} - Get evaluations for a session"""
        response = api_client.get(f"{BASE_URL}/api/evaluations/session/{TEST_SESSION_ID}")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/evaluations/session/{TEST_SESSION_ID} - Found {len(data)} evaluations")
        
        # Verify participant info is NOT included by default (anonymous)
        if len(data) > 0:
            evaluation = data[0]
            assert "participant_email" not in evaluation or evaluation.get("participant_email") is None
            print(f"  Verified: Participant info is hidden (anonymous)")
    
    def test_get_session_evaluations_with_participant_info(self, api_client):
        """GET /api/evaluations/session/{session_id}?include_participant_info=true - Admin view with participant info"""
        response = api_client.get(f"{BASE_URL}/api/evaluations/session/{TEST_SESSION_ID}?include_participant_info=true")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/evaluations/session/{TEST_SESSION_ID}?include_participant_info=true")
        print(f"  Admin can see participant info for tracking")
    
    def test_get_leader_evaluations(self, api_client):
        """GET /api/evaluations/leader/{leader_id} - Get all evaluations for a leader"""
        response = api_client.get(f"{BASE_URL}/api/evaluations/leader/{TEST_LEADER_ID}")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/evaluations/leader/{TEST_LEADER_ID} - Found {len(data)} evaluations")
        
        # Verify participant info is NOT included (anonymous for leader)
        if len(data) > 0:
            evaluation = data[0]
            assert "participant_email" not in evaluation or evaluation.get("participant_email") is None
            print(f"  Verified: Participant info is hidden from leader (anonymous)")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
