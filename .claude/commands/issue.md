# Create GitHub Issue

Create a new GitHub issue. The issue content must be written in Korean and include Background and Implementation Plan sections.

## Usage
- `/issue` - Create issue without labels
- `/issue enhancement,bug` - Create issue with labels (comma-separated)

## Instructions

### 1. Collect Issue Information from User
First, ask the user for the following information:
- Issue title
- Issue background (Why is this work necessary?)
- Implementation plan (How will it be implemented?)

### 2. Structure Issue Content
Use the following template to structure the issue body:

```markdown
## 배경
[Explain the background and necessity of this issue]

## 작업 계획
- [ ] [Task item 1]
- [ ] [Task item 2]
- [ ] [Task item 3]

## 참고사항
[Additional notes if any]
```

### 3. Handle Labels
- If labels are provided in `$ARGUMENTS`, use those labels
- If no labels are provided, analyze the issue content to suggest appropriate labels or create without labels

### 4. Create GitHub Issue
Use the `gh` CLI to create the issue:

```bash
gh issue create --title "Issue Title" --body "$(cat <<'EOF'
## 배경
...

## 작업 계획
...
EOF
)" --label "label1,label2"
```

### 5. Confirm Result
- Provide the created issue URL to the user
- Clearly display the issue number

## Important Notes
- All issue content MUST be written in Korean
- Background (배경) and Implementation Plan (작업 계획) sections are required
- Implementation plan must be written as a checklist format
- Use HEREDOC to maintain the exact formatting of the issue body
