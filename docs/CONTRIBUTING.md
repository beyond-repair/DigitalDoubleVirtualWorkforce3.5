# Contributing Guidelines

## Directory Structure
```
├── .github/
│   └── workflows/      # CI/CD configurations
├── src/
│   ├── core/          # Core functionality
│   ├── modules/       # Feature modules
│   └── utils/         # Shared utilities
├── tests/             # Test suites
├── docs/              # Documentation
└── scripts/           # Build and utility scripts
```

## Development Workflow

### Branch Naming
- feature/<issue-id>-description
- bugfix/<issue-id>-description
- release/v<version>

### Commit Messages
Format: `<type>(<scope>): <subject>`

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- test: Adding tests
- refactor: Code refactoring
- style: Formatting
- chore: Maintenance

### Pull Requests
1. Create feature branch
2. Make changes
3. Run tests
4. Update documentation
5. Submit PR
