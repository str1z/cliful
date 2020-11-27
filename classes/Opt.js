const Field = require("./Field");

class Opt extends Field {
  constructor(opt) {
    opt.kind = opt.kind || "option";
    super(opt);
    this.boolean = !!opt.boolean;
  }
  match(opts, errors) {
    for (let alias of this.aliases) {
      if (opts[alias]) {
        let error = this.validate(opts[alias]);
        errors.push(...error);
        if (error[0]) return this.strict ? Field.FAILED : this.value;
        return this.map(this.cast(opts[alias]));
      }
    }
    if (this.required) {
      errors.push(this.required);
      return Field.FAILED;
    }
    return this.value;
  }
  static parse(opt, aliases) {
    if (opt instanceof this) return opt;
    if (opt instanceof Object) return new this({ ...opt, aliases, name: aliases[0] });
    return new this({ type: typeof opt, value: opt, boolean: typeof opt === "boolean", aliases, name: aliases[0] });
  }
}

module.exports = Opt;
