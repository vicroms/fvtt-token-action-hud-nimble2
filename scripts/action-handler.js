/* eslint-disable no-undef */
// System Module Imports
import { GROUP } from './constants.js'
import { Utils } from './utils.js'

export let ActionHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
	/**
	 * Extends Token Action HUD Core's ActionHandler class and builds system-defined actions for the HUD
	 */
	ActionHandler = class ActionHandler extends coreModule.api.ActionHandler {
		// Initialize actor and token variables
		actors = null
		actorType = null

		// Initialize items variable
		actorItems = null

		// Initialize group variables
		groupIds = null

		/**
		 * Build system actions
		 * Called by Token Action HUD Core
		 * @override
		 * @param {array} groupIds
		 */
		async buildSystemActions(groupIds) {
			this.actors = !this.actor ? this.#getActors() : [this.actor]
			this.actorType = this.actor?.type

			const knownActors = ['character', 'npc', 'minion', 'soloMonster']
			if (this.actorType && !knownActors.includes(this.actorType)) return

			// Settings
			this.showUnequippedItems = Utils.getSetting('showUnequippedItems')
			this.showItemQuantity = Utils.getSetting('showItemQuantity')
			this.showSpellTiers = Utils.getSetting('showSpellTiers')

			if (this.actor) {
				const sorted = coreModule.api.Utils.sortItemsByName(this.actor.items)
				this.actorItems = [...sorted.values()]
			}

			this.groupIds = groupIds

			if (this.actorType === 'character') {
				await this.#buildCharacterActions()
			} else if (['npc', 'minion', 'soloMonster'].includes(this.actorType)) {
				await this.#buildNpcActions()
			} else if (!this.actor) {
				this.#buildGroupActions()
			}
		}

		/**
		 * Build character actions
		 * @private
		 */
		async #buildCharacterActions() {
			await Promise.all([
				this.#buildAbilities(),
				this.#buildSavingThrows(),
				this.#buildSkills(),
				this.#buildSpells(),
				this.#buildInventory(),
				this.#buildFeatures(),
				this.#buildUtility()
			])
		}

		/**
		 * Build NPC actions
		 * @private
		 */
		async #buildNpcActions() {
			await Promise.all([
				this.#buildMonsterFeatures(),
				this.#buildNPCSpells(),
				this.#buildAbilities(),
				this.#buildSavingThrows(),
				this.#buildNpcUtility()
			])
		}

		/**
		 * Build group actions (multiple tokens selected, no specific actor)
		 * @private
		 */
		#buildGroupActions() {
			this.#buildAbilities()
			this.#buildSavingThrows()
		}

		/**
		 * Get actors from controlled tokens
		 * @private
		 * @returns {Array} Array of actors
		 */
		#getActors() {
			const knownActors = ['character', 'npc', 'minion', 'soloMonster']
			return canvas.tokens.controlled
				.filter((token) => knownActors.includes(token.actor?.type))
				.map((token) => token.actor)
		}

		/**
		 * Build ability check actions
		 * @private
		 */
		async #buildAbilities() {
			const actionType = 'abilityCheck'
			const abilityKeys = ['strength', 'dexterity', 'intelligence', 'will']
			const actions = abilityKeys.map((key) => {
				const label = coreModule.api.Utils.i18n(`NIMBLE.abilityScores.${key}`)
				let info1 = null
				if (this.actor?.system?.abilities?.[key]) {
					const mod = this.actor.system.abilities[key].mod
					info1 = {
						text: coreModule.api.Utils.getModifier(mod),
						title: `${label}: ${coreModule.api.Utils.getModifier(mod)}`
					}
				}
				return {
					id: `${actionType}-${key}`,
					name: label,
					system: { actionType, actionId: key },
					info1
				}
			})

			this.addActions(actions, GROUP.abilities)
		}

		/**
		 * Build saving throw actions
		 * @private
		 */
		async #buildSavingThrows() {
			const actionType = 'savingThrow'
			const saveKeys = ['strength', 'dexterity', 'intelligence', 'will']
			const actions = saveKeys.map((key) => {
				const label = coreModule.api.Utils.i18n(`NIMBLE.savingThrows.${key}`)
				const action = {
					id: `${actionType}-${key}`,
					name: label,
					system: { actionType, actionId: key }
				}

				const saveData = this.actor?.system?.savingThrows?.[key]
				if (saveData) {
					const mod = saveData.mod ?? 0
					action.info1 = {
						text: coreModule.api.Utils.getModifier(mod),
						title: `${label}: ${coreModule.api.Utils.getModifier(mod)}`
					}

					const rollMode = saveData.defaultRollMode ?? 0
					if (rollMode !== 0) {
						action.info2 = {
							text: rollMode > 0 ? '▲' : '▼',
							title: rollMode > 0
								? coreModule.api.Utils.i18n('NIMBLE.abilityScoreTooltips.advantageOnSave')
								: coreModule.api.Utils.i18n('NIMBLE.abilityScoreTooltips.disadvantageOnSave')
						}
					}
				}

				return action
			})

			this.addActions(actions, GROUP.savingThrows)
		}

		/**
		 * Build skill check actions
		 * @private
		 */
		async #buildSkills() {
			const actionType = 'skill'
			const skillKeys = [
				'arcana', 'examination', 'influence', 'insight', 'might',
				'lore', 'naturecraft', 'perception', 'finesse', 'stealth'
			]
			const actions = skillKeys.map((key) => {
				const label = coreModule.api.Utils.i18n(`NIMBLE.skills.${key}`)
				let info1 = null
				if (this.actor?.system?.skills?.[key]) {
					const mod = this.actor.system.skills[key].mod
					info1 = {
						text: coreModule.api.Utils.getModifier(mod),
						title: `${label}: ${coreModule.api.Utils.getModifier(mod)}`
					}
				}
				return {
					id: `${actionType}-${key}`,
					name: label,
					system: { actionType, actionId: key },
					info1
				}
			})

			this.addActions(actions, GROUP.skills)
		}

		/**
		 * Build spell actions, grouped by tier
		 * @private
		 */
		async #buildSpells() {
			if (!this.actorItems) return

			const spells = this.actorItems.filter((item) => item.type === 'spell')
			if (spells.length === 0) return

			const actionType = 'spell'

			if (this.showSpellTiers) {
				const activeTiers = [...new Set(spells.map((s) => s.system?.tier ?? 0))]
				activeTiers.sort((a, b) => a - b)

				for (const tier of activeTiers) {
					const tierGroupId = `tier${tier}`
					const tierGroupName = coreModule.api.Utils.i18n(`NIMBLE.spells.tierHeadings.tier${tier}`)

					const tierGroupData = {
						id: tierGroupId,
						name: tierGroupName,
						type: 'system-derived'
					}

					const tierSpells = spells.filter((s) => (s.system?.tier ?? 0) === tier)
					const actions = tierSpells.map((spell) => ({
						id: `${actionType}-${spell.id}`,
						name: spell.name,
						img: coreModule.api.Utils.getImage(spell),
						system: { actionType, actionId: spell.id }
					}))

					this.addGroup(tierGroupData, GROUP.spells)
					this.addActions(actions, tierGroupData)
				}
			} else {
				const actions = spells.map((spell) => ({
					id: `${actionType}-${spell.id}`,
					name: spell.name,
					img: coreModule.api.Utils.getImage(spell),
					system: { actionType, actionId: spell.id }
				}))
				this.addActions(actions, GROUP.spells)
			}
		}

		/**
		 * Build NPC spell actions
		 * @private
		 */
		async #buildNPCSpells() {
			if (!this.actorItems) return

			const spells = this.actorItems.filter((item) => item.type === 'spell')
			if (spells.length === 0) return

			const actionType = 'spell'
			const actions = spells.map((spell) => ({
				id: `${actionType}-${spell.id}`,
				name: spell.name,
				img: coreModule.api.Utils.getImage(spell),
				system: { actionType, actionId: spell.id }
			}))
			this.addActions(actions, GROUP.spells)
		}

		/**
		 * Build inventory actions (objects)
		 * @private
		 */
		async #buildInventory() {
			if (!this.actorItems) return

			const objects = this.actorItems.filter((item) => {
				if (item.type !== 'object') return false
				if (!this.showUnequippedItems && item.system?.equipped === false) return false
				return true
			})
			if (objects.length === 0) return

			const actionType = 'item'
			const actions = objects.map((item) => {
				const action = {
					id: `${actionType}-${item.id}`,
					name: item.name,
					img: coreModule.api.Utils.getImage(item),
					system: { actionType, actionId: item.id }
				}

				if (this.showItemQuantity && item.system?.quantity > 1) {
					action.info1 = { text: `${item.system.quantity}` }
				}

				if (item.system?.equipped) {
					action.cssClass = 'toggle active'
				}

				return action
			})

			this.addActions(actions, GROUP.inventory)
		}

		/**
		 * Build feature actions (class features, ancestry, background, boons)
		 * @private
		 */
		async #buildFeatures() {
			if (!this.actorItems) return

			const featureItemTypes = ['feature', 'ancestry', 'background', 'boon', 'class', 'subclass']
			const features = this.actorItems.filter((item) => featureItemTypes.includes(item.type))
			if (features.length === 0) return

			const actionType = 'feature'
			const actions = features.map((item) => ({
				id: `${actionType}-${item.id}`,
				name: item.name,
				img: coreModule.api.Utils.getImage(item),
				system: { actionType, actionId: item.id }
			}))

			this.addActions(actions, GROUP.features)
		}

		/**
		 * Build monster feature actions, grouped by subtype
		 * @private
		 */
		async #buildMonsterFeatures() {
			if (!this.actorItems) return

			const monsterFeatures = this.actorItems.filter((item) => item.type === 'monsterFeature')
			if (monsterFeatures.length === 0) return

			const actionType = 'monsterFeature'

			// Group by subtype using derived groups
			const subtypes = [...new Set(monsterFeatures.map((f) => f.system?.subtype ?? 'feature'))]

			for (const subtype of subtypes) {
				const subtypeLabel = coreModule.api.Utils.i18n(`NIMBLE.monsterFeatureTypes.${subtype}`)
				const subtypeGroupData = {
					id: `monsterFeature-${subtype}`,
					name: subtypeLabel,
					type: 'system-derived'
				}

				const subtypeFeatures = monsterFeatures.filter((f) => (f.system?.subtype ?? 'feature') === subtype)
				const actions = subtypeFeatures.map((item) => ({
					id: `${actionType}-${item.id}`,
					name: item.name,
					img: coreModule.api.Utils.getImage(item),
					system: { actionType, actionId: item.id }
				}))

				this.addGroup(subtypeGroupData, GROUP.monsterFeatures)
				this.addActions(actions, subtypeGroupData)
			}
		}

		/**
		 * Build utility actions (initiative, inspiration, mana info)
		 * @private
		 */
		async #buildUtility() {
			const actionType = 'utility'
			const actions = []

			// Initiative
			actions.push({
				id: 'initiative',
				name: coreModule.api.Utils.i18n('tokenActionHud.nimble.initiative'),
				system: { actionType, actionId: 'initiative' }
			})

			// Inspiration toggle (characters only)
			if (this.actor?.system?.resources?.inspiration !== undefined) {
				const hasInspiration = this.actor.system.resources.inspiration
				actions.push({
					id: 'inspiration',
					name: coreModule.api.Utils.i18n('tokenActionHud.nimble.inspiration'),
					system: { actionType, actionId: 'inspiration' },
					cssClass: hasInspiration ? 'toggle active' : 'toggle'
				})
			}

			// Mana info (characters with mana)
			if (this.actor?.system?.resources?.mana) {
				const mana = this.actor.system.resources.mana
				const current = mana.current ?? mana.value ?? 0
				const max = mana.max ?? 0
				actions.push({
					id: 'mana',
					name: coreModule.api.Utils.i18n('tokenActionHud.nimble.mana'),
					system: { actionType, actionId: 'mana' },
					info1: { text: `${current}/${max}` }
				})
			}

			this.addActions(actions, GROUP.utility)
		}

		/**
		 * Build NPC utility actions (initiative only)
		 * @private
		 */
		async #buildNpcUtility() {
			const actionType = 'utility'
			const actions = [{
				id: 'initiative',
				name: coreModule.api.Utils.i18n('tokenActionHud.nimble.initiative'),
				system: { actionType, actionId: 'initiative' }
			}]

			this.addActions(actions, GROUP.utility)
		}
	}
})
