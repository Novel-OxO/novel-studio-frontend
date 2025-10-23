# Smart Git Commit

Automatically analyze staged changes and generate a meaningful commit message based on the diff.

## Usage
- `/commit` - Analyze changes and create a commit with auto-generated message

## Instructions

### 1. Check Staged Files
First, check if there are any staged files:

```bash
git diff --cached --name-only
```

**If no files are staged:**
- Ask the user if they want to stage files before committing
- Show the list of modified/untracked files using `git status`
- If user agrees, ask which files to stage or suggest staging all changes
- Stage the selected files using `git add`

**If files are already staged:**
- Proceed to the next step

### 2. Analyze Changes
Examine the staged changes to understand what was modified:

```bash
git diff --cached
```

Analyze the diff to identify:
- Type of change (feat, fix, refactor, docs, style, test, chore, etc.)
- Files affected
- Main purpose of the changes
- Breaking changes if any

### 3. Generate Commit Message
Based on the diff analysis, generate a commit message following the Conventional Commits format:

**IMPORTANT: All commit messages MUST be written in Korean.**

**Format:**
```
<type>: <subject in Korean>

<body in Korean (optional)>
```

**Type Options:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (dependencies, config, etc.)
- `perf`: Performance improvements

**Guidelines:**
- **Write subject and body in Korean (한국어로 작성)**
- Keep subject line under 50 characters
- Use imperative mood in Korean ("추가" not "추가했음")
- Don't capitalize the first letter of subject
- Don't end subject with a period
- Add body if changes need explanation (wrap at 72 characters)

**Example:**
```
feat: JWT 기반 사용자 인증 추가

로그인/로그아웃 엔드포인트를 포함한 JWT 인증 시스템 구현.
토큰 검증 및 리프레시 토큰 메커니즘을 위한 미들웨어 추가.
```

### 4. Show Commit Message to User
Display the generated commit message to the user and ask for confirmation or modifications.

### 5. Create Commit
After user approves the commit message, create the commit:

```bash
git commit -m "$(cat <<'EOF'
<generated commit message>
EOF
)"
```

### 6. Confirm Success
After successful commit:
- Show `git log -1 --oneline` to display the created commit
- Optionally show `git status` to show clean working tree

## Important Notes
- **ALL commit messages MUST be written in Korean (한국어)**
- Always analyze the actual diff content to generate accurate commit messages
- Don't commit if changes are unclear or risky (ask user for clarification)
- Follow Conventional Commits specification
- Keep commit messages clear and concise
- Ask for user confirmation before committing
