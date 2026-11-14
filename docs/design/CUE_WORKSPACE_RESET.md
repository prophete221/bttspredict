# Cue — mandatory clean-workspace reset (BTTSPredict redesign)

This instruction is mandatory before any design or implementation work.

## Objective

Prevent contamination from Cue's previous local workspace, generated mockups, cached design decisions, local prototypes, screenshots, CSS, components, or remembered visual templates. The only approved design source is:

- `docs/design/BTTSPREDICT_DESIGN_SYSTEM.md`
- this reset instruction

The active implementation branch is:
`rebuild/vision221-premium-design-2026-11-14`

## Required reset procedure

1. Stop all running dev servers, agents, watchers, and background tasks for this repository.
2. Preserve any work only if it contains independently verified business logic or data that the owner explicitly asks to retain. Do not preserve prior visual work.
3. Remove Cue's previous local project workspace and local generated design artifacts, then create a fresh checkout/clone of the repository directly on `rebuild/vision221-premium-design-2026-11-14`.
4. Do not copy, restore, cherry-pick, import, or reference any local files from the previous workspace.
5. Do not reuse previous mockup screenshots, Figma exports, generated images, HTML prototypes, component styling, CSS, Tailwind tokens, design prompts, or page layouts.
6. Do not use the old Cue branch/PR as a design source. The abandoned PR #128 is not the baseline.
7. After the fresh checkout, verify the working tree is clean and the current branch is exactly `rebuild/vision221-premium-design-2026-11-14`.
8. Read the authoritative design brief before opening or modifying UI files.
9. Audit existing source only for functional contracts that must be preserved: routes, metadata, APIs, data models, prediction logic, auth, VIP/payment flows, affiliate destinations and tracking. Existing appearance is not a design reference.
10. Create new design tokens, page compositions and components from the approved brief. Document each new design file before implementation.

## Safety: what must NOT be deleted

Do not delete or reset:
- the GitHub repository or remote branches;
- production data, databases, migrations, secrets, environment variables, or cloud resources;
- source data, fixtures, prediction history, partner URLs or business logic;
- shared user files or unrelated projects.

The reset applies to Cue's disposable local workspace and previous visual artifacts only. Never run destructive commands against a production environment.

## Required proof before coding

Cue must report:
- confirmation that the old local workspace and visual artifacts were discarded;
- the fresh checkout path and branch name;
- clean working-tree status;
- confirmation that the two approved design documents were read;
- a list of functional files inspected strictly for preservation requirements.

If Cue cannot delete its own local workspace, it must say so plainly and request an operator with access to do the reset. It must not silently continue using the old workspace.

## Hard prohibition

Do not begin redesign work until the reset and proof above are complete. Do not substitute the abandoned design with a lightly recolored or retitled version. Build a genuinely new BTTSPredict interface from the approved brief.
