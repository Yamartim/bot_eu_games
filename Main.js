require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

CLIENT_ID = '887091042543878186';
GUILD_ID = '887092557711028234';
prefix = "!";

const commands = [{
  name: 'ping',
  description: 'Replies with Pong!'
},{
    "name": "roll",
    "description": "Rolls some dice for you :)",
    "options": [
      {
        "type": 3,
        "name": "dice",
        "description": "Number and type of dice",
        "required": true,
        "choices": []
      },
      {
        "type": 3,
        "name": "adv",
        "description": "adv for advantage and dis for disadvanatge"
      }
    ]
  }]; 

const rest = new REST({ version: '9' }).setToken('ODg3MDkxMDQyNTQzODc4MTg2.YT_F6Q.VAVkZ19nRy1ZJOBksnKlpdybGOs');

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

const { Client, Intents, Message } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }else if(interaction.commandName === 'roll'){
      if (interaction.options.data[1] === undefined || interaction.options.data[1].value.toLowerCase() != adv && interaction.options.data[1].value.toLowerCase() != dis){
        let dice = interaction.options.data[0].value.toLowerCase().split('d');
        let user = interaction.user.username;
        let response = "";
        let diceArray = new Array();
        let sum = 0;
        let newInt = 0;
        for(let i = parseInt(dice[0]); i > 0; i--){
            newInt = Math.floor(Math.random() * (parseInt(dice[1]))) + 1;
            diceArray.push(newInt.toString());
            if(i != 1){
                response += "[" + newInt.toString() + "],";
            }else{
                response += "[" + newInt.toString() + "]";
            }
         sum += newInt;
        }
        response += ":   **" + sum.toString() + "**";
        client.api.interactions(interaction.id, interaction.token).callback.post({data: {
            type: 4,
            data: {
            content: response
            }
        }})
    }else{

    }
  }
});

client.login(token);