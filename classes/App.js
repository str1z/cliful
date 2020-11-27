const Cmd = require("./Cmd");
const print = require("../lib/print");

class App {
  constructor({ name, version, description, author, cmds = [], suggestions = 3 }) {
    this.suggestions = suggestions;
    this.name = name;
    this.version = version;
    this.description = description;
    this.author = author;
    this.cmds = cmds.map((cmd) => Cmd.parse(cmd));
  }
  info() {
    return `{c:lime}${this.name} {c:aqua}v${this.version}{s:0}
{c:grey53}by ${this.author}{s:0}

${this.description}`;
  }
  printInfo(all) {
    print(this.info(all));
  }
  help(all) {
    return `${this.cmds.map((cmd) => cmd.info(all)).join("\n")}`;
  }
  printHelp(all) {
    print(this.help(all));
  }
  match(argv) {
    let errors = [];
    for (let cmd of this.cmds) {
      let data = cmd.match(argv);
      if (!data.failed) return { cmd, data };
      errors.push({ errors: data.errors, cmd });
    }
    return errors;
  }
  assist(errors) {
    errors = errors.sort((a, b) => a.errors.length - b.errors.length).slice(0, this.suggestions);
    print(`{c:red}Invalid command. Your query did not match any command.{s:0}
      
Did you mean ...

${errors
  .map(
    (e) => `${e.cmd.info(true)}
{c:red}${e.errors.map((v) => "  " + v).join("\n")}\n{s:0}`
  )
  .join("\n")}`);
  }
  exec(argv) {
    let res = this.match(argv);
    if (res.data) return res.cmd.exec(res.data.results, res.data.errors);
    this.assist(res);
  }
  useInfo() {
    this.cmds.push(
      new Cmd({
        name: "info",
        args: ["info"],
        description: "To get the nescessary information of this application.",
        exec: () => {
          this.printInfo();
        },
      })
    );
  }
  useHelp() {
    this.cmds.push(
      new Cmd({
        name: "help",
        args: ["help", { type: "string", name: "name", value: false, strict: true }],
        opts: { "all a": false },
        exec: ({ name, all }) => {
          let res = this.cmds.filter((cmd) => cmd.name.match(name || ""));
          if (res.length <= 3) all = true;
          print(res.map((cmd) => cmd.info(all)).join("\n"));
        },
      })
    );
  }
}

module.exports = App;
