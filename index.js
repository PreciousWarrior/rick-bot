//RICKBOT (Discord bot made using discord.js)
//TODO add text file for future rick rolls, not list if the bot gets disconnected.
//TODO Send message when bot joins server
//TODO figure out how to use better performance VC streamer, was causing error when installed.
//TODO use different website or automate creating new link using web scraping
//TODO add support for multiple guilds
//TODO remove command part when appending suggestion
//TODO get active dir

//Change this link every 72 hours
const hiddenLink = "https://www.thisworldthesedays.com/howtoincreaseyouriqby10pointsin10days.html";

//Libraries
const Discord = require('discord.js');
const fs = require('fs')

//Client, token, login
const client = new Discord.Client();
const token = "Private token goes here";
client.login(token);

//Dirs, files, locations
const thisDir = __dirname
const rollLink = thisDir + String.raw`\rickfinal.mp3`
const hahadir = thisDir + String.raw`\hahas`
const suggestionsFile = thisDir + String.raw`\suggestions.txt`

//Other consts for bot
const ytlink = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
const prefix = "rick";

//Random global variables
var hahafiles = []
var hitlist = [];

//Events


//Event runs when bot is turned on. Gets the files in haha dir and sets them to global variable.
client.on('ready', ()=>{
    console.log("Bot was turned on.");
    hahafiles = fs.readdirSync(hahadir)
})


//Event runs when message is sent. Checks for commands in message.
client.on('message', message=>{
    if (message.author.bot) {return}
    message.content = message.content.toLowerCase();
    //Return message if author is bot, change message to lowercase.
    if (message.content.substring(0, prefix.length) != prefix){return}
    let args = message.content.substring(prefix.length + 1).split(" ");
    //Check if the keyword is in message, if not return message. Split the words after keyword into args.
    if (args[0] == "roll"){
        let targetMember = message.mentions.members.first();
        if(!targetMember) return message.reply("Please mention a user to rickroll!");
        //Checks if there is a mention in the message

        if (hitlist.indexOf(targetMember) != -1) return message.reply("That user is already on the hitlist to be rickrolled! Have patience!");
        //Checks if mention is already in hitlist
        
        if (targetMember.user.bot) return message.reply("Thy bots shalt not be whik wolled!");
        if (!targetMember.voice.channel){
            //Adds user to hitlist after knowing that they are not currently in VC. Whenever the join one, they will be rickrolled.
            message.reply("That user is currently not in a voice channel. Don't worry, I'll rickroll him whenever he joins one!");
            hitlist.push(targetMember);
            return
        }
        //Rick rolls user if they are in VC
        message.reply("All right! (╯°□°）╯︵ ┻━┻")
        targetMember.voice.channel.join().then(RickRoll);
        return;
    }
    
    if (args[0] == "link"){
        message.delete();
        message.channel.send(hiddenLink)
        return
    }
    if (args[0] == "yt" || args[0] == "youtube"){
        message.channel.send(ytlink)
        return
    }
    if (args[0] == "lyrics" || args[0] == "me"){
        message.channel.send(lyrics);
        message.channel.send(lyrics1)
        message.channel.send(lyrics2)
        message.channel.send(lyrics3)
        return
    }
    if (args[0] == "suggest"){
        //Writes to text file with user suggestion
        fs.appendFile(suggestionsFile, message.content + "\n", () => {});
        message.reply(":ballot_box_with_check: Okie! My creator will work on it as soon as possible. \n By the way, never gonna let you down!")
        return
    }
    if (args[0] == "help"){
        message.channel.send(helppage);
        return;
    }
    //Runs if there is no valid arg
    message.reply("Please enter a valid argument. Type in rick help for the help page.")
})


//Event runs when an update is made to a voice channel. If the update is a user joining a channel, and the user is in the hitlist-:
//The bot removes the user from the hitlist and rickrolls them.
client.on('voiceStateUpdate', (oldMember, newMember) => {
    
    if (oldMember.member.user.bot || newMember.member.user.bot) {return}
    let newUserChannel = newMember.channelID
    let oldUserChannel = oldMember.channelID

    if (oldUserChannel === null && newUserChannel !== null){
        //If user's previous VC was null and the new one is not, means they just joined a VC when the event triggered.
        if (hitlist.indexOf(newMember.member) != -1){
            //If the user is in the hitlist, remove them from it and rick roll them.
            const index = hitlist.indexOf(newMember.member);
            hitlist.splice(index, 1);
            newMember.member.voice.channel.join().then(RickRoll);
        }
       
    }
})


//Functions

//Get random HAHA message from dir
function RandomHaha(){
    var fileName = hahafiles[Math.floor(Math.random() * hahafiles.length)];
    return hahadir + String.raw`\l`.substring(0, 1) + fileName;
    //This is defining a raw string with a backslash and a random letter after backslash using substr since backslashes
    //cant be defined even in a raw string  literal
}

//Rick roll someone (VC Connection in param.)
function RickRoll(connection){
    const dispatcher = connection.play(rollLink)
    //Plays the rickroll mp3 when bot joins the VC.
    dispatcher.on('finish', () => {
        //When it finishes, plays the random HAHA message.
        const dispatcher2 = connection.play(RandomHaha())
        dispatcher2.on('finish', () => {
            //When that finishes, disconnects from VC.
            connection.disconnect();
            return;
        })})
}


//LONG STRINGS FOR MESSAGES (HELP, LYRICS, ETC.)-:

const lyrics = 
`We're no strangers to love

You know the rules and so do I
A full commitment's what I'm thinking of
You wouldn't get this from any other guy
I just wanna tell you how I'm feeling

Gotta make you understand

Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye

Never gonna tell a lie and hurt you
We've known each other for so long
Your heart's been aching but
You're too shy to say it
`
const lyrics1=
`Inside we both know what's been going on

We know the game and we're gonna play it
And if you ask me how I'm feeling
Don't tell me you're too blind to see
Never gonna give you up
Never gonna let you down
Never gonna run around and desert you

Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you
Never gonna give you up
Never gonna let you down
Never gonna run around and desert you

Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you
(Ooh, give you up)`

const lyrics2=
`(Ooh, give you up)
(Ooh)
Never gonna give, never gonna give
(Give you up)

(Ooh)
Never gonna give, never gonna give

(Give you up)
We've know each other for so long
Your heart's been aching but
You're too shy to say it
Inside we both know what's been going on

We know the game and we're gonna play it
I just wanna tell you how I'm feeling
Gotta make you understand
Never gonna give you up`

const lyrics3=
`Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you
Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you
Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you`
const helppage =
`Hello, I am RickBot. These are my commands-:
**rick roll**-: Rick roll a user. They will be rickrolled right now if they are in a voice channel, or later whenever they join one.
**rick link**-: Delete your older message and give an unsuspecting link in the chat that leads to a rick roll.
**rick YT** *or* **rick YouTube**-: Put an obvious YT link for rick roll in the chat.
**rick lyrics** *or* **rick me**-: Puts the lyrics of the song in the chat.
**rick suggest**-: Give a suggestion to the bot for new commands, more features for commands or any bugs encountered.
**rick help**-: List all the commands of the bot.
As always, never gonna give you up!
Bot developed by <@474898418138087428>
Note: This bot is not case-senstitive
`
