const cli = require("./cliful");

let test = new cli.App({
  name: "Testing Cliful",
  version: "0.0.1",
  author: "Wei Heng Jiang",
  description: "Greets people to make them happy!",
  cmds: [
    {
      name: "greet",
      description: "greet a person",
      args: ["greet", { type: "string", name: "name", required: true }],
    },
    {
      name: "greet",
      description: "greet a lot of people",
      args: ["greet"],
      opts: {
        all: { type: "number", strict: true, regex: /d/g },
      },
    },
  ],
});
test.useInfo();
test.useHelp();
test.exec();
