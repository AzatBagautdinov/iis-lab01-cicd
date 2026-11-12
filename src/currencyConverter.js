const rates = require('./exchangeRates');

class CurrencyConverter {
  constructor() { this.history = []; }

  convert(amount, from, to) {
    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 0 || amount > 1e12) {
      throw new RangeError('amount must be a finite number from 0 to 1e12');
    }
    if (!Object.hasOwn(rates, from) || !Object.hasOwn(rates, to)) {
      throw new RangeError('Supported currencies: RUB, USD, EUR');
    }
    const result = Math.round((amount * rates[from] / rates[to] + Number.EPSILON) * 100) / 100;
    const entry = {amount, from, to, result, rates: 'fixed-teaching-v1'};
    this.history.push(entry);
    return {...entry};
  }

  getHistory() { return this.history.map(entry => ({...entry})); }
}

module.exports = {CurrencyConverter};
