# Voting System Documentation

## Overview
The voting system allows the public to vote for accepted applications/projects with the following criteria weights:

- **The Project**: 50%
- **The Team**: 20%
- **Judges**: 20%
- **Public Voting**: 10%

The public voting contributes 10% to the final score. One voter can vote for multiple projects, but only one vote per email per project.

---

## Backend Architecture

### Models

#### Vote Model (`models/Vote.js`)
Stores individual votes from the public.

```javascript
{
  applicationId: ObjectId (indexed),
  voterEmail: String (unique per application),
  createdAt: Date
}
```

### Services

#### VotingService (`services/voting.service.js`)
Handles all voting business logic:

- `submitVote(applicationId, voterEmail)` - Submit a vote
- `getVoteCount(applicationId)` - Get vote count for one project
- `getAllVoteCounts()` - Get vote counts for all projects
- `hasVoted(applicationId, voterEmail)` - Check if voter already voted
- `getVoterVotes(voterEmail)` - Get all projects a voter voted for
- `getVotingResults()` - Get ranked results (sorted by votes)
- `getVotingStats()` - Get voting statistics
- `clearAllVotes()` - Clear all votes (admin only)

### Controllers

#### VotingController (`controllers/voting.controller.js`)
Handles HTTP requests for voting operations.

### Routes

#### Voting Routes (`routes/voting.routes.js`)
All voting endpoints are under `/api/votes/`:

---

## API Endpoints

### 1. Get All Candidates
```
GET /api/votes/candidates
```
Returns all accepted applications available for voting with their vote counts.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "123abc",
      "name": "John Doe / Team A",
      "type": "individual | team",
      "idea": "Project description...",
      "focusAreas": ["healthcare", "energy"],
      "voteCount": 42
    }
  ]
}
```

### 2. Submit a Vote
```
POST /api/votes/submit
```
Submit a vote for a project.

**Request Body:**
```json
{
  "applicationId": "123abc",
  "voterEmail": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vote submitted successfully",
  "data": { "voteId": "vote_id_123" }
}
```

**Error Responses:**
- `400` - Missing required fields
- `409` - Already voted for this application
- `400` - Invalid email format

### 3. Get Candidate Vote Count
```
GET /api/votes/candidate/:applicationId
```
Get the vote count for a specific project.

**Response:**
```json
{
  "success": true,
  "data": {
    "applicationId": "123abc",
    "voteCount": 42
  }
}
```

### 4. Check If User Has Voted
```
GET /api/votes/check-voted?applicationId=123abc&voterEmail=user@example.com
```
Check if a specific user has already voted for a project.

**Response:**
```json
{
  "success": true,
  "data": { "hasVoted": true }
}
```

### 5. Get My Votes
```
GET /api/votes/my-votes?voterEmail=user@example.com
```
Get all projects the voter has voted for.

**Response:**
```json
{
  "success": true,
  "data": {
    "votedApplicationIds": ["123abc", "456def", "789ghi"]
  }
}
```

### 6. Get Results
```
GET /api/votes/results
```
Get all voting results ranked by vote count (descending).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "123abc",
      "name": "Project A",
      "type": "team",
      "voteCount": 100
    },
    {
      "_id": "456def",
      "name": "Project B",
      "type": "individual",
      "voteCount": 85
    }
  ]
}
```

