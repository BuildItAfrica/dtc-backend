# Admin Voting Management System

## Overview

The Admin Voting Management system allows administrators to:
- **Review applications** submitted by participants
- **Accept applications** to be included in public voting
- **Reject or shortlist** applications for further review
- **Manage voting projects** - control which projects are available for voting
- **Monitor voting statistics** in real-time
- **Control the voting process** - when projects become available

---

## Workflow

### Step 1: Applications Submitted
Participants submit applications individually or as teams through the `/apply` page.

### Step 2: Admin Reviews Applications
Admin logs in and reviews all submitted applications:
- Filter by status (pending, reviewing, shortlisted, accepted, rejected)
- Search by name or project idea
- View application details

### Step 3: Admin Accepts Projects for Voting
Once an application is approved:
1. Admin clicks "Accept" on the application
2. Application status changes to "accepted"
3. Project automatically becomes available for public voting
4. Project appears in the voting system

### Step 4: Public Voting
Public voters can now:
- See the accepted projects
- Vote for their favorite projects
- Votes are counted in real-time

### Step 5: Monitor Results
Admin can:
- View live voting results
- See vote counts for each project
- View voting statistics
- Identify top projects by public vote

---

## Admin Dashboard Access

### Login
```
URL: http://localhost:3000/admin/login
```

Admin token is stored in localStorage after login.

### Dashboard Pages
```
URL: http://localhost:3000/admin/voting
```

---

## Admin Dashboard Tabs

### 1. All Projects Tab
**Purpose:** Review and manage all submitted applications

**Features:**
- View all applications with their status
- Filter by status: Pending, Reviewing, Shortlisted, Accepted, Rejected
- Search by name or idea
- Pagination (10 per page)
- One-click actions:
  - **Accept**: Mark project for voting (status → accepted)
  - **Shortlist**: Mark for further review (status → shortlisted)
  - **Reject**: Remove from consideration (status → rejected)

**Application Card Shows:**
- Project/Team name
- Current status (color-coded)
- Project idea/description
- Focus areas (healthcare, energy, agriculture)
- Project type (individual/team)
- Submission date

### 2. Voting Projects Tab
**Purpose:** See all projects currently available for voting

**Features:**
- Lists only "accepted" applications
- Shows live vote count for each project
- Ranked by submission date (newest first)
- Real-time vote updates
- Quick overview of voting participation

### 3. Statistics Tab
**Purpose:** Monitor overall voting progress

**Metrics Displayed:**
- **Total Votes**: Total votes cast across all projects
- **Unique Voters**: Number of unique email addresses that voted
- **Accepted Projects**: Number of projects available for voting
- **Avg Votes/Project**: Average votes per project
- **Application Status Breakdown**: Pie chart of statuses
  - Total applications
  - Pending
  - Shortlisted
  - Accepted (in voting)
  - Rejected

---

## API Endpoints (Admin Protected)

All admin endpoints require Bearer token authentication:
```
Authorization: Bearer <admin_token>
```

### Get All Applications
```
GET /api/votes/admin/projects
```

**Query Parameters:**
- `status` - Filter by status (pending, reviewing, shortlisted, accepted, rejected)
- `focusArea` - Filter by focus area (healthcare, energy, agriculture)
- `search` - Search by name or idea
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "123abc",
      "type": "individual",
      "fullName": "John Doe",
      "idea": "AI telemedicine platform",
      "focusAreas": ["healthcare"],
      "status": "pending",
      "createdAt": "2026-02-20T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

### Accept Project for Voting
```
PATCH /api/votes/admin/projects/:applicationId/accept
```

**Response:**
```json
{
  "success": true,
  "message": "Application marked as accepted for voting",
  "data": {
    "_id": "123abc",
    "type": "individual",
    "fullName": "John Doe",
    "status": "accepted"
  }
}
```

### Shortlist Project
```
PATCH /api/votes/admin/projects/:applicationId/shortlist
```

**Response:**
```json
{
  "success": true,
  "message": "Application marked as shortlisted",
  "data": {
    "_id": "123abc",
    "status": "shortlisted"
  }
}
```

### Reject Project
```
PATCH /api/votes/admin/projects/:applicationId/reject
```

**Response:**
```json
{
  "success": true,
  "message": "Application marked as rejected",
  "data": {
    "_id": "123abc",
    "status": "rejected"
  }
}
```

### Get Voting Projects
```
GET /api/votes/admin/voting-projects
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "123abc",
      "type": "individual",
      "fullName": "John Doe",
      "idea": "AI telemedicine platform",
      "focusAreas": ["healthcare"],
      "status": "accepted",
      "voteCount": 42
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "pages": 2
  }
}
```

### Get Admin Statistics
```
GET /api/votes/admin/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalVotes": 1250,
    "uniqueVoters": 450,
    "acceptedApplications": 15,
    "avgVotesPerApp": 83.33,
    "applications": {
      "total": 120,
      "accepted": 15,
      "shortlisted": 25,
      "rejected": 40,
      "pending": 40
    }
  }
}
```

---

## User Experience Flow

### Admin Workflow Example

1. **Admin logs in** to admin dashboard
   - URL: `/admin/voting`

2. **Reviews applications** in "All Projects" tab
   - Sees 120 total applications
   - Filters by "pending" status (40 pending)
   - Searches for "telemedicine"
   - Finds 3 matching applications

3. **Accepts top projects**
   - Clicks "Accept" on 15 promising projects
   - Status changes from pending → accepted
   - Projects now available for voting

