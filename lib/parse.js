module.exports = function (booleans = [], argv = process.argv) {
  let parsed = { exec: argv[0], cwd: argv[1], opts: {}, args: [] };
  let flag = false;
  for (let i = 2; i < argv.length; i++) {
    let match = argv[i].match(/^--?(\w+)(=.*)?$/);
    if (match) {
      if (flag) parsed.opts[flag] = "true";
      flag = false;
      if (booleans.includes(match[1])) parsed.opts[match[1]] = "true";
      else if (match[2]) parsed.opts[match[1]] = match[2].slice(1);
      else flag = match[1];
    } else if (flag) {
      parsed.opts[flag] = argv[i];
      flag = false;
    } else parsed.args.push(argv[i]);
  }
  if (flag) parsed.opts[flag] = "true";
  return parsed;
};