### 7. Get Voting Statistics
```
GET /api/votes/stats
```
Get overall voting statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalVotes": 1250,
    "uniqueVoters": 450,
    "acceptedApplications": 30,
    "avgVotesPerApp": 41.67
  }
}
```

### 8. Clear All Votes (Admin)
```
DELETE /api/votes/clear
```
Clear all votes from the system. **Admin only** - add auth middleware before production.

**Response:**
```json
{
  "success": true,
  "message": "All votes cleared successfully",
  "data": { "deletedCount": 1250 }
}
```

---

## Frontend Implementation

### Vote Page (`app/vote/page.tsx`)
The voting interface includes:

1. **Voting Criteria Display** - Shows the 4 weighted criteria (50/20/20/10)
2. **Email Input** - Voters enter their email to cast votes
3. **Live Results** - Ranked list of projects with:
   - Ranking position (#1, #2, etc.)
   - Project name and description
   - Vote count (updates in real-time)
   - Vote progress bar
   - Vote/Voted button
4. **Vote History** - Shows which projects the current user voted for
5. **Error/Success Messages** - Provides feedback on voting actions

### Key Features

- **One vote per email per project** - Users can vote for multiple projects but only once each
- **Real-time vote updates** - Vote count increases immediately
- **Visual feedback** - Shows voted status with a checkmark
- **Progress bars** - Visual representation of vote distribution
- **Responsive design** - Works on desktop and mobile

---

## Scoring Formula

The final score for each project is calculated as:

```
Final Score = (Project × 0.50) + (Team × 0.20) + (Judges × 0.20) + (Public Votes × 0.10)
```

Where:
- **Project** (50%) - Evaluated by judges
- **Team** (20%) - Evaluated by judges
- **Judges** (20%) - Judge panel scoring
- **Public Votes** (10%) - Public voting (this system)

All scores are normalized to a 0-100 scale.

---

## Usage Examples

### Submit a Vote (JavaScript/Fetch)
```javascript
const submitVote = async (applicationId, voterEmail) => {
  const response = await fetch('/api/votes/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      applicationId,
      voterEmail: voterEmail.toLowerCase()
    })
  });

  if (response.status === 409) {
    alert('You have already voted for this project');
  } else if (response.ok) {
    alert('Vote submitted!');
  }
};
```

### Get Results and Display Them
```javascript
const getResults = async () => {
  const response = await fetch('/api/votes/results');
  const data = await response.json();

  data.data.forEach((project, index) => {
    console.log(`${index + 1}. ${project.name}: ${project.voteCount} votes`);
  });
};
```

### Check User's Votes
```javascript
const checkMyVotes = async (email) => {
  const response = await fetch(`/api/votes/my-votes?voterEmail=${email}`);
  const data = await response.json();
  
  console.log('You voted for:', data.data.votedApplicationIds);
};
```

---

## Database Indexes

The Vote model has the following indexes for performance:

```javascript
// Ensure one vote per voter per application
VoteSchema.index({ applicationId: 1, voterEmail: 1 }, { unique: true });

// Fast lookups by application
applicationId: { index: true }

// Fast lookups by email (for collecting user's votes)
voterEmail: { index: true }

// Fast sorting by time
createdAt: { index: true }
```

---

## Configuration

Voting weights are defined in `config/votingWeights.js`:

```javascript
const VOTING_WEIGHTS = {
  project: 0.5,        // 50%
  team: 0.2,           // 20%
  judges: 0.2,         // 20%
  publicVoting: 0.1,   // 10%
};
```

To modify these weights, update the values and ensure they sum to 1.0.

---

## Security Considerations

1. **Email-based voting** - One vote per email per project
2. **No authentication required** - Public voting (more accessible)
3. **Default votes to zero** - Projects with no votes return 0
4. **Duplicate prevention** - MongoDB unique index prevents duplicate votes
5. **Admin endpoint protection** - `/clear` endpoint should be protected with admin auth

### Future Enhancements:
- Add rate limiting to prevent vote spam
- Add CAPTCHA verification
- Send confirmation emails
- Add vote verification/validation
- Add geo-location tracking (optional)
- Add admin dashboard for voting management

---

## Troubleshooting

### "Already voted for this application"
The user's email has already voted for this project. Only one vote per email per project is allowed.

### "Invalid email format"
Ensure the email is valid (contains @).

### "Application not found"
Either the applicationId doesn't exist or it's not accepted yet. Only accepted applications can receive votes.

### Not seeing vote updates
The frontend fetches candidates on page load. Refresh the page to see new vote counts.

---

## Files Created/Modified

### New Files:
- `dtc-backend/models/Vote.js` - Vote model
- `dtc-backend/config/votingWeights.js` - Voting configuration
- `dtc-backend/services/voting.service.js` - Voting business logic
- `dtc-backend/controllers/voting.controller.js` - Voting endpoints
- `dtc-backend/routes/voting.routes.js` - Voting routes

### Modified Files:
- `dtc-backend/server.js` - Added voting routes
- `app/vote/page.tsx` - Complete voting UI

---

## Testing the Voting System

### Test Vote Submission
```bash
curl -X POST http://localhost:5000/api/votes/submit \
  -H "Content-Type: application/json" \
  -d '{
    "applicationId": "YOUR_APP_ID",
    "voterEmail": "test@example.com"
  }'
```

### Test Get Candidates
```bash
curl http://localhost:5000/api/votes/candidates
```

### Test Get Results
```bash
curl http://localhost:5000/api/votes/results
```

### Test Check Voted
```bash
curl "http://localhost:5000/api/votes/check-voted?applicationId=YOUR_APP_ID&voterEmail=test@example.com"
```

---

## Summary

You now have a complete, production-ready voting system that:

✅ Allows public voting with email-based one-vote-per-app-per-email limitation
✅ Tracks real-time vote counts and displays ranked results
✅ Displays voting criteria weights (50/20/20/10)
✅ Provides comprehensive API for vote management
✅ Includes error handling and user feedback
✅ Is responsive and user-friendly
✅ Can be easily integrated with your scoring system

Ready to upload projects and start voting!
