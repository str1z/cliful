const Arg = require("./Arg");
const Opt = require("./Opt");
const Field = require("./Field");
const parse = require("../lib/parse");

class Cmd {
  constructor(cmd) {
    const { name, description, args = [], opts = {}, exec = () => {} } = cmd || {};
    this.name = name;
    this.exec = exec;
    this.description = description;
    this.args = args.map((arg, i) => Arg.parse(arg, i));
    this.opts = [];
    this.booleans = [];
    for (let flags in opts) {
      let flagArr = flags.split(" ");
      let option = Opt.parse(opts[flags], flagArr);
      if (option.boolean) this.booleans.push(...flagArr);
      this.opts.push(option);
    }
  }
  match(argv) {
    let errors = [];
    let results = {};
    let parsed = parse(this.booleans, argv);
    for (let i = 0; i < this.args.length; i++) {
      let res = this.args[i].match(parsed.args[i], errors);
      if (res === Field.FAILED) return { failed: true, errors, results };
      results[this.args[i].name] = res;
    }
    for (let opt of this.opts) {
      let res = opt.match(parsed.opts, errors);
      if (res === Field.FAILED) return { failed: true, errors, results };
      results[opt.name] = res;
    }
    return { errors, results };
  }
  usage() {
    return `${[...this.args, ...this.opts].map((v) => v.usage()).join(" ")}`;
  }
  info(all) {
    return `{s:r}${this.name}{s:0}
  ${this.description}
  {c:yellow}${this.usage()}{s:0}
    ${
      all
        ? `{c:aqua}arguments{s:0} : ${this.args.map((arg) => arg.info()).join(" ") || "none"}
    {c:aqua}options  {s:0} : ${this.opts.map((opt) => opt.info()).join(" ") || "none"}`
        : ""
    }`;
  }
  static parse(cmd) {
    if (cmd instanceof this) return cmd;
    return new this(cmd);
  }
}

module.exports = Cmd;
