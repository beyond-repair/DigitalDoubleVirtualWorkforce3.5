# Git Commit Message Hook

This repository contains a Git hook setup that enforces commit message standards to maintain consistent and meaningful commit history.

## Features

- Prevents empty commit messages
- Enforces a minimum commit message length of 10 characters
- Validates commit messages through a pre-commit hook

## Setup

1. The hook is located in `.git/hooks/commit-msg`

2. Make sure the hook is executable:

   ```bash
   chmod +x .git/hooks/commit-msg
   ```

3. The hook is automatically triggered when you make a commit

## Configuration

The repository uses the following Git configuration (in `.gitconfig`):

```properties
[core]
    editor = "C:\\Users\\willi\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe" --wait
[commit]
    template = .gitmessage
[hook]
    validatecommit = true
```

## Commit Message Rules

1. Commit messages cannot be empty

2. Commit messages must be at least 10 characters long

3. The hook will reject commits that don't meet these criteria

## Troubleshooting

If you encounter fork-related errors on Windows:

- Use Git Bash instead of CMD

- Check system resources

- Verify antivirus isn't blocking hook execution

- Ensure proper line endings (LF, not CRLF)

## Contributing

When contributing to this repository, please ensure your commit messages follow the above guidelines.
