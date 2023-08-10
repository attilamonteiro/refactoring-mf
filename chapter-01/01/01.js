const fs = require('fs'); // Módulo de sistema de arquivos do Node.js

// Carregar dados dos arquivos JSON
const invoicesData = fs.readFileSync('invoices.json', 'utf-8');
const playsData = fs.readFileSync('plays.json', 'utf-8');
const invoices = JSON.parse(invoicesData);
const plays = JSON.parse(playsData);

function statement (invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = new Intl.NumberFormat("en-US",
    { style: "currency", currency: "USD",
    minimumFractionDigits: 2 }).format;
    
    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        let thisAmount = 0;
        switch (play.type) {
            case "tragedy":
                thisAmount = 40000;
                if (perf.audience > 30) {
                    thisAmount += 1000 * (perf.audience - 30);
                }
                break;
            case "comedy":
                thisAmount = 30000;
                if (perf.audience > 20) {
                    thisAmount += 10000 + 500 * (perf.audience - 20);
                }
                thisAmount += 300 * perf.audience;
                break;
            default:
                throw new Error(`unknown type: ${play.type}`);
        }
        // soma créditos por volume
        volumeCredits += Math.max(perf.audience - 30, 0);
        // soma um crédito extra para cada dez espectadores de comédia
        if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);
        // exibe a linha para esta requisição
        result += ` ${play.name}: ${format(thisAmount/100)} (${perf.audience} seats)\n`;
        totalAmount += thisAmount;
    }
    result += `Amount owed is ${format(totalAmount/100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
}

// Exemplo de uso
const invoice = invoices[0]; // Use uma fatura específica
const statementResult = statement(invoice, plays);
console.log(statementResult);
