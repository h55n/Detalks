const ADJECTIVES = [
  "Warm", "Quiet", "Calm", "Gentle", "Soft", "Brave", "Kind", "Still",
  "Amber", "Misty", "Mellow", "Patient", "Tender", "Steady", "Honest",
];

const NOUNS = [
  "Pebble", "River", "Leaf", "Moss", "Cloud", "Fern", "Brook", "Dawn",
  "Pine", "Willow", "Meadow", "Stone", "Rain", "Cedar", "Wren",
];

export function generateAlias(random: () => number = Math.random): string {
  const adjective = ADJECTIVES[Math.floor(random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(random() * NOUNS.length)];
  return `${adjective}${noun}`;
}
