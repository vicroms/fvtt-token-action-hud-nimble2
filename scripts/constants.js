/**
 * Module-based constants
 */
export const MODULE = {
	ID: 'token-action-hud-nimble2'
}

/**
 * Core module
 */
export const CORE_MODULE = {
	ID: 'token-action-hud-core'
}

/**
 * Core module version required by the system module
 */
export const REQUIRED_CORE_MODULE_VERSION = '2.0'

/**
 * Action types
 */
export const ACTION_TYPE = {
	abilityCheck: 'tokenActionHud.nimble.abilityCheck',
	savingThrow: 'tokenActionHud.nimble.savingThrow',
	skill: 'tokenActionHud.nimble.skill',
	spell: 'TYPES.Item.spell',
	item: 'TYPES.Item.object',
	feature: 'TYPES.Item.feature',
	monsterFeature: 'TYPES.Item.monsterFeature',
	utility: 'tokenActionHud.utility',
	initiative: 'tokenActionHud.nimble.initiative'
}

/**
 * Groups
 */
export const GROUP = {
	abilities: { id: 'abilities', name: 'tokenActionHud.nimble.abilities', type: 'system' },
	savingThrows: { id: 'savingThrows', name: 'tokenActionHud.nimble.savingThrows', type: 'system' },
	skills: { id: 'skills', name: 'tokenActionHud.nimble.skills', type: 'system' },
	spells: { id: 'spells', name: 'NIMBLE.sheet.spells', type: 'system' },
	inventory: { id: 'inventory', name: 'NIMBLE.sheet.inventory', type: 'system' },
	features: { id: 'features', name: 'NIMBLE.sheet.features', type: 'system' },
	monsterFeatures: { id: 'monsterFeatures', name: 'tokenActionHud.nimble.monsterFeatures', type: 'system' },
	utility: { id: 'utility', name: 'tokenActionHud.utility', type: 'system' }
}
