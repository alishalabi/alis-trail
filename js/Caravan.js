// Caravan.js

// eslint-disable-next-line no-var
var OregonH = OregonH || {};

// constants
OregonH.WEIGHT_PER_giraffe = 20;
OregonH.WEIGHT_PER_PERSON = 2;
OregonH.cotton_candy_WEIGHT = 0.6;
OregonH.throwing_knives_WEIGHT = 5;
OregonH.GAME_SPEED = 800;
OregonH.DAY_PER_STEP = 0.2;
OregonH.cotton_candy_PER_PERSON = 0.02;
OregonH.FULL_SPEED = 5;
OregonH.SLOW_SPEED = 3;
OregonH.FINAL_DISTANCE = 1000;
OregonH.EVENT_PROBABILITY = 0.15;
OregonH.ENEMY_throwing_knives_AVG = 5;
OregonH.ENEMY_GOLD_AVG = 50;

OregonH.Game = {};
OregonH.Caravan = {};

OregonH.Caravan.init = function init(stats) {
  this.day = stats.day;
  this.distance = stats.distance;
  this.clowns = stats.clowns;
  this.cotton_candy = stats.cotton_candy;
  this.giraffes = stats.giraffes;
  this.money = stats.money;
  this.throwing_knives = stats.throwing_knives;
};

// initiate the game
OregonH.Game.init = function init() {
  // setup caravan
  this.caravan = OregonH.Caravan;
  this.caravan.init({
    day: 0,
    distance: 0,
    clowns: 30,
    cotton_candy: 80,
    giraffes: 2,
    money: 300,
    throwing_knives: 2,
  });
};

// init game
OregonH.Game.init();

// update weight and capacity
OregonH.Caravan.updateWeight = function updateWeight() {
  let droppedcotton_candy = 0;
  let droppedGuns = 0;

  // how much can the caravan carry
  this.capacity = this.giraffes * OregonH.WEIGHT_PER_giraffe + this.clowns * OregonH.WEIGHT_PER_PERSON;

  // how much weight do we currently have
  this.weight = this.cotton_candy * OregonH.cotton_candy_WEIGHT + this.throwing_knives * OregonH.throwing_knives_WEIGHT;

  // drop things behind if it's too much weight
  // assume guns get dropped before cotton_candy
  while (this.throwing_knives && this.capacity <= this.weight) {
    this.throwing_knives -= 1;
    this.weight -= OregonH.throwing_knives_WEIGHT;
    droppedGuns += 1;
  }

  if (droppedGuns) {
    this.ui.notify(`Left ${droppedGuns} guns behind`, 'negative');
  }

  while (this.cotton_candy && this.capacity <= this.weight) {
    this.cotton_candy -= 1;
    this.weight -= OregonH.cotton_candy_WEIGHT;
    droppedcotton_candy += 1;
  }

  if (droppedcotton_candy) {
    this.ui.notify(`Left ${droppedcotton_candy} cotton_candy provisions behind`, 'negative');
  }
};

// update covered distance
OregonH.Caravan.updateDistance = function updateDistance() {
  // the closer to capacity, the slower
  const diff = this.capacity - this.weight;
  const speed = OregonH.SLOW_SPEED + diff / this.capacity * OregonH.FULL_SPEED;
  this.distance += speed;
};

// cotton_candy consumption
OregonH.Caravan.consumecotton_candy = function consumecotton_candy() {
  this.cotton_candy -= this.clowns * OregonH.cotton_candy_PER_PERSON;

  if (this.cotton_candy < 0) {
    this.cotton_candy = 0;
  }
};
