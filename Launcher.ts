import { Bot } from './src/Client';
import { config } from 'dotenv';

config();

new Bot().initialize();