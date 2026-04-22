# Token Action HUD Nimble

A FoundryVTT module that provides a Token Action HUD for the Nimble RPG system.

## Requirements

- FoundryVTT v13
- [Nimble RPG System](https://github.com/vicroms/FoundryVTT-Nimble) v0.8.0+
- [Token Action HUD Core](https://github.com/Larkinabout/fvtt-token-action-hud-core) v2.0+

## Features

- Quick access to ability checks (Strength, Dexterity, Intelligence, Will)
- Saving throw actions
- Skill checks (Arcana, Examination, Influence, Insight, Might, Lore, Naturecraft, Perception, Finesse, Stealth)
- Spell casting grouped by tier
- Inventory management grouped by item type
- Feature activation (class, ancestry, background, boon features)
- NPC/Minion/Solo Monster feature actions grouped by subtype
- Initiative rolling and utility actions

## Installation

1. Install [Token Action HUD Core](https://github.com/Larkinabout/fvtt-token-action-hud-core) if you haven't already.
2. In Foundry VTT, go to **Add-on Modules** → **Install Module** and use this manifest URL:
   ```
   https://github.com/vicroms/fvtt-token-action-hud-nimble2/releases/latest/download/module.json
   ```
3. Enable the module in your world's module settings.

## Development

```bash
npm install
npm run build
```

### Branching Workflow

- **Feature branches** are created off `dev` for new work.
- Features are **squash merged** into `dev` when ready.
- `dev` is **merged** into `main` (preserving history) for releases.
- Release tags are created on `main`.

### Creating a Release

1. Merge `dev` into `main`:
   ```bash
   git checkout main
   git merge dev
   git push origin main
   ```
2. Go to the [Releases page](https://github.com/vicroms/fvtt-token-action-hud-nimble2/releases/new) on GitHub.
3. Create a new release:
   - **Tag**: Create a new tag with the version (e.g., `v0.2.0`).
   - **Target**: `main`
   - **Title**: e.g., `Token Action HUD Nimble v0.2.0`
   - **Description**: Add release notes describing changes.
4. Click **Publish release**.
5. The GitHub Actions workflow will automatically:
   - Substitute the version, manifest URL, and download URL in `module.json`.
   - Build the minified bundle.
   - Create and attach `module.json` and `module.zip` to the release.

## License

This module is licensed under the [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/) and the [Foundry Virtual Tabletop EULA](https://foundryvtt.com/article/license/).

## Attribution

This module is built upon and extends:

- **[Token Action HUD Core](https://github.com/Larkinabout/fvtt-token-action-hud-core)** by Larkinabout, Drental, and ^ and stick — licensed under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)
- **[Token Action HUD Shadowdark](https://github.com/chrpow/fvtt-token-action-hud-shadowdark)** by Larkinabout and chrpow — used as a reference implementation

This module is designed for use with:

- **[Nimble RPG System](https://github.com/vicroms/FoundryVTT-Nimble)** for Foundry VTT
