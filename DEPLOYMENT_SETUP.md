# Claude AI Certification Platform - Complete Deployment Package

**Your GitHub:** ghostbutlerenterprises-oss  
**Status:** Ready to Deploy  
**Time to Live:** 15 minutes

---

## 📋 DEPLOYMENT CHECKLIST

### BEFORE YOU START
- [ ] You have a GitHub account (ghostbutlerenterprises-oss)
- [ ] You created a Vercel account (connected to GitHub)
- [ ] You created a Supabase account
- [ ] You have your Claude API key (saved in secure location)

### STEP-BY-STEP DEPLOYMENT

---

## 🔧 STEP 1: Create GitHub Repository (2 minutes)

1. Go to [github.com/new](https://github.com/new)
2. **Repository name:** `claude-certification-platform`
3. **Description:** Claude AI Certification Curriculum Platform
4. **Public** (so we can connect to Vercel easily)
5. **Add .gitignore:** Node
6. Click "Create Repository"
7. ✅ Note the repo URL: `https://github.com/ghostbutlerenterprises-oss/claude-certification-platform`

---

## 📥 STEP 2: Clone & Add Code (3 minutes)

**In your terminal:**

```bash
# Clone the empty repo
git clone https://github.com/ghostbutlerenterprises-oss/claude-certification-platform
cd claude-certification-platform

# Copy all the files I've created into this directory
# (You'll get a zip or download all files)

# Add everything to git
git add .
git commit -m "Initial commit: Complete Next.js platform with auth, progress tracking, and Claude auto-grading"
git push origin main
```

---

## 🗄️ STEP 3: Set Up Supabase (3 minutes)

### 3a. Create Database

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. **Name:** `claude-certification`
4. **Database Password:** (generate a strong one, copy it)
5. **Region:** Choose closest to you
6. Click "Create New Project" (wait 2-3 minutes)

### 3b. Run SQL Setup

1. In Supabase dashboard, go to "SQL Editor"
2. Click "New Query"
3. Copy-paste the entire SQL schema from `supabase-schema.sql`
4. Click "Run"
5. ✅ Tables created

### 3c. Get Your Credentials

1. Go to "Settings" → "API"
2. Copy these values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **Anon Public Key** (long string starting with `eyJh...`)
3. Save these - you'll need them in next step

### 3d. Enable Auth

1. Go to "Authentication" → "Providers"
2. Make sure "Email" is enabled (should be by default)
3. Go to "URL Configuration"
4. Add redirect URL: `https://yourdomain.vercel.app/auth/callback`
   (We'll set this up after Vercel deploys)

---

## 🚀 STEP 4: Deploy to Vercel (2 minutes)

1. Go to [vercel.com/new](https://vercel.com/new)
2. **Import Git Repository:**
   - Search for: `claude-certification-platform`
   - Click "Import"
3. **Configure Project:**
   - Framework: `Next.js`
   - Root Directory: `.` (already filled)
4. **Environment Variables:** Click "Add Environment Variable" for each:

   ```
   NEXT_PUBLIC_SUPABASE_URL = [Your Supabase Project URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY = [Your Supabase Anon Key]
   CLAUDE_API_KEY = [Your Claude API Key]
   RESEND_API_KEY = [Your Resend API Key - see Step 5]
   ```

5. Click "Deploy"
6. ✅ Wait 2-3 minutes for deployment
7. Note your deployment URL (looks like: `https://claude-certification-platform.vercel.app`)

---

## 📧 STEP 5: Set Up Resend (Email) (2 minutes)

1. Go to [resend.com](https://resend.com)
2. Sign up with your email
3. Go to "API Keys"
4. Copy your API key
5. Paste into Vercel environment variable (from Step 4)

---

## 🔗 STEP 6: Update Auth Callback (1 minute)

Back in Supabase:
1. Go to "Authentication" → "URL Configuration"
2. Update "Redirect URLs" with your Vercel domain:
   - `https://[your-vercel-domain].vercel.app/auth/callback`

---

## ✅ STEP 7: Test Everything (2 minutes)

1. Go to your Vercel domain: `https://[your-vercel-domain].vercel.app`
2. Click "Sign Up"
3. Enter email: `test@example.com`
4. Enter password: `Test123!@#`
5. ✅ Should see dashboard

---

## 🎓 STEP 8: Add Your Curriculum Data (1 minute)

The platform already includes all 26 lessons, but if you want to update them:

1. In your repo, edit `public/lessons.json`
2. Or copy the latest from `lessons_extended_week5_8.json`
3. Commit and push
4. Vercel auto-deploys

---

## 📊 STEP 9: Start Adding Students (Ongoing)

1. Go to your Vercel domain
2. Click "Sign Up" with student emails
3. Students can:
   - View all 26 lessons
   - Take quizzes
   - Submit capstone projects
   - See their grades (auto-graded by Claude)

---

## 🔍 TROUBLESHOOTING

### "Supabase connection failed"
- Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel
- Make sure variables are marked as "Plaintext" not "Secret"

### "Claude grading not working"
- Check `CLAUDE_API_KEY` is correct
- Verify API key still valid at console.anthropic.com
- Check Vercel logs: "Deployments" → "Functions" → `api/grade/evaluate`

### "Emails not sending"
- Verify `RESEND_API_KEY` is correct
- Check Vercel logs for email errors
- May take 5 minutes for first email to send

### "Can't log in"
- Check Supabase email provider is enabled
- Verify redirect URL matches Vercel domain
- Check browser console for CORS errors

---

## 🎯 NEXT STEPS AFTER DEPLOYMENT

1. **Create instructor account** - Edit `pages/api/auth/register.js` to mark yourself as admin
2. **Customize capstone rubric** - Edit `lib/rubrics.js` for grading criteria
3. **Invite first students** - Share your domain + have them sign up
4. **Monitor student progress** - Supabase dashboard shows all data in real-time
5. **Scale up** - If you get >100 students, upgrade Supabase ($25/mo)

---

## 📞 SUPPORT RESOURCES

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Claude API Docs:** https://docs.anthropic.com

---

## ⚡ QUICK REFERENCE

| Service | Setup Time | Cost | Link |
|---------|-----------|------|------|
| Vercel | 2 min | Free | vercel.com |
| Supabase | 3 min | Free* | supabase.com |
| Resend | 2 min | Free† | resend.com |
| Claude API | Already have | Pay-as-you-go | console.anthropic.com |

*Free tier: 500MB storage, 2GB bandwidth  
†Free tier: 100 emails/day

---

## ✨ YOU'RE READY!

All files are created and ready to deploy. Follow the 9 steps above and your platform will be live in 15 minutes.

**Questions?** Check the TROUBLESHOOTING section or review specific file documentation.
