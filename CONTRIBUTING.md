# 🍉 Contributing to FFDH

Thank you for interest in contributing to Fruits From Da Hood! This guide will help you get started.

## Code of Conduct

- Be respectful and inclusive
- Give credit where it's due
- Focus on the code, not the person
- Help others learn and grow

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Setup

```bash
# Clone repository
git clone https://github.com/fruitsfromdahood/ffdh-next.git
cd ffdh-next

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start development
npm run dev
```

## Development Workflow

### 1. Create a Branch

```bash
# Update main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Or bugfix
git checkout -b bugfix/issue-description
```

### 2. Make Changes

Follow our code style:

- **Naming**: `PascalCase` for components, `camelCase` for functions
- **Formatting**: Use Prettier (`npm run format`)
- **Linting**: Use ESLint (`npm run lint`)
- **Testing**: Write tests for new features

### 3. Commit

```bash
# Stage changes
git add .

# Commit with clear message
git commit -m "feat: Add new feature description"

# Common prefixes:
# feat: New feature
# fix: Bug fix
# docs: Documentation
# style: Code style
# refactor: Code refactor
# test: Tests
# chore: Maintenance
```

### 4. Push and Create PR

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create Pull Request on GitHub
# - Clear title
# - Description of changes
# - Related issues (closes #123)
# - Screenshots (if UI changes)
```

## Code Style

### TypeScript

```typescript
// ✅ Good
export interface User {
  id: string
  name: string
  email: string
}

export function createUser(data: Omit<User, 'id'>): User {
  return {
    id: crypto.randomUUID(),
    ...data,
  }
}

// ❌ Bad
export function createUser(data) {
  return { id: Math.random(), ...data }
}
```

### Components

```typescript
// ✅ Good
interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
}

export function Button({ label, onClick, disabled }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
}

// ❌ Bad
export default function btn(props) {
  return <button {...props}>{props.txt}</button>
}
```

### Styling

```typescript
// ✅ Use Tailwind classes
<div className="flex items-center gap-4 p-6 bg-black rounded-lg">
  {/* content */}
</div>

// ❌ Avoid inline styles
<div style={{ display: 'flex', gap: '16px', padding: '24px' }}>
  {/* content */}
</div>
```

## Testing

### Write Tests

```typescript
// src/utils/__tests__/validators.test.ts
import { isValidEmail } from '../validators'

describe('isValidEmail', () => {
  it('should return true for valid email', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
  })

  it('should return false for invalid email', () => {
    expect(isValidEmail('invalid')).toBe(false)
  })
})
```

### Run Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run with coverage
npm run test -- --coverage
```

## Documentation

### Update README

If adding features, update relevant sections in README.md:

```markdown
## New Feature

### Usage

```typescript
import { newFeature } from '@/lib/feature'

newFeature()
```

### Examples

- Example 1
- Example 2
```

### Update API Docs

If adding API endpoints, update `docs/API.md`:

```markdown
### New Endpoint

**POST /api/new-endpoint**

...
```

## Before Submitting PR

- [ ] Code compiles: `npm run build`
- [ ] Tests pass: `npm run test`
- [ ] Linting passes: `npm run lint`
- [ ] TypeScript: `npm run type-check`
- [ ] Changes documented
- [ ] Commit messages are clear
- [ ] No console.logs left
- [ ] No unused imports

## Common Tasks

### Add a New Route

```bash
# Create directory
mkdir -p app/new-route

# Create page
touch app/new-route/page.tsx
```

### Add a New Component

```bash
# Create file
touch src/components/NewComponent.tsx

# Write component
```

### Add a New Utility

```bash
# Create file
touch src/utils/newUtil.ts

# Write functions
```

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update specific package
npm update package-name

# Update all
npm update
```

## Getting Help

- 💬 **Discord**: [Join our community](https://discord.gg/ffdh)
- 📧 **Email**: `dev@fruitsfromdahood.pl`
- 🐛 **Issues**: [GitHub Issues](https://github.com/fruitsfromdahood/ffdh-next/issues)
- 📖 **Docs**: [Documentation](./docs)

## Recognition

Contributors will be recognized in:
- README.md
- GitHub contributors page
- Release notes

Thank you for contributing! 🍉✨

---

**Last Updated**: 2025-01-01
