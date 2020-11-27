const Field = require("./Field");

class Arg extends Field {
  constructor(arg) {
    arg.kind = arg.kind || "argument";
    super(arg);
  }
  match(arg, errors) {
    if (arg === undefined && this.required) {
      errors.push(this.required);
      return Field.FAILED;
    }
    let error = this.validate(arg);
    errors.push(...error);
    if (error[0]) return this.strict ? Field.FAILED : this.value;
    return this.map(this.cast(arg));
  }
  static parse(arg, i) {
    if (arg instanceof this) return arg;
    if (arg instanceof Object) return new this({ name: `arg${i}`, ...arg });
    if (typeof arg === "string") return new this({ exact: arg, strict: true, required: true, name: `arg${i}` });
  }
}

module.exports = Arg;
