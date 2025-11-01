# FFDH Implementation Plan
**Mode**: Full Decision→Build→Test  
**Target**: main + rewir  
**Generated**: 2025-01-27  
**Phase**: AUTOPILOT

---

## 🎯 Executive Summary

This plan outlines the complete implementation roadmap for FFDH (Fruits From Da Hood) with integrated Rewir AI functionality. The project follows a Full Decision→Build→Test approach, ensuring all architectural decisions are documented, implemented, and validated before deployment.

### Key Objectives
1. ✅ Complete Rewir AI integration with scene indexing and emotion tagging
2. ✅ Implement autopilot integrations (snapshot exporter, feedback loop, prompt enhancer)
3. ✅ Achieve full CI/CD quality gates
4. ✅ Deploy to production with monitoring

---

## 📋 Phase 1: Decision Architecture (COMPLETE)

### 1.1 Framework & Core Stack
- **Decision**: Next.js 15 App Router
- **Status**: ✅ Implemented
- **Validation**: Build passing, TypeScript strict mode enabled

### 1.2 Rewir AI Integration Decisions
- **Scene Storage**: Sanity CMS (content) + Supabase (metadata)
- **Emotion Tagging**: OpenAI GPT-4 Turbo + manual tags
- **AI Response**: GPT-4 Turbo, temperature 0.9, bilingual (PL/EN)
- **Narrative Generation**: GPT-4 Turbo, temperature 1.0, street poetry style
- **Status**: ✅ Decisions documented in `FFDH_METHOD_DECISIONS.json`

### 1.3 Autopilot Integrations
- **Rewir AI Tagging**: Scene index with emotion tags
- **Snapshot Exporter**: CI/CD artifact generation
- **Feedback Loop Logger**: Decision scoring system
- **Prompt Enhancer**: Standardized prompt templates
- **Status**: 📋 Decisions made, implementation pending

---

## 🏗️ Phase 2: Build Implementation

### 2.1 Rewir AI Core Features

#### 2.1.1 Scene Indexing System
**Tasks**:
- [ ] Create Supabase table `scenes` with schema:
  ```sql
  CREATE TABLE scenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sanity_id TEXT UNIQUE,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    narrative TEXT,
    image_url TEXT,
    emotion_tags TEXT[],
    comment_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```
- [ ] Implement Sanity-to-Supabase sync service
- [ ] Create scene indexing API route `/api/scenes/index`
- [ ] Add emotion tag extraction from OpenAI analysis

**Files to Create/Modify**:
- `supabase/migrations/002_scenes_schema.sql`
- `app/api/scenes/index/route.ts`
- `src/services/sceneIndexer.ts`
- `src/lib/sanity-sync.ts`

**Dependencies**: `@supabase/supabase-js`, `@sanity/client`

**Estimated Time**: 4-6 hours

#### 2.1.2 Prompt Context Builder
**Tasks**:
- [ ] Create `src/services/promptContext.ts`:
  - Build context from scene metadata
  - Include user emotion history (anonymized)
  - Inject emotion tags
  - Support bilingual context (PL/EN)
- [ ] Integrate with `generateAIResponse()` in `src/services/aiService.ts`
- [ ] Add prompt template system

**Files to Create/Modify**:
- `src/services/promptContext.ts`
- `src/services/aiService.ts`
- `src/lib/promptTemplates.ts`

**Estimated Time**: 3-4 hours

#### 2.1.3 Enhanced Scene Components
**Tasks**:
- [ ] Update `app/rewir/page.tsx` to fetch from Supabase instead of mock data
- [ ] Add scene filtering by emotion tags
- [ ] Implement scene search functionality
- [ ] Add emotion tag visualization enhancements

**Files to Modify**:
- `app/rewir/page.tsx`
- `src/components/SceneCard.tsx`
- `app/scena/[slug]/page.tsx`

**Estimated Time**: 2-3 hours

### 2.2 Autopilot Integrations

#### 2.2.1 Snapshot Exporter
**Tasks**:
- [ ] Create `scripts/snapshot-exporter.ts`:
  - Export build artifacts at each CI stage
  - Generate checksums for verification
  - Store snapshots in GitHub Actions artifacts
- [ ] Add to `.github/workflows/ci.yml`
- [ ] Create snapshot restore utility

**Files to Create/Modify**:
- `scripts/snapshot-exporter.ts`
- `.github/workflows/ci.yml`
- `scripts/snapshot-restore.ts`

