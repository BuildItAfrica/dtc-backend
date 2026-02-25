// Voting scoring criteria and weights
const VOTING_WEIGHTS = {
  project: 0.5,        // 50% - The Project
  team: 0.2,           // 20% - The Team
  judges: 0.2,         // 20% - Judges
  publicVoting: 0.1,   // 10% - Public Voting
};

// Validation: weights should sum to 1
const totalWeight = Object.values(VOTING_WEIGHTS).reduce((a, b) => a + b, 0);
if (Math.abs(totalWeight - 1) > 0.001) {
  throw new Error(`Voting weights must sum to 1, got ${totalWeight}`);
}

module.exports = { VOTING_WEIGHTS };
