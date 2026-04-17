/* eslint-disable no-undef */
import { MODULE } from './constants.js'

/**
 * Register module settings
 * Called by Token Action HUD Core to register Token Action HUD system module settings
 * @param {function} coreUpdate Token Action HUD Core update function
 */
export function register(coreUpdate) {
	game.settings.register(MODULE.ID, 'hideMonsterFeatures', {
		name: game.i18n.localize(
			'tokenActionHud.nimble.setting.hideMonsterFeatures.name'
		),
		hint: game.i18n.localize(
			'tokenActionHud.nimble.setting.hideMonsterFeatures.hint'
		),
		scope: 'world',
		config: true,
		type: Boolean,
		default: true,
		onChange: (value) => {
			coreUpdate(value)
		}
	})

	game.settings.register(MODULE.ID, 'showSpellTiers', {
		name: game.i18n.localize(
			'tokenActionHud.nimble.setting.showSpellTiers.name'
		),
		hint: game.i18n.localize(
			'tokenActionHud.nimble.setting.showSpellTiers.hint'
		),
		scope: 'client',
		config: true,
		type: Boolean,
		default: true,
		onChange: (value) => {
			coreUpdate(value)
		}
	})

	game.settings.register(MODULE.ID, 'showUnequippedItems', {
		name: game.i18n.localize(
			'tokenActionHud.nimble.setting.showUnequippedItems.name'
		),
		hint: game.i18n.localize(
			'tokenActionHud.nimble.setting.showUnequippedItems.hint'
		),
		scope: 'client',
		config: true,
		type: Boolean,
		default: true,
		onChange: (value) => {
			coreUpdate(value)
		}
	})

	game.settings.register(MODULE.ID, 'showItemQuantity', {
		name: game.i18n.localize(
			'tokenActionHud.nimble.setting.showItemQuantity.name'
		),
		hint: game.i18n.localize(
			'tokenActionHud.nimble.setting.showItemQuantity.hint'
		),
		scope: 'client',
		config: true,
		type: Boolean,
		default: true,
		onChange: (value) => {
			coreUpdate(value)
		}
	})
}
