const { Character } = require('./character');
const { Enemy } = require('./enemy');
const { Food } = require('./food');

class Player extends Character {
	constructor(name, startingRoom) {
		super(name, 'main character', startingRoom);
	}

	move(direction) {
		const nextRoom = this.currentRoom.getRoomInDirection(direction);

		// If the next room is valid, set the player to be in that room
		if (nextRoom) {
			this.currentRoom = nextRoom;

			nextRoom.printRoom(this);
		} else {
			console.log('You cannot move in that direction');
		}
	}

	printInventory() {
		if (this.items.length === 0) {
			console.log(`${this.name} is not carrying anything.`);
		} else {
			console.log(`${this.name} is carrying:`);
			for (let i = 0; i < this.items.length; i++) {
				console.log(`  ${this.items[i].name}`);
			}
		}
	}

	takeItem(itemName) {
		for (let i = 0; i < this.currentRoom.items.length; i++) {
			let item = this.currentRoom.items[i];
			if (item.name === itemName) {
				this.items.push(item);
				this.currentRoom.items.splice(i, 1);
				i--;
			}
		}
	}

	dropItem(itemName) {
		for (let i = 0; i < this.items.length; i++) {
			let item = this.items[i];
			if (item.name === itemName) {
				this.currentRoom.items.push(item);
				this.items.splice(i, 1);
				i--;
			}
		}
	}

	eatItem(itemName) {
		for (let i = 0; i < this.items.length; i++) {
			let item = this.items[i];
			if (item instanceof Food && item.name === itemName) {
				this.items.splice(i, 1);
				i--;
				this.health = 100;
				console.log('Your health resets to 100!');
			}
		}
	}

	getItemByName(name) {
		for (let item of this.items) {
			if (item.name === name) return item;
		}
	}

	hit(name) {
		let enemy = this.currentRoom.getEnemyByName(name);
		if (enemy !== undefined) {
			enemy.applyDamage(this.strength);
			enemy.attackTarget = this;
			console.log(`Bam! You hit ${enemy.name} (${enemy.health} / 100)!`);
		} else {
			console.log(`Oops! ${name} has just left the room!`);
		}
	}

	die() {
		super.die();
		console.log('You are dead...');
		process.exit();
	}
}

module.exports = {
	Player,
};
