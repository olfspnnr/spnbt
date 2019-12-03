//@ts-check

exports.run = (client, message, args, level) => {
  if (!args[0]) {
    const myCommands = message.guild
      ? client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level)
      : client.commands.filter(
          cmd => client.levelCache[cmd.conf.permLevel] <= level && cmd.conf.guildOnly !== true
        );
    const commandNames = myCommands.keyArray();
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
    let currentCategory = "";
    let embedObject = {
      embed: {
        color: 3447003,
        author: {
          name: "Command List",
          icon_url: " "
        },
        fields: [
          {
            name: `[Use ${message.settings.prefix}help <commandname> for details]`,
            value: `\n\n`
          }
        ],
        timestamp: new Date(),
        footer: {
          text: `© Capi1337`,
          icon_url: `https://cdn.discordapp.com/avatars/141576675514253313/379e3fcec1992030be83f2fcdc503780.png?size=2048`
        }
      }
    };
    const sorted = myCommands
      .array()
      .sort((p, c) =>
        p.help.category > c.help.category
          ? 1
          : p.help.name > c.help.name && p.help.category === c.help.category
          ? 1
          : -1
      );
    sorted.forEach(c => {
      const cat = c.help.category.toProperCase();
      if (currentCategory !== cat) {
        let catField = {
          name: `:small_blue_diamond: ${cat} :small_blue_diamond:`,
          value: " "
        };
        embedObject.embed.fields.push(catField);
        currentCategory = cat;
      }
      let cmdField = {
        name: `${message.settings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)}`,
        value: `${c.help.description}\n`
      };
      embedObject.embed.fields.push(cmdField);
    });
    message.channel.send(embedObject);
  } else {
    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      if (level < client.levelCache[command.conf.permLevel]) return;
      message.channel.send(
        `= ${command.help.name} = \n${command.help.description}\nusage:: ${
          command.help.usage
        }\naliases:: ${command.conf.aliases.join(", ")}\n= ${command.help.name} =`,
        { code: "asciidoc" }
      );
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["", ""],
  permLevel: "User"
};

exports.help = {
  name: "newhelp",
  category: "System",
  description: "Displays all the available commands for your permission level.",
  usage: "newhelp [command]"
};
