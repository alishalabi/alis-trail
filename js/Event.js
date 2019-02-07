// Event.js

// eslint-disable-next-line no-var
var OregonH = OregonH || {};

OregonH.Event = {};

OregonH.Event.eventTypes = [
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'clowns',
    value: -5,
    text: 'Cotton candy has been poisoned by rivals! Casualties: ',
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'clowns',
    value: -4,
    text: 'Juggler flu outbreak. Casualties: ',
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'cotton_candy',
    value: -10,
    text: 'Bear breakout! Cotton candy stolen: ',
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'money',
    value: -50,
    text: 'Angry audience asked for money back. Lost $',
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'giraffes',
    value: -1,
    text: 'Giraffe flu outbreak. Casualties: ',
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'cotton_candy',
    value: 20,
    text: 'Cotton candy clearance sale in local town! Cotton candy added: ',
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'cotton_candy',
    value: 20,
    text: 'Cotton candy clearance sale in local town! Cotton candy added: ',
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'giraffes',
    value: 1,
    text: 'Found wild giraffes (in the US??). New giraffes: ',
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'You have found a shop',
    products: [
      { item: 'cotton_candy', qty: 20, price: 50 },
      { item: 'giraffes', qty: 1, price: 200 },
      { item: 'throwing_knives', qty: 2, price: 50 },
      { item: 'clowns', qty: 5, price: 80 },
    ],
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'You have found a shop',
    products: [
      { item: 'cotton_candy', qty: 30, price: 50 },
      { item: 'giraffes', qty: 1, price: 200 },
      { item: 'throwing_knives', qty: 2, price: 20 },
      { item: 'clowns', qty: 10, price: 80 },
    ],
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'Smugglers sell various goods',
    products: [
      { item: 'cotton_candy', qty: 20, price: 60 },
      { item: 'giraffes', qty: 1, price: 300 },
      { item: 'throwing_knives', qty: 2, price: 80 },
      { item: 'clowns', qty: 5, price: 60 },
    ],
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'Rival carnies are attacking you!',
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'The local police are canducting a raid!',
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'Religous fanatics are chasing you out of town!',
  },
];

// Helper function to get random number
function randomInt(n) {
  return Math.floor(Math.random() * n) // Returns int between 0 and n - 1
}

OregonH.Event.generateEvent = function generateEvent() {
  // pick random one
  const eventIndex = randomInt(this.eventTypes.length);
  const eventData = this.eventTypes[eventIndex];

  // events that consist in updating a stat
  if (eventData.type === 'STAT-CHANGE') {
    this.stateChangeEvent(eventData);
  } else if (eventData.type === 'SHOP') {
    // shops
    // pause game
    this.game.pauseJourney();

    // notify user
    this.ui.notify(eventData.text, eventData.notification);

    // prepare event
    this.shopEvent(eventData);
  } else if (eventData.type === 'ATTACK') {
    // attacks
    // pause game
    this.game.pauseJourney();

    // notify user
    this.ui.notify(eventData.text, eventData.notification);

    // prepare event
    this.attackEvent(eventData);
  }
};

OregonH.Event.stateChangeEvent = function stateChangeEvent(eventData) {
  // can't have negative quantities
  if (eventData.value + this.caravan[eventData.stat] >= 0) {
    this.caravan[eventData.stat] += eventData.value;
    this.ui.notify(eventData.text + Math.abs(eventData.value), eventData.notification);
  }
};

OregonH.Event.shopEvent = function shopEvent(eventData) {
  // number of products for sale
  const numProds = Math.ceil(Math.random() * 4);

  // product list
  const products = [];
  let j;
  let priceFactor;

  for (let i = 0; i < numProds; i += 1) {
    // random product
    j = Math.floor(Math.random() * eventData.products.length);

    // multiply price by random factor +-30%
    priceFactor = 0.7 + 0.6 * Math.random();

    products.push({
      item: eventData.products[j].item,
      qty: eventData.products[j].qty,
      price: Math.round(eventData.products[j].price * priceFactor),
    });
  }

  this.ui.showShop(products);
};

// prepare an attack event
OregonH.Event.attackEvent = function attackEvent() {
  const throwing_knives = Math.round((0.7 + 0.6 * Math.random()) * OregonH.ENEMY_throwing_knives_AVG);
  const gold = Math.round((0.7 + 0.6 * Math.random()) * OregonH.ENEMY_GOLD_AVG);

  this.ui.showAttack(throwing_knives, gold);
};
