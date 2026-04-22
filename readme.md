# Token Action HUD Nimble

A FoundryVTT module that provides a Token Action HUD for the Nimble RPG system.

## Requirements

- FoundryVTT v13
- [Nimble RPG System](https://github.com/Nimble-Co/FoundryVTT-Nimble) v0.8.0+
- [Token Action HUD Core](https://github.com/Larkinabout/fvtt-token-action-hud-core) v2.0+

## Features

- Attack actions with subcategories (all actions with damage dealing effects)
- Ability checks (Strength, Dexterity, Intelligence, Will)
- Saving throws with advantage/disadvantage indicators
- Skill checks (Arcana, Examination, Influence, Insight, Might, Lore, Naturecraft, Perception, Finesse, Stealth)
- Spells grouped by tier
- Inventory grouped by item type
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

## License

This module is licensed under the [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/) and the [Foundry Virtual Tabletop EULA](https://foundryvtt.com/article/license/).

## Attribution

This module is built upon and extends:

- **[Token Action HUD Core](https://github.com/Larkinabout/fvtt-token-action-hud-core)** — licensed under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)
- **[Token Action HUD Shadowdark](https://github.com/chrpow/fvtt-token-action-hud-shadowdark)** — used as a reference implementation

This module is designed for use with:

- **[Nimble RPG System](https://github.com/Nimble-Co/FoundryVTT-Nimble)** for Foundry VTT
