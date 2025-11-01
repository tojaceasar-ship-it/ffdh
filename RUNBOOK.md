# FFDH Runbook

## 🚨 Emergency Procedures

### Service Outage
1. **Check Vercel Dashboard**: Monitor deployment status and logs
2. **Database Issues**: Check Supabase dashboard for outages
3. **Stripe Issues**: Monitor Stripe status page
4. **Rollback**: Use Vercel deployment history to rollback

### Webhook Failures
1. **Check Logs**: Review Vercel function logs for webhook errors
2. **Verify Signatures**: Ensure webhook secrets are correct
3. **Rate Limiting**: Check if IP is rate limited
4. **Retry Logic**: Webhooks auto-retry on failure

## 🔧 Common Issues & Fixes

### Build Failures
```bash
# Clear caches
rm -rf .next node_modules/.cache
npm install
npm run build

# If you see Sanity config errors ensure `sanity.config.ts`
# still exports `structure` and begins with 'use client'.
```

### Environment Variables Missing
```bash
# Check all required vars are set in Vercel
cp .env.example .env.local
# Fill in actual values
```

### Database Connection Issues
```bash
# Test Supabase connection
npm run sanity:dev
# Check RLS policies
```

### Payment Processing Issues
```bash
# Test Stripe webhooks locally
stripe listen --forward-to localhost:3000/api/stripe/webhook

# If `/api/checkout` returns `{ mock: true }` in production,
# verify Stripe keys and redeploy once restored.
```

## 📊 Monitoring

### Key Metrics to Monitor
- **Response Times**: < 2.5s LCP
- **Error Rates**: < 1% 5xx errors
- **Rewir reaction throughput**: ensure Supabase counts update within 5s
- **Conversion Rate**: Track checkout completion
- **Webhook Success**: 100% delivery rate

### Alert Conditions
- 5xx errors > 5% in 5 minutes
- Webhook failures > 10 in 1 hour
- Build failures on main branch

## 🚀 Deployment

### Production Deployment
```bash
# Automatic via GitHub Actions on main branch merge
# Preview deployments on PR
```

### Rollback Procedure
1. Go to Vercel dashboard
2. Select previous deployment
3. Click "Promote to Production"
4. Monitor for issues

## 🔒 Security

### Secrets Management
- All secrets stored in Vercel environment variables
- Never commit secrets to code
- Rotate keys quarterly

### Access Control
- Admin panel requires authentication
- API routes validate inputs
- Webhooks verify signatures

## 📈 Performance

### Optimization Checklist
- [ ] Images optimized (Next.js Image component)
- [ ] Bundle size < 200KB
- [ ] Core Web Vitals passing
- [ ] Lighthouse score > 90

### Caching Strategy
- Static pages: ISR (1 hour)
- API responses: 5 minutes
- Images: CDN with cache headers
- Local fallbacks: `content/auto_scenes.json` and `content/auto_products.json`

## 🔄 Backup & Recovery

### Database Backups
- Supabase automatic daily backups
- Export critical data weekly

### Code Repository
- Main branch protected
- PR reviews required
- Automated testing gates

## 📞 Support Contacts

### Emergency
- **On-call**: [Contact info]
- **Vercel Support**: support@vercel.com
- **Supabase Support**: support@supabase.com
- **Stripe Support**: support@stripe.com

### Business Hours
- **Tech Lead**: [Contact info]
- **DevOps**: [Contact info]
