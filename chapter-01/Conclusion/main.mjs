import { createStatementData } from './createStatementData.mjs';
import fs from 'fs'; // Importe o módulo fs para leitura de arquivos

const invoices = JSON.parse(fs.readFileSync('./invoices.json', 'utf8'));
const plays = JSON.parse(fs.readFileSync('./plays.json', 'utf8'));

const statementData = invoices.map(invoice => createStatementData(invoice, plays));

console.log(statementData);
// execute node --experimental-modules main.mjs