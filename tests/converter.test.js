const {CurrencyConverter} = require('../src/currencyConverter');
describe('Fixed teaching conversion', () => {
  test.each([[10,'USD','RUB',900],[10,'EUR','USD',11.11],[0,'RUB','USD',0],[7,'EUR','EUR',7]])('%s %s -> %s', (a,f,t,expected) => expect(new CurrencyConverter().convert(a,f,t).result).toBe(expected));
  test.each([-1, NaN, Infinity, '10', null, 1e13])('rejects invalid amount %s', amount => expect(() => new CurrencyConverter().convert(amount,'USD','RUB')).toThrow(RangeError));
  test.each(['BTC','usd','__proto__','toString',null])('rejects unsupported currency %s', currency => expect(() => new CurrencyConverter().convert(1,currency,'RUB')).toThrow());
  test('round-trip within rounding tolerance and immutable history copy', () => {
    const c = new CurrencyConverter();
    const first = c.convert(100,'RUB','USD');
    expect(Math.abs(c.convert(first.result,'USD','RUB').result - 100)).toBeLessThan(0.5);
    first.result = -5;
    const history = c.getHistory(); history[0].result = -10;
    expect(c.getHistory()[0].result).toBe(1.11);
    expect(c.getHistory()).toHaveLength(2);
  });
});
