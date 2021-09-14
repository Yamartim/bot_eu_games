require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

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
      },
      {
          "type": 4,
          "name": "modifier",
          "description": "The modifier of your roll"
      },
      {
        "type": 3,
        "name": "advantage",
        "description": "Adv for advantage and dis for disadvantage"
      }
    ]
  }]; 

const rest = new REST({ version: '9' }).setToken(process.env.token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
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
    let dice = interaction.options.data[0].value.toLowerCase().split('d');
    let user = interaction.user.username;
    let mod = 0;
    let adv = 0;
    let advArr = 2;
    if(interaction.options.data[1] != undefined && typeof interaction.options.data[1].value == "number"){
      mod = interaction.options.data[1].value;
    }else if(typeof interaction.options.data[1].value == "string"){
      advArr = 1;
    }else{
      await interaction.reply('It seems your formatting is wrong');
      return;
    }
    if(interaction.options.data[advArr] != undefined){
      if(interaction.options.data[advArr].value.toLowerCase() == "adv"){
        adv = 1;
      }else if(interaction.options.data[advArr].value.toLowerCase() == "dis"){
        adv = -1;
      }else{
        adv = 0;
      }
    }
    let response = user + "'s roll \n ";
    let diceArray = new Array();
    let sum = 0;
    let newInt = 0;
    let advStr = "";
      for(let i = parseInt(dice[0]); i > 0; i--){
          newInt = Math.floor(Math.random() * (parseInt(dice[1]))) + 1;
          if(adv != 0){
            let otherInt = Math.floor(Math.random() * (parseInt(dice[1]))) + 1;
            if(adv == 1 && otherInt > newInt || adv == -1 && otherInt < newInt){
              advStr = "/~~" + newInt.toString() + "~~";
              newInt = otherInt;
            }else{
              advStr = "/~~" + otherInt.toString() + "~~";
            }
          }
          diceArray.push(newInt.toString());
          if(i != 1){
              response += "[" + newInt.toString() + advStr + "],";
          }else{
              response += "[" + newInt.toString() + advStr + "]";
          }
        sum += newInt;
      }
      response += ":  " + sum.toString();
      if(mod != 0){
        response = response + "\n **Single Modifier: " + (sum+mod).toString() + "\n Modifier per Roll: " + (sum+mod*parseInt(dice[0])).toString() + "**";
      }
      client.api.interactions(interaction.id, interaction.token).callback.post({data: {
            type: 4,
            data: {
            content: response
            }
      }})
      

    }
  }
);

client.login(process.env.token);