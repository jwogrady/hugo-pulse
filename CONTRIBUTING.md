# Contributing to hugo-pulse

## Commit messages: Conventional Commits

Every commit in this repository follows
[Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).
This is not a style preference: [Release Please](https://github.com/googleapis/release-please)
parses the commit history to decide the next version and to write `CHANGELOG.md`.
**A commit that does not parse is silently dropped from the changelog.**

### Format

```
<type>[optional scope][!]: <description>

[optional body]

[optional footer(s)]
```

- `<type>` is lowercase, from the table below.
- `<scope>` is optional and names the area touched, e.g. `feat(layouts):`.
- `<description>` is imperative mood, lowercase, no trailing period.
- Keep the subject line at 72 characters or less.

### Types and their release impact

| Type       | Changelog section       | Version bump |
| ---------- | ----------------------- | ------------ |
| `feat`     | Features                | minor        |
| `fix`      | Bug Fixes               | patch        |
| `perf`     | Performance             | patch        |
| `refactor` | Refactors               | none         |
| `docs`     | Documentation           | none         |
| `style`    | Styling                 | none         |
| `test`     | Tests                   | none         |
| `build`    | Build System            | none         |
| `ci`       | Continuous Integration  | none         |
| `chore`    | Chores                  | none         |

All types appear in the changelog, but only `feat`, `fix`, `perf` and breaking
changes trigger a release on their own.

### Breaking changes

Either append `!` after the type/scope, or add a `BREAKING CHANGE:` footer:

```
feat(layouts)!: drop support for Hugo below 0.146.0

BREAKING CHANGE: `layouts/_partials/` requires the new template lookup order.
```

While the theme is pre-1.0, a breaking change bumps the **minor** version.

### Forcing a specific version

Add a `Release-As:` footer to override the computed version:

```
feat: initial theme scaffold

Release-As: 0.0.0
```

### Examples

```
feat(header): add sticky navigation on scroll
fix(css): correct footer contrast in dark mode
docs: document the menu configuration options
chore(deps): bump release-please-action to v4
```

## Pull requests

- **Squash merge only.** A GitHub merge commit repeats the PR title in its body,
  and Release Please parses that as a second Conventional Commit — producing a
  duplicate changelog entry.
- The **PR title** becomes the squashed commit message, so the PR title itself
  must be a valid Conventional Commit.
- One version per merged PR.

## Release process

Releases are automated. On every push to `master`:

1. The `release-please` workflow opens or updates a release PR titled
   `chore: release <version>`, containing the `CHANGELOG.md` update and the
   version bump.
2. Squash-merging that PR tags `v<version>` and publishes the GitHub release.

Do not tag or edit `CHANGELOG.md` by hand.
