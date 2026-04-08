---
inclusion: always
---

# Publish Workflow

When the user says "publish" or indicates a project is complete, execute ALL steps below automatically in order. Do NOT ask for confirmation between steps UNLESS a file size issue or build error is found — in that case, stop and wait for input.

## 1. CLEAN THE CODE

- Remove all `console.log` statements
- Remove all `TODO`, `FIXME`, `HACK`, `temp`, `test` comments
- Remove all `debugger` statements
- Remove dead/unused code and commented-out code blocks
- Remove unprofessional language from comments (e.g. "not sure if this works", "lol", "idk why but this fixes it")
- Ensure all variable and function names are descriptive and professional

## 2. FILE SIZE AND VERCEL COMPATIBILITY CHECK

Scan every file in the project and:

- Flag any single file exceeding 100KB
- Flag any asset (image, video, font) over 5MB
- Check total project size does not exceed 100MB

If any file is too large, STOP and notify the user with the exact file name, its size, and specific reduction options (split modules, compress images, CDN, lazy loading, etc). Do NOT proceed to GitHub until the user confirms fixes are done.

## 3. VERCEL DEPLOYMENT READINESS CHECK

Scan the codebase and fix or flag:

- Missing or misconfigured `vercel.json` — create one if absent
- Environment variables used in code but missing from `.env.example`
- Hardcoded `localhost` URLs — replace with environment variable references
- Build errors — run the build command and confirm it exits with 0 errors
- Broken imports or missing dependencies in `package.json`
- Node.js APIs not supported in Vercel Edge Runtime

Fix automatically where possible. If a fix requires user input, list each issue and wait for confirmation before continuing.

## 4. CREATE GITHUB REPO

Using GitHub MCP tools:

- Create a new public repository named after the current project folder
- Add a short professional description of what the project does

## 5. GENERATE README.md

Write a detailed `README.md` with:

- Project name and purpose
- Tech stack
- Full file/folder structure with explanation of each file's role
- Step-by-step install and local run instructions
- Key code decisions and why certain approaches were chosen
- Environment variables required (reference `.env.example`)
- Vercel deployment instructions including env vars to set in the dashboard

Use professional language throughout. No casual or vague wording.

## 6. COMMIT AND PUSH

- Stage all files
- Confirm `.env` is in `.gitignore` and will not be committed
- Commit message: `feat: initial release`
- Push everything to the new GitHub repo
