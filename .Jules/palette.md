## 2024-07-25 - The Perils of Over-Reaching Commits

**Learning:** Committing auto-generated files like `pnpm-lock.yaml` or unrelated configuration changes (e.g., `tsconfig.json`) alongside a focused UX improvement is a critical anti-pattern. It violates the principle of atomic commits, obscures the core change, and can introduce unintended side effects. My role is to make small, precise "strokes of excellence," not to refactor the studio's infrastructure.

**Action:** Before every submission, I will meticulously review the staged files. I will revert any changes to lockfiles, build artifacts, or configuration files that are not directly and explicitly part of the requested UX enhancement. If an infrastructure change is necessary, I will ask to perform it as a separate, dedicated task.
