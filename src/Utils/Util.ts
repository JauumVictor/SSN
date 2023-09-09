import * as winston from 'winston';
import { setTimeout as sleep } from 'timers/promises';
import { ServiceStructure } from '../Structures/';

enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error'
}

class Util {
    GetMention(id: string): RegExp {
        return new RegExp(`^<@!?${id}>( |)$`);
    }

    public async executeService(service: ServiceStructure) {
        const { amount = 1, interval = 0, wait = 0 } = service.data;

        for (let i = 0; i < amount; i++) {
            await sleep(wait);
            service.serviceExecute();
            if (i < amount - 1) {
                await sleep(interval);
            }
        }
    }
}

class Logger {
    private logger: winston.Logger;

    constructor(private level: LogLevel = LogLevel.INFO, private environment: string = process.env.STATE) {
        this.logger = winston.createLogger({
            level: this.level,
            defaultMeta: { environment: this.environment },
            transports: [
                new winston.transports.Console()
            ],
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.splat(),
                winston.format.json(),
                winston.format.colorize({
                    colors: {
                        error: 'red',
                        warn: 'yellow',
                        info: 'green',
                        debug: 'blue'
                    }
                }),
                winston.format.printf((info) => {
                    const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
                    return `[${timestamp}] [${info.level}] [${info.environment}] [${info.path}] ${info.message}`;
                })
            )
        });
    }

    public debug(message: string, meta: any): void {
        this.logger.debug(message, { path: meta });
    }

    public info(message: string, meta: any): void {
        this.logger.info(message, { path: meta });
    }

    public warn(message: string, meta: any): void {
        this.logger.warn(message, { path: meta });
    }

    public error(message: string, meta: any): void {
        this.logger.error(message, { path: meta });
    }
}


export { Util, Logger };