# Claude AI Certification Platform - Complete Project Structure

## 📁 Project Files & Directories

### Root Configuration Files
```
claude-certification-platform/
├── .env.local                 # Environment variables (NEVER commit!)
├── .env.local.example         # Template for env vars
├── .gitignore                 # Git ignore rules
├── package.json               # NPM dependencies
├── next.config.js             # Next.js configuration
├── vercel.json                # Vercel deployment config
├── tsconfig.json              # TypeScript config (optional)
└── README.md                  # This file
```

### Page Files (Next.js Routes)
```
pages/
├── index.js                   # Student dashboard (/)
├── login.js                   # Login page (/login)
├── register.js                # Registration page (/register)
├── lesson/
│   └── [id].js               # Dynamic lesson page (/lesson/:id)
├── submit-capstone.js         # Capstone submission (/submit-capstone)
└── api/
    ├── auth/
    │   ├── register.js       # POST /api/auth/register
    │   ├── login.js          # POST /api/auth/login
    │   └── logout.js         # POST /api/auth/logout
    ├── progress/
    │   └── track.js          # POST /api/progress/track
    ├── submit/
    │   └── upload.js         # POST /api/submit/upload
    └── grade/
        └── evaluate.js       # POST /api/grade/evaluate
```

### Component Files (React Components)
```
components/
├── LessonPlayer.jsx          # Displays lesson content & resources
├── QuizComponent.jsx         # Interactive quiz interface
├── SubmissionForm.jsx        # File upload form for capstone
└── DashboardStats.jsx        # Progress statistics display
```

### Library Files (Utility Functions)
```
lib/
├── supabase.js              # Supabase client & database functions
├── claude.js                # Claude API integration & grading
├── auth.js                  # Authentication utilities
└── rubrics.js               # Grading rubrics for both specializations
```

### Public Assets
```
public/
├── lessons.json             # All 26 lessons + quiz data
├── favicon.ico              # Browser tab icon
└── styles/
    └── globals.css          # Global styling (optional)
```

### Database
```
supabase-schema.sql          # Database schema (run in Supabase SQL editor)
```

### Documentation
```
PLATFORM_README.md           # Platform overview & features
DEPLOYMENT_SETUP.md          # Step-by-step deployment guide
PROJECT_STRUCTURE.md         # This file
```

---

## 📋 File Descriptions

### Configuration Files

