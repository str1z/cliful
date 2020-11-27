const validators = {
  exact: (exact, msg) => (v) => (v === exact ? false : msg),
  regex: (regex, msg) => (v) => (regex.test(v) ? false : msg),
  min: (min, msg) => (v) => (Number(v) >= min ? false : msg),
  max: (max, msg) => (v) => (Number(v) <= max ? false : msg),
  range: (min, max, msg) => (v) => (Number(v) <= max && Number(v) >= min ? false : msg),
  minLen: (min, msg) => (v) => (v.length >= min ? false : msg),
  maxLen: (max, msg) => (v) => (v.length <= max ? false : msg),
  rangeLen: (min, max, msg) => (v) => (v.length <= max && v.length >= min ? false : msg),
  type: (type, msg) =>
    ({
      integer: (v) => (/^\d+$/.test(v) ? false : msg),
      decimal: (v) => (/^(\d*\.)?\d+$/.test(v) ? false : msg),
      number: (v) => (/^(\d*\.)?\d+$/.test(v) ? false : msg),
      boolean: (v) => (/^true|false|0|1|yes|no|y|n$/i.test(v) ? false : msg),
      string: () => false,
    }[type]),
};

const casters = {
  type: (type) =>
    ({
      integer: (v) => Number(v),
      decimal: (v) => Number(v),
      number: (v) => Number(v),
      boolean: (v) => /^true|1|yes|y$/i.test(v),
      string: (v) => v,
    }[type]),
};

class Field {
  constructor(arg) {
    let { name, description, map = (v) => v, kind = "field", strict = false, value, required, aliases = [] } = arg;
    this.validators = [];
    this.casters = [];
    this.aliases = aliases;
    this.strict = strict;
    this.value = value;
    this.name = name;
    this.description = description;
    this.map = map;
    this.kind = kind;
    this.vinfo = [];
    if (required) this.required = typeof this.required === "string" ? arg.required : `${this.kind} '${this.name}' is required.`;
    for (let key in arg)
      if (validators[key]) {
        let params = arg[key] instanceof Array ? arg[key] : [arg[key]];
        if (typeof params[params.length - 1] !== "string" || !params[1]) params.push(`'%arg' failed on ${key}(${arg[key]}) for ${this.kind} '${this.name}'.`);
        this.vinfo.push({ key, params: params.slice(0, -1) });
        this.validators.push(validators[key](...params));
        if (casters[key]) this.casters.push(casters[key](...params));
      }
  }
  validate(value) {
    let errors = [];
    for (let validator of this.validators) {
      let error = validator(value);
      if (error) errors.push(error.replace(/%arg/g, value));
    }
    return errors;
  }
  usage() {
    if (this.kind == "option") return `-[${this.aliases}]${this.strict ? "#" : ""}${this.required ? "" : "?"}`;
    if (this.vinfo[0].key == "exact") return this.vinfo[0].params[0];
    return `[${this.name}]${this.strict ? "#" : ""}${this.required ? "" : "?"}`;
  }
  info() {
    return `{c:lime}${this.name}{s:0} {c:grey53}${this.vinfo.map((v) => `${v.key}(${v.params})`).join(" ")}{s:0}`;
  }
  cast(value) {
    for (let caster of this.casters) value = caster(value);
    return value;
  }
  static FAILED = Symbol("Field.FAILED");
}

module.exports = Field;
