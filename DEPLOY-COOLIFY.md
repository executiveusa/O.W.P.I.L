# Deploying O.W.P.I.L to Hostinger VPS with Coolify

## Prerequisites

1. Hostinger VPS with SSH access
2. Coolify installed on the VPS
3. Domain pointed to the VPS IP

---

## Step 1: Install Coolify on Hostinger VPS

SSH into your VPS:
```bash
ssh root@your-vps-ip
```

Install Coolify:
```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

Access Coolify at `http://your-vps-ip:8000` and create your admin account.

---

## Step 2: Connect GitHub Repository

1. In Coolify dashboard, go to **Sources** > **Add New**
2. Select **GitHub App**
3. Follow the OAuth flow to connect your GitHub account
4. Grant access to the `executiveusa/O.W.P.I.L` repository

---

## Step 3: Create New Application

1. Go to **Projects** > **Add New Project**
2. Name it `O.W.P.I.L`
3. Add a new **Application** inside the project
4. Select **GitHub** as source
5. Choose the `O.W.P.I.L` repository
6. Branch: `main`

---

## Step 4: Configure Build Settings

**Build Configuration:**
```
Build Pack: Nixpacks (auto-detected for Next.js)
Base Directory: /
Build Command: npm run build
Start Command: npm run start
Port: 3000
```

---

## Step 5: Set Environment Variables

Add these environment variables in Coolify (Settings > Environment Variables):

**Required (from master.env):**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenRouter (for AI Agent)
OPENROUTER_API_KEY=your_openrouter_key

# Discord (optional)
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_APPLICATION_ID=your_discord_app_id
DISCORD_PUBLIC_KEY=your_discord_public_key

# Voice Transcription (optional)
OPENAI_API_KEY=your_openai_key
# or
GROQ_API_KEY=your_groq_key
```

---

## Step 6: Configure Domain

1. Go to **Settings** > **Domain**
2. Add your domain: `owpil.com` or `app.owpil.com`
3. Enable **HTTPS** (Coolify auto-generates SSL via Let's Encrypt)

---

## Step 7: Deploy

1. Click **Deploy** button
2. Watch the build logs
3. Once complete, your site is live!

---

## Step 8: Set Up Discord Webhook (Optional)

1. In Discord Developer Portal, go to your application
2. Set Interactions Endpoint URL to:
   ```
   https://your-domain.com/api/discord/interactions
   ```
3. Discord will verify the endpoint automatically

---

## Updating the Site

**Automatic:** Enable GitHub webhooks in Coolify for auto-deploy on push

**Manual:** Click "Redeploy" in Coolify dashboard

---

## Troubleshooting

### Build Fails
- Check build logs in Coolify
- Ensure all env vars are set
- Verify Node.js version compatibility

### Database Connection Issues
- Verify Supabase URL and keys
- Check if IP needs to be whitelisted

### CORS Errors
- Add your domain to Supabase allowed origins
- Check Next.js config for proper headers

---

## Health Check

Test the deployment:
```bash
curl https://your-domain.com/api/health
```

Test the agent:
```bash
curl -X POST https://your-domain.com/api/agent/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, are you working?"}'
```

---

## Resource Recommendations

For Hostinger VPS:
- **Minimum:** 2 vCPU, 4GB RAM (KVM 2)
- **Recommended:** 4 vCPU, 8GB RAM (KVM 4)

The AI agent and browser automation features benefit from more RAM.
