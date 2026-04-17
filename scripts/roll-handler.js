/* eslint-disable no-undef */
import { Utils } from './utils.js'
export let RollHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
	/**
	 * Extends Token Action HUD Core's RollHandler class and handles action events triggered when an action is clicked
	 */
	RollHandler = class RollHandler extends coreModule.api.RollHandler {
		/**
		 * Handle action event
		 * Called by Token Action HUD Core when an action event is triggered
		 * @override
		 * @param {object} event The event
		 */
		async handleActionClick(event) {
			const { actionType, actionId } = this.action.system

			const knownActors = ['character', 'npc', 'minion', 'soloMonster']

			// If single actor is selected
			if (this.actor) {
				await this.#handleAction(event, this.actor, actionType, actionId)
				return
			}

			// If multiple actors are selected
			const controlledTokens = canvas.tokens.controlled
				.filter((token) => knownActors.includes(token.actor?.type))

			for (const token of controlledTokens) {
				const actor = token.actor
				await this.#handleAction(event, actor, actionType, actionId)
			}
		}

		/**
		 * Handle action
		 * @private
		 * @param {object} event      The event
		 * @param {object} actor      The actor
		 * @param {string} actionType The action type
		 * @param {string} actionId   The action ID
		 */
		async #handleAction(event, actor, actionType, actionId) {
			switch (actionType) {
				case 'abilityCheck':
					await this.#handleAbilityCheck(event, actor, actionId)
					break
				case 'savingThrow':
					await this.#handleSavingThrow(event, actor, actionId)
					break
				case 'skill':
					await this.#handleSkillCheck(event, actor, actionId)
					break
				case 'spell':
					await this.#handleItemAction(event, actor, actionId)
					break
				case 'item':
					await this.#handleItemAction(event, actor, actionId)
					break
				case 'feature':
					await this.#handleItemAction(event, actor, actionId)
					break
				case 'monsterFeature':
					await this.#handleMonsterFeatureAction(event, actor, actionId)
					break
				case 'heroicAction':
					await this.#handleHeroicAction(actor, actionId)
					break
				case 'heroicReaction':
					await this.#handleHeroicReaction(actor, actionId)
					break
				case 'utility':
					await this.#handleUtilityAction(event, actor, actionId)
					break
			}
		}

		/**
		 * Handle ability check action
		 * @private
		 * @param {object} event    The event
		 * @param {object} actor    The actor
		 * @param {string} actionId The ability key (strength, dexterity, intelligence, will)
		 */
		async #handleAbilityCheck(event, actor, actionId) {
			await actor.rollAbilityCheckToChat(actionId, { fastForward: event.shiftKey })
		}

		/**
		 * Handle saving throw action
		 * @private
		 * @param {object} event    The event
		 * @param {object} actor    The actor
		 * @param {string} actionId The save key
		 */
		async #handleSavingThrow(event, actor, actionId) {
			await actor.rollSavingThrowToChat(actionId, { fastForward: event.shiftKey })
		}

		/**
		 * Handle skill check action
		 * @private
		 * @param {object} event    The event
		 * @param {object} actor    The actor
		 * @param {string} actionId The skill key
		 */
		async #handleSkillCheck(event, actor, actionId) {
			if (typeof actor.rollSkillCheckToChat === 'function') {
				await actor.rollSkillCheckToChat(actionId, { fastForward: event.shiftKey })
			}
		}

		/**
		 * Handle item activation (spells, objects, features)
		 * @private
		 * @param {object} event    The event
		 * @param {object} actor    The actor
		 * @param {string} actionId The item ID
		 */
		async #handleItemAction(event, actor, actionId) {
			if (this.isRenderItem()) {
				return this.renderItem(actor, actionId)
			}
			await actor.activateItem(actionId, { fastForward: event.shiftKey })
		}

		/**
		 * Handle monster feature action
		 * @private
		 * @param {object} event    The event
		 * @param {object} actor    The actor
		 * @param {string} actionId The item ID
		 */
		async #handleMonsterFeatureAction(event, actor, actionId) {
			if (this.isRenderItem()) {
				return this.renderItem(actor, actionId)
			}
			const hideFeatures = Utils.getSetting('hideMonsterFeatures')
			await actor.activateItem(actionId, {
				fastForward: event.shiftKey,
				visibilityMode: hideFeatures ? 'selfroll' : undefined
			})
		}

		/**
		 * Handle heroic action
		 * @private
		 * @param {object} actor    The actor
		 * @param {string} actionId The heroic action ID (attack, castSpell, move, assess)
		 */
		async #handleHeroicAction(actor, actionId) {
			const macro = CONFIG.NIMBLE?.macros?.activateHeroicActionMacro
			if (typeof macro === 'function') {
				await macro(actionId, 'action')
			}
		}

		/**
		 * Handle heroic reaction
		 * @private
		 * @param {object} actor    The actor
		 * @param {string} actionId The heroic reaction ID (defend, interpose, opportunityAttack, help)
		 */
		async #handleHeroicReaction(actor, actionId) {
			const macro = CONFIG.NIMBLE?.macros?.activateHeroicActionMacro
			if (typeof macro === 'function') {
				await macro(actionId, 'reaction')
			}
		}

		/**
		 * Handle utility action
		 * @private
		 * @param {object} event    The event
		 * @param {object} actor    The actor
		 * @param {string} actionId The utility action ID
		 */
		async #handleUtilityAction(event, actor, actionId) {
			switch (actionId) {
				case 'initiative':
					await actor.rollInitiativeToChat({ fastForward: event.shiftKey })
					break
				case 'inspiration': {
					const current = actor.system?.resources?.inspiration ?? false
					await actor.update({ 'system.resources.inspiration': !current })
					break
				}
				case 'mana':
					// Open character sheet to mana section (no-op — informational display)
					break
			}
		}
	}
})
