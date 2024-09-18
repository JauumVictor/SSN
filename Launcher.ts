import { GatewayIntentBits, Partials } from 'discord.js';
import { DiscordBot } from './src/discord';
import { SSN } from './src/ssn';
import { TelegramBot } from './src/telegram';
import { config } from 'dotenv';
import { Logger } from './src/utils/logger';

config();

export class BotLauncher {
    private discordBot: DiscordBot;
    private telegramBot: TelegramBot;
    public botController: SSN;

    constructor() {
        this.discordBot = new DiscordBot({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.GuildVoiceStates
            ],
            partials: [
                Partials.Channel,
                Partials.Message,
                Partials.User,
                Partials.GuildMember,
                Partials.Reaction
            ],
            allowedMentions: {
                parse: [
                    'users',
                    'roles'
                ],
                repliedUser: true
            },
            rest: {
                version: '10'
            },
            presence: {
                status: process.env.STATE == 'development' ? 'idle' : 'online'
            }
        });

        this.telegramBot = new TelegramBot({
            token: process.env.TELEGRAM_TOKEN
        });

        this.botController = new SSN(this.discordBot, this.telegramBot);
    }

    public async initializeBots() {
        Logger.warn('Inicializando os bots...', [BotLauncher.name, this.initializeBots.name]);

        try {
            await this.discordBot.initialize();
            await this.telegramBot.initialize();
            await this.botController.start();
        } catch (error) {
            Logger.error('Erro ao inicializar os bots: ' + error, [BotLauncher.name, this.initializeBots.name]);
        } finally {
            Logger.info('Bots inicializados com sucesso!', [BotLauncher.name, this.initializeBots.name]);
        }
    }
}

(async() => {
    const launcher = new BotLauncher();
    await launcher.initializeBots();
})();