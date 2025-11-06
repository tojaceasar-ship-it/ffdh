# Security Policy

## Key Rotation

- **API Keys**: Rotate every 90 days or immediately if exposed
- **Webhook Secrets**: Rotate every 180 days
- **Database Credentials**: Rotate every 90 days
- **NextAuth Secret**: Rotate every 180 days

## Secret Management

- All secrets stored in Vercel Environment Variables
- Never commit secrets to git
- Use `.env.local` for local development only
- Secrets template: `bots/knowledge-base/secrets/api-keys.json.example`

## Webhook Security

- All webhooks verify HMAC signatures
- Test negative cases: reject invalid signatures (HTTP 401/403)
- Use `ENABLE_SIGNATURE_CHECK=true` in production
- Webhook secrets stored in environment variables

## Testing

- Negative webhook signature tests in `bots/test-bot`
- Smoke tests verify health endpoints
- E2E tests cover critical user flows

## Reporting

- Report security issues via GitHub Issues
- Include: description, severity, steps to reproduce

