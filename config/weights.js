// config/weights.js
const WEIGHTS = {
  default: {
    problem: 0.25,
    innovation: 0.20,
    feasibility: 0.20,
    scalability: 0.15,
    team: 0.10,
    motivation: 0.10
  },

  impact: {
    problem: 0.35,
    innovation: 0.20,
    feasibility: 0.15,
    scalability: 0.15,
    team: 0.05,
    motivation: 0.10
  },

  technical: {
    problem: 0.20,
    innovation: 0.35,
    feasibility: 0.25,
    scalability: 0.10,
    team: 0.05,
    motivation: 0.05
  }
};

module.exports = { WEIGHTS };