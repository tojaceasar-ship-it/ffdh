# 📋 TODO_FOR_HUMAN.md

**Data aktualizacji**: 2025-11-02
**Tryb**: FFDH-AUTOPILOT - Project Audit
**Status**: 🔴 CRITICAL CONTENT MISSING (Deploy Blocker)

---

## 🚨 CRITICAL DEPLOY BLOCKERS

### 🔥 MUST-DO BEFORE PRODUCTION (1-2 days)

| Task | Status | Priority | ETA | Assignee |
|------|--------|----------|-----|----------|
| **Uzupełnić produkty w Sanity CMS** | 🔴 MISSING | CRITICAL | 1 dzień | Content Team |
| **Dodać rzeczywiste zdjęcia produktów** | 🔴 MISSING | CRITICAL | 1 dzień | Designer/Photographer |
| **Uzupełnić sceny emocjonalne w CMS** | 🔴 MISSING | CRITICAL | 2 dni | Content Writer |
| **Napisać manifest FFDH** | 🔴 MISSING | CRITICAL | 1 dzień | Copywriter |

---

## 📝 CONTENT CREATION TASKS

### 🎨 Visual Content (Designer/Photographer)

| Task | Details | Status | Priority |
|------|---------|--------|----------|
| Product photography | Zdjęcia produktów (min. 10 pozycji) | 🔴 MISSING | CRITICAL |
| Scene mood boards | Wizualizacje dla scen emocjonalnych | 🔴 MISSING | HIGH |
| OG images | Custom open graph images dla social sharing | 🟡 PLACEHOLDER | MEDIUM |
| Brand assets | Logo variations, favicons, manifest icons | 🟡 BASIC | LOW |

### ✍️ Copywriting (Content Writer)

| Task | Details | Status | Priority |
|------|---------|--------|----------|
| Product descriptions | Opisy produktów (polski + angielski) | 🔴 MISSING | CRITICAL |
| Scene narratives | Narracje dla scen emocjonalnych (min. 15) | 🔴 MISSING | CRITICAL |
| FFDH manifest | Główna narracja marki Fruits From Da Hood | 🔴 MISSING | CRITICAL |
| SEO meta descriptions | Meta descriptions dla wszystkich stron | 🟡 BASIC | MEDIUM |
| Email templates | Welcome, order confirmation templates | 🔴 MISSING | MEDIUM |

### 🗄️ CMS Population (Content Manager)

| Task | Details | Status | Priority |
|------|---------|--------|----------|
| Sanity products | Dodać min. 10 produktów z pełnymi danymi | 🔴 MISSING | CRITICAL |
| Sanity scenes | Migracja scen z JSON do Sanity CMS | 🟡 PARTIAL | HIGH |
| Emotion tags | Uzupełnić tagi AI z opisami | 🟡 BASIC | MEDIUM |
| Categories setup | Kategorie produktów w CMS | 🔴 MISSING | MEDIUM |

---

## 🔧 TECHNICAL FIXES (Developer)

### Security & Production Readiness

| Task | Details | Status | Priority |
|------|---------|--------|----------|
| Enable webhook signature validation | `ENABLE_SIGNATURE_CHECK=true` | 🟡 DISABLED | HIGH |
| Fix EmotionMap useEffect warning | Refactor drawAgent function | 🟡 WARNING | MEDIUM |
| Remove legacy `/scena/[slug]` route | Redirect to `/rewir/[slug]` | 🟡 EXISTS | LOW |

### Performance & SEO

| Task | Details | Status | Priority |
|------|---------|--------|----------|
| Add structured data | JSON-LD schema markup | 🔴 MISSING | MEDIUM |
| Optimize images | WebP conversion, lazy loading | 🟡 BASIC | MEDIUM |
| Core Web Vitals | Audit and optimize CWV scores | 🟡 UNKNOWN | MEDIUM |

---

## 📊 CONTENT SPECIFICATIONS

### Produkty (Products)

**Wymagania dla każdego produktu:**
- ✅ Nazwa (PL + EN)
- ✅ Opis (min. 150 słów)
- ✅ Cena (PLN)
- ✅ Zdjęcie główne (1920x1920px)
- ✅ Zdjęcia dodatkowe (min. 3)
- ✅ Kategoria
- ✅ Rozmiary/kolory (jeśli dotyczy)
- ✅ Limitowana edycja (boolean)

**Minimalna ilość:** 10 produktów

### Sceny Emocjonalne (Emotional Scenes)

**Struktura sceny:**
- ✅ Tytuł
- ✅ Narracja (min. 200 słów)
- ✅ Główna emocja (joy/sadness/anger/peace/nostalgia)
- ✅ Tagi emocjonalne
- ✅ Wizualizacja (opis lub obraz)
- ✅ AI response patterns

**Minimalna ilość:** 15 scen (5 na emocję)

### Manifest FFDH

**Sekcje wymagane:**
- ✅ Misja marki
- ✅ Historia powstania
- ✅ Wartości
- ✅ Społeczny wpływ
- ✅ Wizja przyszłości
- ✅ Zespół

**Długość:** min. 800 słów

---

## 🎯 DELIVERABLES CHECKLIST

### Pre-Launch Requirements

- [ ] ✅ Sanity CMS populated with products
- [ ] ✅ All product images uploaded
- [ ] ✅ Emotional scenes created
- [ ] ✅ FFDH manifest written
- [ ] ✅ SEO meta tags optimized
- [ ] ✅ Social media OG images
- [ ] ✅ Webhook security enabled
- [ ] ✅ E2E tests passing
- [ ] ✅ Lighthouse score > 95
- [ ] ✅ Build successful
- [ ] ✅ Deploy to staging successful

### Post-Launch Monitoring

- [ ] Analytics setup (Google Analytics 4)
- [ ] Error monitoring (Sentry)
- [ ] Performance monitoring
- [ ] User feedback collection
- [ ] A/B testing setup

---

## 📈 SUCCESS METRICS

### Content Quality
- Product descriptions: min. 150 słów each
- Scene narratives: min. 200 słów each
- Manifest: min. 800 słów
- Images: professional quality, consistent style

### Technical Performance
- Lighthouse: >95 score
- Core Web Vitals: all green
- Build time: <5 minutes
- Bundle size: <200KB initial load

### User Experience
- Page load: <3 seconds
- Mobile responsive: 100%
- Accessibility: WCAG 2.1 AA compliant

---

## 🚀 DEPLOYMENT READINESS

**Current Status**: 🔴 NOT READY FOR PRODUCTION

**Blockers**:
1. Missing CMS content (products, scenes, manifest)
2. Placeholder images throughout
3. Incomplete copywriting
4. Security settings not production-ready

**Timeline to Ready**: 3-5 business days (with dedicated content team)

**Next Steps**:
1. Assign content creation tasks
2. Schedule photography session
3. Begin CMS population
4. Test staging deployment with real content