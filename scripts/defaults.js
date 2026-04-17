import { GROUP } from './constants.js'

/**
 * Default layout and groups
 */
export let DEFAULTS = null

// eslint-disable-next-line no-undef
Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
	const groups = GROUP

	Object.values(groups).forEach(group => {
		group.name = coreModule.api.Utils.i18n(group.name)
		group.listName = `Group: ${coreModule.api.Utils.i18n(group.listName ?? group.name)}`
	})
	const groupsArray = Object.values(groups)
	DEFAULTS = {
		layout: [
			{
				nestId: 'abilities',
				id: 'abilities',
				name: coreModule.api.Utils.i18n('tokenActionHud.nimble.abilities'),
				groups: [
					{ ...groups.abilities, nestId: 'abilities_abilities' }
				]
			},
			{
				nestId: 'savingThrows',
				id: 'savingThrows',
				name: coreModule.api.Utils.i18n('tokenActionHud.nimble.savingThrows'),
				groups: [
					{ ...groups.savingThrows, nestId: 'savingThrows_savingThrows' }
				]
			},
			{
				nestId: 'skills',
				id: 'skills',
				name: coreModule.api.Utils.i18n('tokenActionHud.nimble.skills'),
				groups: [
					{ ...groups.skills, nestId: 'skills_skills' }
				]
			},
			{
				nestId: 'spells',
				id: 'spells',
				name: coreModule.api.Utils.i18n('NIMBLE.sheet.spells'),
				groups: [
					{ ...groups.spells, nestId: 'spells_spells' }
				]
			},
			{
				nestId: 'inventory',
				id: 'inventory',
				name: coreModule.api.Utils.i18n('NIMBLE.sheet.inventory'),
				groups: [
					{ ...groups.inventory, nestId: 'inventory_inventory' }
				]
			},
			{
				nestId: 'features',
				id: 'features',
				name: coreModule.api.Utils.i18n('NIMBLE.sheet.features'),
				groups: [
					{ ...groups.features, nestId: 'features_features' }
				]
			},
			{
				nestId: 'monsterFeatures',
				id: 'monsterFeatures',
				name: coreModule.api.Utils.i18n('tokenActionHud.nimble.monsterFeatures'),
				groups: [
					{ ...groups.monsterFeatures, nestId: 'monsterFeatures_monsterFeatures' }
				]
			},
			{
				nestId: 'utility',
				id: 'utility',
				name: coreModule.api.Utils.i18n('tokenActionHud.utility'),
				groups: [
					{ ...groups.utility, nestId: 'utility_utility' }
				]
			}
		],
		groups: groupsArray
	}
})