**Estimated Time**: 2-3 hours

#### 2.2.2 Feedback Loop Logger
**Tasks**:
- [ ] Create `src/services/feedbackLogger.ts`:
  - Track decision outcomes
  - Score effectiveness (0-100)
  - Store in Supabase `decision_logs` table
- [ ] Integrate with autopilot decision points
- [ ] Create feedback analysis dashboard (admin)

**Files to Create/Modify**:
- `src/services/feedbackLogger.ts`
- `supabase/migrations/003_feedback_logs.sql`
- `admin-panel/pages/feedback-dashboard.tsx`

**Estimated Time**: 3-4 hours

#### 2.2.3 Prompt Enhancer
**Tasks**:
- [ ] Create `src/lib/promptEnhancer.ts`:
  - Standardize prompt templates
  - Inject FFDH brand voice
  - Validate prompt structure
  - Support context injection
- [ ] Replace ad-hoc prompts in `aiService.ts`
- [ ] Add prompt versioning system

**Files to Create/Modify**:
- `src/lib/promptEnhancer.ts`
- `src/lib/promptTemplates.ts`
- `src/services/aiService.ts`

**Estimated Time**: 2-3 hours

### 2.3 Plugin Registry System

#### 2.3.1 Plugin Configuration
**Tasks**:
- [ ] Create `ffdh.plugins.json` structure:
  ```json
  {
    "plugins": {
      "rewir-ai-tagging": { "enabled": true, "version": "1.0.0" },
      "snapshot-exporter": { "enabled": true, "version": "1.0.0" },
      "feedback-loop-logger": { "enabled": true, "version": "1.0.0" },
      "prompt-enhancer": { "enabled": true, "version": "1.0.0" }
    }
  }
  ```
- [ ] Implement plugin loader in `ffdh-autopilot-prime/scripts/ffdh-autopilot.ts`
- [ ] Add plugin validation

**Files to Create/Modify**:
- `ffdh.plugins.json`
- `ffdh-autopilot-prime/scripts/ffdh-autopilot.ts`

**Estimated Time**: 1-2 hours

---

## 🧪 Phase 3: Test Implementation

### 3.1 Unit Tests

#### 3.1.1 Scene Indexing Tests
- [ ] `src/services/sceneIndexer.test.ts`:
  - Test Sanity sync to Supabase
  - Test emotion tag extraction
  - Test slug generation
- [ ] `src/services/promptContext.test.ts`:
  - Test context building
  - Test bilingual support
  - Test anonymization

**Test Coverage Target**: >80%

#### 3.1.2 AI Service Tests
- [ ] Mock OpenAI API responses
- [ ] Test fallback behavior
- [ ] Test error handling
- [ ] Test prompt enhancement

**Files to Create**:
- `src/services/__tests__/sceneIndexer.test.ts`
- `src/services/__tests__/promptContext.test.ts`
- `src/services/__tests__/aiService.test.ts`
- `src/lib/__tests__/promptEnhancer.test.ts`

**Estimated Time**: 4-5 hours

### 3.2 Integration Tests

#### 3.2.1 API Route Tests
- [ ] `/api/scenes/index` - scene indexing endpoint
- [ ] `/api/ai-reply` - enhanced with prompt context
- [ ] `/api/comments` - emotion tag association

**Files to Create**:
- `tests/api/scenes.test.ts`
- `tests/api/ai-reply.test.ts`

**Estimated Time**: 2-3 hours

### 3.3 E2E Tests

#### 3.3.1 Rewir User Flows
- [ ] Scene browsing with emotion filters
- [ ] Comment submission with emotion tags
- [ ] AI response generation
- [ ] Scene detail page navigation

**Files to Create**:
- `tests/e2e/rewir.spec.ts`

**Estimated Time**: 3-4 hours

### 3.4 Performance Tests

#### 3.4.1 AI Response Latency
- [ ] Target: < 2s p95 for AI responses
- [ ] Monitor OpenAI API response times
- [ ] Test with rate limiting

#### 3.4.2 Scene Indexing Performance
- [ ] Target: < 5s for full sync
- [ ] Test batch operations
- [ ] Optimize Supabase queries

**Files to Create**:
- `tests/performance/ai-latency.test.ts`
- `tests/performance/scene-sync.test.ts`

**Estimated Time**: 2-3 hours

---

## 🔄 Phase 4: Validation & Quality Gates

