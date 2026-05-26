# Claude AI Certification Platform

A production-ready learning management system for the Claude AI Certification program with **auto-grading, student progress tracking, and multi-specialization curriculum**.

## 🎯 Features

- **26-Lesson Curriculum** — Complete Tier 1 & Tier 2 courses (50+ hours)
- **Student Accounts** — Registration, login, progress tracking
- **Quiz & Quests** — Interactive assessments with instant feedback
- **Capstone Projects** — Student project submissions
- **Claude Auto-Grading** — Intelligent project evaluation using Claude API
- **Progress Dashboard** — Real-time student analytics
- **Email Notifications** — Automated feedback delivery via Resend
- **Specialization Paths** — Sales Automation or Customer Service Automation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Git
- GitHub account
- Supabase account
- Vercel account
- Claude API key

### Deployment (15 minutes)

**See `DEPLOYMENT_SETUP.md` for complete step-by-step instructions.**

**TL;DR:**
```bash
# 1. Create GitHub repo
git clone <your-repo>
cd claude-certification-platform
git push

# 2. Create Supabase project → run schema.sql

# 3. Deploy to Vercel → add environment variables

# 4. Done! 🎉
```

## 📁 Project Structure

```
claude-certification-platform/
├── pages/
│   ├── index.js                    # Student dashboard
│   ├── login.js                    # Login page
│   ├── register.js                 # Registration
│   ├── lesson/[id].js             # Lesson player
│   ├── submit-capstone.js         # Project submission
│   └── api/
│       ├── auth/
│       │   ├── register.js        # User registration API
│       │   ├── login.js           # Login API
│       │   └── logout.js          # Logout API
│       ├── progress/
│       │   └── track.js           # Record quiz completion
│       ├── submit/
│       │   └── upload.js          # Project file upload
│       └── grade/
│           └── evaluate.js        # Claude auto-grading
├── lib/
│   ├── supabase.js               # Database client
│   ├── claude.js                 # Claude AI integration
│   ├── auth.js                   # Auth utilities
│   └── rubrics.js                # Grading rubrics
├── components/
│   ├── LessonPlayer.jsx          # Lesson UI
│   ├── QuizComponent.jsx         # Quiz interface
│   ├── SubmissionForm.jsx        # File upload form
│   └── DashboardStats.jsx        # Progress stats
├── public/
│   ├── lessons.json              # All 26 lessons + data
│   └── styles/
├── .env.local.example            # Environment variables template
├── vercel.json                   # Vercel configuration
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies
└── supabase-schema.sql           # Database schema
```

## 🔑 Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiI...

# Claude API
CLAUDE_API_KEY=sk-ant-api03-...

# Resend Email
RESEND_API_KEY=re_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🗄️ Database Schema

### Users
```sql
id (UUID) | email | name | specialization ('sales'|'cs') | created_at
```

### Progress
```sql
id | user_id | lesson_id | status | quiz_score | completed_at
```

### Submissions
```sql
id | user_id | capstone_id | file_url | submitted_at | status ('pending'|'graded')
```

### Grades
```sql
id | submission_id | score (0-100) | feedback | breakdown | strengths | improvements
```

## 🤖 Claude Auto-Grading

Students submit capstone projects → Claude evaluates against rubric → Feedback emailed

**Grading Rubrics:**
- **Sales Capstone:** Architecture, Implementation, Accuracy, Testing, Documentation
- **CS Capstone:** Architecture, Implementation, Automation Rate, Testing, Documentation

**Grading Prompt:** Evaluates based on specified criteria, provides score (0-100) and detailed feedback.

## 📊 API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/register` | POST | Create new student account |
| `/api/auth/login` | POST | Student login |
| `/api/progress/track` | POST | Record quiz score |
| `/api/submit/upload` | POST | Upload capstone project |
| `/api/grade/evaluate` | POST | Grade submission (Claude) |

## 🎓 Curriculum

### Tier 1: Foundations (Weeks 1-2)
- Intro to Claude & Agentic AI
- Prompting Fundamentals
- Your First Automation
- Building Agents
- Multi-Step Workflows
- Hands-On Capstone

### Tier 2: Specialization (Weeks 3-8)

**Sales Automation Path:**
- APIs & Salesforce Integration
- Advanced Lead Scoring
- Email Personalization & Sequencing
- Production Systems & Monitoring

**Customer Service Path:**
- APIs & Zendesk Integration
- Ticket Classification & Routing
- Sentiment Analysis & KB Integration
- Support Automation at Scale

## 📈 Analytics & Dashboard

Students see:
- Progress on each lesson
- Quiz scores
- Capstone grade (when graded)
- Learning recommendations

Admins see (future):
- Student progress
- Quiz performance analytics
- Capstone submission status
- Grading queue

## 🔒 Security

- **Authentication:** Supabase Auth (email/password)
- **Row-Level Security:** Students see only their own data
- **API Keys:** Stored securely in Vercel environment variables
- **File Upload:** Validated file types, size limits
- **CORS:** API-only from verified domains

## 💰 Costs (Free Tier)

| Service | Free Tier | Monthly Cost |
|---------|-----------|--------------|
| Vercel | Unlimited | $0 |
| Supabase | 500MB storage | $0 |
| Resend | 100 emails/day | $0 |
| Claude API | Pay-as-you-go | $5-20 |
| **Total** | | **$5-20/mo** |

Upgrade when you exceed free tiers.

## 🚨 Troubleshooting

### Database connection failed
- Verify Supabase URL and key in environment variables
- Check that tables were created (Supabase SQL Editor)
- Ensure `NEXT_PUBLIC_` prefix for public variables

### Grading not working
- Check Claude API key is valid
- Verify API rate limits not exceeded
- Check Vercel function logs

### Email not sending
- Verify Resend API key
- Check email addresses are valid
- Review email logs in Resend dashboard

### Students can't log in
- Check Supabase Auth email provider enabled
- Verify redirect URLs configured
- Clear browser cookies

## 📖 Documentation

- **DEPLOYMENT_SETUP.md** — Step-by-step deployment guide
- **supabase-schema.sql** — Database schema (run in Supabase)
- **lib/claude.js** — Claude integration details
- **lib/supabase.js** — Database functions

## 🤝 Support

For issues:
1. Check troubleshooting section
2. Review Vercel function logs
3. Check Supabase database logs
4. Review Claude API status

## 📝 License

MIT

## 🎯 Next Steps

1. **Deploy** — Follow DEPLOYMENT_SETUP.md
2. **Test** — Sign up and complete a lesson
3. **Add students** — Share your domain
4. **Monitor** — Check Supabase dashboard for progress
5. **Scale** — Upgrade tiers as you grow
# Ready to Deploy
---

**Built with Next.js, Supabase, Claude, and Resend**

**Your Vercel Domain:** `https://claude-certification-platform.vercel.app`

**Your GitHub Repo:** `https://github.com/ghostbutlerenterprises-oss/claude-certification-platform`
