# GitHub Security Guide - Protecting Sensitive Data

## Overview
This guide explains how to safely push your MERN project to GitHub without exposing sensitive information like API keys, database credentials, and secrets.

---

## 1. What Gets Protected (✅ Already Configured)

Your `.gitignore` now prevents these files from being committed:

```
✅ .env (Server environment variables)
✅ .env (Client environment variables)  
✅ .env.local (Local overrides)
✅ .env.*.local (Environment-specific files)
✅ node_modules/ (Dependencies)
✅ .DS_Store (OS files)
```

**Result:** Your sensitive data NEVER goes to GitHub.

---

## 2. Sensitive Files Never to Commit

These files are automatically ignored:

### Server Secrets (.env)
```
❌ MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
❌ JWT_SECRET=your-super-secret-key-here
❌ JWT_REFRESH_SECRET=your-refresh-secret-key
❌ STRIPE_API_KEY=sk_test_xxxxxxxxxxxxx
❌ EMAIL_PASSWORD=your-email-password
```

### Client Secrets (.env)
```
❌ VITE_API_URL=http://localhost:5000/api
❌ API_KEY=sensitive-api-key
```

---

## 3. How to Push to GitHub Safely

### Step 1: Verify .gitignore is Working
Before pushing, check that your .env files are NOT being tracked:

```bash
git status
```

You should see `.env` files are untracked/ignored. They should NOT appear in the output.

### Step 2: Push to GitHub
```bash
git add .
git commit -m "Initial commit: MERN healthcare app"
git push origin main
```

**Your .env files stay on your local machine - they're not pushed!**

---

## 4. Sharing Configuration with Team Members

Instead of sharing actual `.env` files, use `.env.example` files:

### Server `.env.example` (already exists)
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-jwt-refresh-secret-key
# ... other configs
```

### Client `.env.example` (already exists)
```bash
VITE_API_URL=http://localhost:5000/api
# ... other configs
```

**Team members copy these:**
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
# Then they add their own actual values
```

---

## 5. Production Deployment (Vercel)

### For Vercel Deployment:
1. Go to your Vercel project settings
2. Navigate to **Settings → Environment Variables**
3. Add your production secrets there:

```
MONGODB_URI = production-mongodb-uri
JWT_SECRET = production-jwt-secret
JWT_REFRESH_SECRET = production-refresh-secret
VITE_API_URL = https://your-api.vercel.app/api
```

**Vercel automatically injects these during build and runtime.**

### Never commit .env for production!
The `.gitignore` prevents this, and Vercel manages secrets separately.

---

## 6. If You Accidentally Committed Secrets

**⚠️ Important:** If you accidentally pushed a .env file with secrets:

1. **Immediately rotate your secrets:**
   - Change MongoDB password
   - Regenerate JWT keys
   - Reset API keys

2. **Remove from Git history:**
   ```bash
   git rm --cached server/.env
   git rm --cached client/.env
   git commit -m "Remove .env files from tracking"
   git push origin main
   ```

3. **Force clean history (if secrets were exposed):**
   ```bash
   git filter-branch --tree-filter 'rm -f server/.env client/.env' -- --all
   ```

---

## 7. Security Checklist

Before pushing to GitHub, verify:

- [ ] `.gitignore` includes all `.env` files
- [ ] Run `git status` - no `.env` files shown
- [ ] `.env.example` files exist with placeholder values
- [ ] No hardcoded secrets in code files (`.js`, `.jsx`, `.ts`)
- [ ] No API keys in comments or documentation
- [ ] Production secrets are in Vercel, not in Git

---

## 8. Best Practices

✅ **DO:**
- Use `.env.example` for configuration templates
- Store secrets in Vercel environment variables for production
- Use `.gitignore` to exclude sensitive files
- Rotate secrets regularly
- Use unique keys for development vs. production

❌ **DON'T:**
- Commit `.env` files with real credentials
- Hardcode secrets in source code
- Share `.env` files via email or chat
- Use the same secrets for dev and production
- Push API keys to public repositories

---

## 9. GitHub Repository Status

Your repository is now secure:

```
✅ .gitignore properly configured
✅ .env files are protected
✅ .env.example templates available
✅ Ready to push to GitHub safely
✅ Ready for team collaboration
```

---

## 10. Next Steps

1. **Verify before pushing:**
   ```bash
   git status  # Ensure no .env files are listed
   ```

2. **Push safely:**
   ```bash
   git add .
   git commit -m "Setup MERN healthcare app"
   git push origin main
   ```

3. **Share with team:**
   - Share the repository link (public or private)
   - Team members clone the repo
   - Each person runs: `cp server/.env.example server/.env`
   - Each person adds their local values to the `.env` files

4. **Deploy to Vercel:**
   - Connect GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy with `git push` (automatic deployment)

---

## Questions?

If you're unsure about any file's sensitivity:
- Does it contain passwords, API keys, or secrets? → Add to `.gitignore`
- Is it auto-generated or local-only? → Add to `.gitignore`
- Is it essential for running the app? → Include in the repository

**When in doubt, exclude it from Git and document in `.env.example`.**