4. **Monitors voting** in "Voting Projects" tab
   - Sees 15 projects now available
   - Sees live vote counts updating
   - Top project has 150 votes so far
   - Bottom project has 12 votes

5. **Checks statistics** in "Statistics" tab
   - Total votes cast: 1,250
   - Unique voters: 450
   - Average votes per project: 83.33
   - Application breakdown visible

---

## Application Status Flow

```
┌─────────┐
│ PENDING │  ← Application just submitted
└────┬────┘
     │
     ├──→ SHORTLISTED (Admin wants to review further)
     │         │
     │         ├──→ ACCEPTED (Ready for voting)
     │         │
     │         └──→ REJECTED (Not suitable)
     │
     └──→ ACCEPTED (Approved directly) OR REJECTED (Not suitable)
```

**Status Meanings:**
- **Pending**: Application submitted, awaiting review
- **Shortlisted**: Admin selected for further consideration
- **Accepted**: Approved for public voting (appears in voting system)
- **Rejected**: Not approved (hidden from public voting)
- **Reviewing**: (Optional) Currently being evaluated

---

## Real-Time Voting Monitoring

### Vote Count Updates
- Vote counts update in real-time as people vote
- Admin can refresh the "Voting Projects" tab to see latest counts
- Statistics update live as votes are cast

### Vote Data Available
```json
{
  "projectId": "123abc",
  "projectName": "AI Telemedicine",
  "currentVotes": 150,
  "rank": 1,
  "percentageOfTotal": 12.0
}
```

---

## Best Practices

### For Admin
1. **Review thoroughly** - Check application details before accepting
2. **Use search/filter** - Find applications related to specific focus areas
3. **Monitor voting** - Check voting progress regularly
4. **Balance projects** - Try to accept diverse projects across focus areas
5. **Clear criteria** - Use consistent standards when accepting projects

### Project Acceptance
- **Minimum projects**: At least 10 for meaningful public voting
- **Maximum projects**: 30-50 is ideal for voter engagement
- **Quality focus**: Only accept best projects, not all submitted ones

### Voting Timeline
1. Accept projects at least 1-2 days before public voting starts
2. Open voting for 3-5 days minimum
3. Monitor voting daily for patterns
4. Close voting and calculate final scores

---

## Error Handling

### Common Errors

**401 Unauthorized**
- Admin token expired
- Not logged in
- Invalid token
- Solution: Log in again at `/admin/login`

**404 Not Found**
- Application/project ID doesn't exist
- Status: Project might have been deleted
- Solution: Refresh page and try again

**Duplicate Vote (409)**
- This is a public voter issue, not admin issue
- Shows user already voted for that project
- Solution: For admin, use `/clear` endpoint to reset votes if needed

### Troubleshooting

**Projects not appearing in voting tab:**
- Check if project status is "accepted"
- Refresh page (browser cache)
- Check database directly

**Vote counts not updating:**
- Refresh page
- Check network tab for API calls
- Verify projects are in "accepted" status

**Admin dashboard loading slowly:**
- Reduce filters/searches
- Use pagination
- Check database performance

---

## Advanced Admin Features

### Bulk Actions (Future)
- Accept multiple projects at once
- Mass reject applications
- Export voting results

### Vote Analytics (Future)
- Vote trends over time
- Voter demographics
- Project comparison charts
- Voting patterns

### Project Management (Future)
- Create custom projects
- Upload project descriptions
- Add external judges
- Manual score injection

---

## Security

### Token Management
- Admin token stored in localStorage
- Token includes admin ID and permissions
- Token expiration: Check backend config
- Logout clears token from localStorage

### Protected Routes
- All `/api/votes/admin/*` routes require Bearer token
- Middleware validates token and admin status
- Invalid tokens return 401 Unauthorized

### Best Practices
1. Don't share admin token
2. Log out when done
3. Use strong admin password
4. Rotate credentials periodically
5. Audit admin actions in logs

---

## Database Schema

### Application Status Flow
```javascript
{
  _id: ObjectId,
  type: 'individual' | 'team',
  fullName: String,      // if individual
  teamName: String,      // if team
  idea: String,
  focusAreas: [String],
  status: 'pending' | 'reviewing' | 'shortlisted' | 'accepted' | 'rejected',
  createdAt: Date,
  ... // other fields
}
```

### Vote Records
```javascript
{
  _id: ObjectId,
  applicationId: ObjectId,  // ref to Application
  voterEmail: String,
  createdAt: Date
}
```

---

## API Examples

### Accept Project for Voting (cURL)
```bash
curl -X PATCH http://localhost:5000/api/votes/admin/projects/123abc/accept \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

### Get Voting Projects (cURL)
```bash
curl http://localhost:5000/api/votes/admin/voting-projects \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Get Statistics (JavaScript)
```javascript
const getStats = async (adminToken) => {
  const response = await fetch('/api/votes/admin/stats', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const data = await response.json();
  console.log(data.data);
};
```

---

## Summary

The Admin Voting Management system provides a complete interface for:

✅ Reviewing applications before voting
✅ Accepting projects for public voting
✅ Managing the voting process
✅ Monitoring voting statistics in real-time
✅ Controlling which projects are visible to voters
✅ Accessing voting results and analytics

**Quick Start:**
1. Go to `/admin/voting`
2. Login with admin credentials
3. Review applications in "All Projects"
4. Click "Accept" on projects you want for voting
5. Monitor voting in "Voting Projects"
6. Check stats in "Statistics"

That's it! Your voting system is now fully operational with admin control.
