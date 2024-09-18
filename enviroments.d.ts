declare global {
    namespace NodeJS {
        interface ProcessEnv {
            CLIENT_TOKEN: string;
            TELEGRAM_TOKEN: string;
            CLIENT_ID: string;
            CLIENT_SECRET: string;
            EMBED_COLOR: string;
            PREFIX: string;
            STATE: string;
            MONGO_CONNECTION_URI: string;
            GUILD_ID: string;
            OWNER_ID: string;
            ERROR_CHANNEL: string;
            PIN_CHANNEL: string;
            LOG_CHANNEL: string;
            GENERAL_CHANNEL: string;
            INVITE_CHANNEL: string;
            INITIAL_ROLE: string;
            MYSQL_USER: string;
            MYSQL_PASSWORD: string;
            MYSQL_DATABASE: string;
            MYSQL_HOST: string;
        }
    }
}

export { };