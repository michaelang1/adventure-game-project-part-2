const { Character } = require('./character');
const { Food } = require('./food');

class Enemy extends Character {
	constructor(name, description, startingRoom) {
		super(name, description, startingRoom);
		this.cooldown = 3000;
		this.attackTarget = null;
	}

	setPlayer(player) {
		this.player = player;
	}

	rest() {
		// Wait until cooldown expires, then act
		const resetCooldown = () => {
			// HA: Must use arrow function here? Why?
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
			this.cooldown = 0;
			this.act();
		};

		setTimeout(resetCooldown, this.cooldown);
	}

	takeSandwich() {
		if (this.player && this.player.currentRoom === this.currentRoom) {
			for (let i = 0; i < this.currentRoom.items.length; i++) {
				let item = this.currentRoom.items[i];
				if (item instanceof Food) {
					this.items.push(item);
					this.currentRoom.items.splice(i, 1);
					i--;
					this.health = 100;
					console.log(
						`${this.name} took the ${item.name}! Its health resets to 100!`
					);
					this.cooldown += 1000;
				}
			}
		}
	}

	randomMove() {
		let directions = this.currentRoom.getExits();
		let min = 0;
		let max = directions.length - 1;
		let indexRandom = Math.floor(Math.random() * (max - min + 1) + min);
		let direction = directions[indexRandom];
		this.currentRoom = this.currentRoom.getRoomInDirection(direction);
		this.cooldown += 1000;
	}

	attack() {
		if (
			this.attackTarget &&
			this.attackTarget.currentRoom === this.currentRoom
		) {
			this.attackTarget.applyDamage(this.strength);
			console.log(
				`Ouch! You were hit by ${this.name} (${this.attackTarget.health} / 100)!`
			);
		}
		this.cooldown += 1000;
	}

	scratchNose() {
		this.alert(`${this.name} scratches its nose`);
		this.cooldown += 1000;
	}

	// Print the alert only if player is standing in the same room
	alert(message) {
		if (this.player && this.player.currentRoom === this.currentRoom) {
			console.log(message);
		}
	}

	act() {
		if (this.health <= 0) {
			// Dead, do nothing;
		} else if (this.cooldown > 0) {
			this.rest();
		} else {
			this.scratchNose();
			this.attack();
			this.takeSandwich();
			this.randomMove();
			this.rest();
		}
	}

	die() {
		super.die();
		console.log(`${this.name} is dead!`);
	}
}

module.exports = {
	Enemy,
};
