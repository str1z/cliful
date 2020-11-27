const colors = require("./colors");

const styles = {
  0: 0,
  b: 1,
  u: 4,
  r: 7,
};

function paint(text) {
  return text
    .replace(/{c:(\w+)}/g, (m, c) => (colors[c] ? `\u001b[38;5;${colors[c]}m` : m))
    .replace(/{b:(\w+)}/g, (m, c) => (colors[c] ? `\u001b[48;5;${colors[c]}m` : m))
    .replace(/{s:([0bur])}/g, (m, c) => `\u001b[${styles[c]}m`);
}

module.exports = paint;
