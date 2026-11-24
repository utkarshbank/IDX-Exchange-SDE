const stamp = () => new Date().toISOString();

module.exports = {
  info: (message) => process.stdout.write(`${stamp()} ${message}\n`),
};