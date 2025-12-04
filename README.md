# DTC 2026 Backend API

Express.js + MongoDB backend for the Design Thinking Challenge 2026 application system.

## Architecture

This project follows the **Service-Controller-Route** pattern:

\`\`\`
src/
├── config/
│   ├── database.js      # MongoDB connection config
│   └── swagger.js       # Swagger/OpenAPI config
├── controllers/
│   ├── application.controller.js
│   └── stats.controller.js
├── middleware/
│   └── error.middleware.js
├── models/
│   └── Application.js   # Mongoose schema
├── routes/
│   ├── applications.js
│   └── stats.js
├── services/
│   ├── application.service.js
│   └── stats.service.js
└── server.js            # Entry point
\`\`\`

## Setup

1. Install dependencies:
   \`\`\`bash
   cd dtc-backend
   npm install
   \`\`\`

2. Create `.env` file:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

3. Update `.env` with your MongoDB connection string:
   \`\`\`
   # Local MongoDB
   MONGODB_URI=mongodb://localhost:27017/dtc2026
   
   # MongoDB Atlas (cloud)
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/dtc2026
   \`\`\`

4. Start the server:
   \`\`\`bash
   npm run dev   # Development with auto-reload
   npm start     # Production
   \`\`\`

## API Documentation (Swagger)

Once the server is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:3001/api/docs
- **OpenAPI JSON**: http://localhost:3001/api/docs.json

The Swagger UI allows you to explore and test all endpoints directly in your browser.

## API Endpoints

### Documentation

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/docs` | Swagger UI documentation |
| GET | `/api/docs.json` | OpenAPI specification JSON |

### Applications

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications/individual` | Submit individual application |
| POST | `/api/applications/team` | Submit team application |
| GET | `/api/applications` | List all applications (with filters) |
| GET | `/api/applications/:id` | Get single application |
| PATCH | `/api/applications/:id/status` | Update application status |
| DELETE | `/api/applications/:id` | Delete application |

### Stats

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats` | Get dashboard statistics |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

## Query Parameters

**GET /api/applications**
- `type` - Filter by type: `individual` or `team`
- `status` - Filter by status: `pending`, `reviewing`, `shortlisted`, `accepted`, `rejected`
- `focusArea` - Filter by focus area: `healthcare`, `energy`, `agriculture`
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `sort` - Sort field (default: `-submittedAt`)

## Example Requests

\`\`\`bash
# Submit individual application
curl -X POST http://localhost:3001/api/applications/individual \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+234801234567",
    "country": "Nigeria",
    "participantType": "software",
    "focusAreas": ["healthcare", "energy"],
    "experience": "5 years in software development",
    "motivation": "I want to solve real problems",
    "idea": "AI-powered diagnostic tool"
  }'

# Submit team application
curl -X POST http://localhost:3001/api/applications/team \
  -H "Content-Type: application/json" \
  -d '{
    "teamName": "HealthTech Innovators",
    "teamSize": 4,
    "teamMembers": [
      {"name": "Jane Doe", "email": "jane@example.com", "role": "CTO"},
      {"name": "Bob Smith", "email": "bob@example.com", "role": "Designer"}
    ],
    "leadName": "Jane Doe",
    "leadEmail": "jane@example.com",
    "focusAreas": ["healthcare"],
    "motivation": "Improving rural healthcare access",
    "idea": "Mobile telemedicine platform"
  }'

# Get applications with filters
curl "http://localhost:3001/api/applications?type=individual&status=pending&page=1&limit=10"

# Update status
curl -X PATCH http://localhost:3001/api/applications/APPID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "shortlisted", "notes": "Strong technical background"}'

# Get statistics
curl http://localhost:3001/api/stats
\`\`\`

## Frontend Integration

Update your Next.js frontend to point to this backend:

\`\`\`javascript
// In your frontend API route or directly in components
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const response = await fetch(`${API_URL}/api/applications/individual`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
