// utils/score.js
function computeTotal(scores, weights) {
  return (
    scores.problem * weights.problem +
    scores.innovation * weights.innovation +
    scores.feasibility * weights.feasibility +
    scores.scalability * weights.scalability +
    scores.team * weights.team +
    scores.motivation * weights.motivation
  );
}

module.exports = { computeTotal };