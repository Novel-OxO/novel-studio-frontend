# Create Pull Request

Create a pull request to the main branch with automatic analysis of commits and related issue linking.

## Usage
- `/pr` - Create PR to main branch with issue selection

## Instructions

### 1. Check Current Branch and Status
First, verify the current branch and its status:

```bash
git branch --show-current
git status
```

**Checks:**
- Ensure we're not on the main branch
- Check if there are any uncommitted changes (warn user if found)
- Verify the branch has commits to push

### 2. Fetch Issue List
Fetch the list of open issues from the repository:

```bash
gh issue list --state open --limit 20 --json number,title,labels
```

**Display to user:**
- Show issue numbers with titles
- Include labels for context
- Ask user to select which issue(s) this PR relates to (can be multiple or none)

### 3. Analyze Commits
Get the list of commits that will be included in the PR:

```bash
git log main..HEAD --oneline
git diff main...HEAD
```

**Analyze:**
- Number of commits
- Files changed
- Overall purpose of the changes
- Type of changes (feature, bugfix, refactor, etc.)

### 4. Generate PR Title and Body
Based on the commits and selected issue(s), generate a PR description:

**PR Title Format:**
```
<type>: <brief description>
```

**PR Body Template:**
```markdown
## 개요
[Explain what this PR does in Korean]

## 변경사항
- [Change 1]
- [Change 2]
- [Change 3]

## 관련 이슈
- Closes #<issue-number>
- Related to #<issue-number>

## 테스트 계획
- [ ] [Test item 1]
- [ ] [Test item 2]

## 스크린샷 (선택사항)
[If applicable]
```

**Guidelines:**
- PR title can be in English with type prefix (feat, fix, refactor, etc.)
- PR body MUST be written in Korean
- Use "Closes #issue-number" if the PR resolves the issue completely
- Use "Related to #issue-number" if the PR is related but doesn't close the issue
- Include test plan as checklist items
- Add breaking changes section if applicable

### 5. Check Remote Branch
Check if the current branch is pushed to remote:

```bash
git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null
```

**If not pushed or not up to date:**
- Push the branch to remote with `-u` flag
```bash
git push -u origin <branch-name>
```

### 6. Create Pull Request
Use `gh` CLI to create the PR:

```bash
gh pr create \
  --base main \
  --title "PR Title" \
  --body "$(cat <<'EOF'
## 개요
...

## 변경사항
...

## 관련 이슈
...
EOF
)"
```

**If issue is selected:**
Add the issue number to link automatically

### 7. Confirm Success
After PR creation:
- Display the PR URL
- Show PR number
- Confirm which issue(s) are linked
- Optionally show PR status with `gh pr view`

## Important Notes
- **PR body MUST be written in Korean (한국어)**
- Always push commits before creating PR
- Link related issues using GitHub keywords (Closes, Fixes, Resolves, Related to)
- Base branch should always be `main`
- Include meaningful test plans
- Use HEREDOC to maintain exact formatting of the PR body
- Warn user if there are uncommitted changes before creating PR

## Example PR Body
```markdown
## 개요
사용자 인증 기능을 구현하여 JWT 기반 로그인/로그아웃이 가능하도록 합니다.

## 변경사항
- JWT 토큰 생성 및 검증 로직 추가
- 로그인/로그아웃 API 엔드포인트 구현
- 인증 미들웨어 추가
- 사용자 인증 상태 관리를 위한 Context 구현

## 관련 이슈
- Closes #12

## 테스트 계획
- [ ] 로그인 기능 테스트
- [ ] 로그아웃 기능 테스트
- [ ] 토큰 만료 시나리오 테스트
- [ ] 인증이 필요한 페이지 접근 테스트
```
