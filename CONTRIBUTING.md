# Contributing to SmartElect

Thank you for contributing to SmartElect! Please review our guidelines to maintain our standards for Code Quality, Security, and Efficiency.

## Code Style Guide
- **TypeScript Strict Mode:** All code must be strictly typed.
- **JSDoc Blocks:** Required on every function, hook, and component.
- **No Magic Values:** Use `constants/index.ts` for all strings and numbers.
- **Error Handling:** Every async function must use `try/catch/finally`. No `.then().catch()` chains. Wrap sections in `ErrorBoundary`.
- **No console.log:** Only use our `logger.ts` utility.

## Adding a New Timeline Step
1. Open `src/constants/index.ts`.
2. Locate `ELECTION_STEPS`.
3. Add a new object conforming to the `ElectionStep` interface.
4. Add the appropriate translations for any new text if needed.

## Branch Naming
- `feature/description`
- `fix/description`
- `docs/description`

## PR Checklist
- [ ] Code passes all linting (`npm run lint` yields 0 warnings).
- [ ] Tests pass and coverage is above 80% (`npm run test:coverage`).
- [ ] No hardcoded API keys; `.env` keys managed via build substitutions.
- [ ] All inputs are sanitized using `sanitizeInput`.
- [ ] Responsive design works flawlessly at 375px.
- [ ] Accessible links implement `rel="noopener noreferrer"`.
