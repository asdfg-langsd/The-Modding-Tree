addLayer("u", {
    name: "upgrade", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "U", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
	points: new Decimal(0)
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "upgrade points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
	if(hasUpgrade("u", 21)) mult = mult.times(upgradeEffect("u", 21))
	if(hasUpgrade("u", 22)) mult = mult.times(2)
	if(hasUpgrade("p", 11)) mult = mult.times(3)
	mult.times(player.prestige + 1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "u", description: "U: Reset for upgrade points", onPress(){if (canReset(this.layer)) doReset(this.layer)}}
    ],
    layerShown(){return true},
    upgrades: {
        	11: {
       			title:"+1",
	    		description: "+1 base point gain",
	    		cost: new Decimal(2)
		},
		12:{
	    		title:"more upgrade points, more boosts",
	    		description: "the title says everything",
	    		cost: new Decimal(4),
	    		unlocked(){
                		return hasUpgrade("u", 11)
	    		},
	   		effect() {
            			return (player[this.layer].points.add(1).pow(0.25)).add(1)
            		},
       			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }// Add formatting to the effect

		},
		21:{
	    		title:"too high",
	    		description: "lower the target for the next UP with the more points",
	    		cost: new Decimal(10),
	    		unlocked(){
           			return hasUpgrade("u", 12)
	    		},
	    		effect() {
            			return player.points.add(1).dividedBy(10)
        		},
	    		effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }
		},
		22:{
			title:"unlock",
			description:"unlocks a new layer + *2 production for UP and points",
			cost: new Decimal(55),
			unlocked(){
				return hasUpgrade("u", 21)
			}
		}
    }
})
addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
	points: new Decimal(0)
    }},
    color: "#4BDC13",
    requires: new Decimal(250), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.u.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: reset Prestige Points", onPress(){if (canReset(this.layer)) doReset(this.layer)}}
    ],
    layerShown(){return hasUpgrade("u", 22) || player.prestige > 0 || hasUpgrade("p", 11)},
    upgrades:{
		11:{
			title:"*3",
	    		description: "*3 point gain",
	    		cost: new Decimal(3)
		}
	}
})
