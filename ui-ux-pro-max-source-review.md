# UI/UX Pro Max Skill — source review

## 2026-08-14: initial provenance check

The user supplied `https://ui-ux-pro-max-skill.com/`. The public landing page describes an installation command for Claude Code and links to the public GitHub repository `nextlevelbuilder/ui-ux-pro-max-skill`. The landing page identifies itself as an unofficial multilingual translation site, so the GitHub repository is being treated as the authoritative source for package structure, license, and installation materials.

The linked repository is publicly accessible. Its visible repository metadata identifies an MIT license and includes a `.claude/skills` directory, a Claude plugin manifest, source and documentation directories. No scripts, package managers, plugins, or downloaded code have been run. The next step is read-only inspection of the repository contents to identify whether a Manus-compatible standalone skill can be created without executing third-party code.

## Safety boundary

- Do not execute any code, install dependencies, use repository scripts, or configure external credentials.
- Do not copy third-party claims into product code.
- Use only content that can be reviewed as text and validate any converted local skill with the official local validator.

## 2026-08-14: local installation result

The official `ui-ux-pro-max` skill directory was copied as a local Manus skill at `/home/ubuntu/skills/ui-ux-pro-max`. The installation retains the source data catalog, references, search scripts, and MIT license notice, but excludes the upstream test suite and template artifacts because they are not needed for ordinary skill use.

The skill instructions were adapted only to replace the upstream Claude plugin-root path with the local Manus skill path. The official Manus quick validator returned `Skill is valid!`. No upstream scripts, dependency installers, tests, or external integrations were executed.