#### `.env.local` (Do NOT commit!)
```
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
CLAUDE_API_KEY=sk-ant-api03-...
RESEND_API_KEY=re_...
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

#### `package.json`
Dependencies:
- next@14 - React framework
- react@18 - UI library
- @supabase/supabase-js@2.38 - Database client
- @anthropic-ai/sdk@0.9 - Claude API client
- resend@1.0 - Email service

#### `next.config.js`
- Configures external packages for server components
- Sets 10MB body size limit for file uploads
- Adds security headers

#### `vercel.json`
- Sets 60-second timeout for long-running API calls (grading)
- Configures environment variables

---

### Page Files

#### `pages/index.js` - Student Dashboard
- Shows 26 lesson cards with progress
- Displays stats: lessons completed, average score, specialization
- Links to lesson player and capstone submission
- Logout button

#### `pages/login.js` - Login Page
- Email & password form
- Error handling
- Redirect to register page

#### `pages/register.js` - Registration Page
- Email, password, name, specialization selection
- Form validation
- Auto-login after registration

#### `pages/lesson/[id].js` - Lesson Player
- Displays lesson content, objectives, resources
- Interactive quiz component
- Tracks quiz completion
- Shows previous scores

#### `pages/submit-capstone.js` - Capstone Submission
- File upload form (PDF, TXT, ZIP, JSON)
- Shows previous submission status
- Triggers Claude auto-grading
- Links to submission guidelines

#### API Routes
All return JSON responses

**`/api/auth/register`** - Creates new student account
- Input: email, password, name, specialization
- Output: userId, success message

**`/api/auth/login`** - Student login
- Input: email, password
- Output: user, session

**`/api/auth/logout`** - Student logout
- Clears session

**`/api/progress/track`** - Records quiz completion
- Input: lessonId, quizScore
- Output: progress stats, average score

**`/api/submit/upload`** - Capstone file upload
- Input: capstoneId, fileName, fileContent
- Output: submissionId, fileUrl, status
- Max file size: 10MB

**`/api/grade/evaluate`** - Claude auto-grading
- Input: submissionId, capstoneType, submissionContent, studentEmail
- Output: score, breakdown, strengths, improvements, feedback
- Sends email with grade

---

### Component Files

#### `LessonPlayer.jsx`
- Two-tab interface: Content & Resources
- Learning objectives list
- Lesson content display
- Video placeholder (if available)
- Recommended resources with links
- Key terms with definitions

#### `QuizComponent.jsx`
- Multiple-choice questions
- Radio button selection
- Answer validation
- Score calculation
- Results display
- Option to retake

#### `SubmissionForm.jsx`
- Drag-and-drop file upload
- File validation (type, size)
- Clear selection button
- Upload progress

#### `DashboardStats.jsx`
- Progress grid (lessons completed / 26)
- Average score with color coding
- Specialization path display

---

### Library Files

#### `lib/supabase.js`
Client-side and server-side Supabase integration
- `createClient()` - Browser client
- `createServerSupabaseClient()` - API route client
- Auth functions: signUp, signIn, signOut
- Database functions: recordProgress, getProgress, uploadSubmission, saveGrade
- Storage functions: uploadFile, getPublicUrl

#### `lib/claude.js`
Claude API integration for auto-grading
- `gradeCapstone(type, content)` - Main grading function
- `generateFeedbackEmail()` - Format feedback email
- Uses claude-opus-4-6 model
- Returns score, breakdown, feedback, strengths, improvements

#### `lib/auth.js`
Authentication utility functions
- signUp, signIn, signOut
- getSession, getCurrentUser
- resetPassword
- isAuthenticated

#### `lib/rubrics.js`
Grading rubrics for both specializations
- Sales rubric: Architecture, Implementation, Accuracy, Testing, Documentation
- CS rubric: Architecture, Implementation, Automation Rate, Testing, Documentation
- Strength & improvement prompts
- getRubric() and getCriteria() functions

---

### Data Files

#### `public/lessons.json`
Complete curriculum with all 26 lessons:

**Tier 1 (Lessons 1-6):**
1. Intro to Claude & Agentic AI
2. Prompting Fundamentals
3. Your First Automation
4. Building Agents
5. Multi-Step Workflows
6. Hands-On Capstone

**Tier 2 Sales (Lessons 7-16):**
7. APIs & Salesforce Integration
8. Lead Scoring Fundamentals
9. Advanced Lead Scoring
10. Email Personalization Fundamentals
11. Email Sequencing & Campaigns
12. Production Systems & Monitoring
13. Sales Data Analysis
14. Objection Handling Automation
15. Deal Intelligence & Forecasting
16. Sales Automation Capstone

**Tier 2 CS (Lessons 17-26):**
17. APIs & Zendesk Integration
18. Ticket Classification & Routing
19. Sentiment Analysis & Knowledge Base
20. Support Automation at Scale
21. Response Generation & Quality
22. Customer Service Analytics
23. Human-AI Collaboration
24. Proactive Support & Prevention
25. Multilingual Support
26. Customer Service Automation Capstone

Each lesson includes:
- title, description, objectives
- content, resources, key terms
- 3-5 multiple-choice quiz questions

---

### Database Schema

#### `supabase-schema.sql`
Runs in Supabase SQL editor to create:

**Tables:**
- `users` - Student profiles, auth reference
- `progress` - Lesson completion tracking
- `submissions` - Capstone file uploads
- `grades` - Auto-grading results

**Security:**
- Row-Level Security (RLS) policies
- Students see only their own data
- Storage bucket for file uploads

**Utilities:**
- `get_user_stats()` - Progress statistics
- `get_leaderboard()` - Top students
- Automatic timestamp triggers

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Clone repository locally
- [ ] Create GitHub account (ghostbutlerenterprises-oss)
- [ ] Create Supabase account
- [ ] Create Vercel account
- [ ] Create Claude API account & get key
- [ ] Create Resend account & get key

### Supabase Setup
- [ ] Create new project
- [ ] Copy connection string
- [ ] Run `supabase-schema.sql` in SQL editor
- [ ] Enable email authentication
- [ ] Copy public & secret keys

### Vercel Setup
- [ ] Create new project from GitHub
- [ ] Add environment variables
- [ ] Deploy (automatic from GitHub)

### Configuration
- [ ] Set `.env.local` with all keys
- [ ] Update `NEXT_PUBLIC_APP_URL` with deployed domain
- [ ] Test login/registration
- [ ] Test lesson access
- [ ] Test capstone submission
- [ ] Test auto-grading

### Monitoring
- [ ] Check Vercel logs for errors
- [ ] Monitor Supabase database
- [ ] Track API usage (Claude, Resend)
- [ ] Set up alerts for errors

---

## 💡 Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

Access at `http://localhost:3000`

---

## 📊 Database Query Examples

### Check student progress
```sql
SELECT u.name, COUNT(DISTINCT p.lesson_id) as lessons_completed
FROM users u
LEFT JOIN progress p ON u.id = p.user_id
WHERE p.status = 'completed'
GROUP BY u.id;
```

### Check submission status
```sql
SELECT u.name, s.submitted_at, g.score
FROM users u
JOIN submissions s ON u.id = s.user_id
JOIN grades g ON s.id = g.submission_id
ORDER BY s.submitted_at DESC;
```

---

## 🔐 Security Notes

- API keys stored in Vercel environment variables, never in code
- Row-level security prevents student data leakage
- File uploads validated for type and size
- Email addresses never logged in plain text
- All API routes require authentication headers
- HTTPS enforced on production

---

## 📞 Support & Troubleshooting

See `DEPLOYMENT_SETUP.md` for detailed troubleshooting.

Common issues:
- **"Table doesn't exist"** → Run supabase-schema.sql
- **"Invalid API key"** → Check environment variables
- **"File too large"** → Max 10MB, check in SubmissionForm
- **"Grading failed"** → Check Claude API logs in Vercel

---

## 🎯 Next Steps After Deployment

1. **Test the complete flow:**
   - Register new student account
   - Complete first lesson & quiz
   - Submit capstone project
   - Check email for grade

2. **Add more lessons:** Edit `public/lessons.json`

3. **Customize branding:** Modify colors in component files

4. **Set up analytics:** Add to Vercel dashboard

5. **Gather student feedback:** Add feedback form

6. **Scale:** Monitor database and API usage, upgrade tiers as needed

---

**Built with Next.js, Supabase, Claude, and Resend**
**Deployed on Vercel**