### 4.1 Pre-Deployment Checklist
- [ ] All unit tests passing (>80% coverage)
- [ ] All integration tests passing
- [ ] E2E tests passing on Chromium, Firefox, WebKit
- [ ] Lighthouse CI scores:
  - Performance: >85
  - Accessibility: >90
  - Best Practices: >90
  - SEO: >90
- [ ] pa11y CI: 0 errors
- [ ] TypeScript: 0 errors
- [ ] ESLint: 0 errors
- [ ] Security audit: 0 high/critical vulnerabilities

### 4.2 Rewir AI Validation
- [ ] Scene indexing working (Sanity → Supabase)
- [ ] Emotion tagging accurate (>85% match with manual tags)
- [ ] AI responses generated in < 2s p95
- [ ] Prompt context properly injected
- [ ] Bilingual support verified (PL/EN)

### 4.3 Autopilot Integration Validation
- [ ] Snapshot exporter generating artifacts in CI
- [ ] Feedback loop logging decisions
- [ ] Prompt enhancer standardizing all prompts
- [ ] Plugin registry loading correctly

---

## 🚀 Phase 5: Deployment

### 5.1 Staging Deployment
1. Deploy to Vercel staging environment
2. Run full validation suite
3. Test Rewir AI features end-to-end
4. Verify monitoring and alerts

### 5.2 Production Deployment
1. Database migrations (Supabase)
2. Environment variables configuration
3. Vercel production deployment
4. Post-deployment smoke tests
5. Monitor for 24h

### 5.3 Rollback Plan
- Snapshot restore from last successful build
- Database rollback scripts ready
- Feature flags for gradual rollout

---

## 📊 Success Metrics

### Technical Metrics
- ✅ Build success rate: >95%
- ✅ Test coverage: >80%
- ✅ AI response latency: < 2s p95
- ✅ Zero critical security vulnerabilities
- ✅ Lighthouse scores: All >85

### Business Metrics
- Scene indexing: 100% of Sanity scenes synced
- Emotion tagging: >85% accuracy
- User engagement: AI responses received positively
- Content moderation: >95% toxic content caught

---

## 🔧 Implementation Commands

### Setup Environment
```bash
# Install dependencies
yarn install

# Setup Supabase locally
supabase start

# Run migrations
supabase db reset

# Setup Sanity
cd sanity && npm install && npm run dev
```

### Development
```bash
# Start dev server
yarn dev

# Run tests
yarn test
yarn test:e2e

# Type check
yarn type-check

# Lint
yarn lint
```

### CI/CD
```bash
# Run full CI suite
yarn test:ci
yarn lhci
yarn a11y:ci
```

### Scene Indexing
```bash
# Manual scene sync
ts-node scripts/sync-scenes.ts

# Test scene indexing
yarn test src/services/sceneIndexer.test.ts
```

---

## 📝 Risk Mitigation

### High Priority Risks
1. **OpenAI API Rate Limiting**
   - Mitigation: Implement exponential backoff, caching, fallback responses
   - Monitoring: Track API usage, alert on rate limit errors

2. **Sanity-Supabase Sync Failures**
   - Mitigation: Idempotent sync operations, retry logic, manual sync script
   - Monitoring: Alert on sync failures, daily sync status report

3. **AI Response Quality Degradation**
   - Mitigation: A/B test prompt versions, feedback loop scoring
   - Monitoring: Track user satisfaction metrics, alert on negative trends

### Medium Priority Risks
1. **Database Performance with Large Scene Counts**
   - Mitigation: Index optimization, pagination, caching
   - Monitoring: Query performance metrics

2. **Cost Overruns from AI API Usage**
   - Mitigation: Usage limits, cost alerts, prompt optimization
   - Monitoring: Daily cost reports, usage quotas

---

## 🎯 Next Steps (Immediate)

1. **Create Supabase migrations** for scenes and feedback logs
2. **Implement scene indexer service** with Sanity sync
3. **Build prompt context system** and integrate with AI service
4. **Set up plugin registry** configuration
5. **Write unit tests** for new services
6. **Update CI/CD** with snapshot exporter

---

## 📚 References

- [FFDH Method Decisions](./../decisions/FFDH_METHOD_DECISIONS.json)
- [FFDH Radar Report](./../reports/FFDH-RADAR.md)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)

---

**Last Updated**: 2025-01-27  
**Status**: IMPLEMENTATION READY  
**Next Review**: After Phase 2 completion

