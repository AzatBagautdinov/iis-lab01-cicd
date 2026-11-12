const http = require('node:http');
const rates = require('./exchangeRates');
const {CurrencyConverter} = require('./currencyConverter');

function createServer(converter = new CurrencyConverter()) {
  return http.createServer(async (req, res) => {
    const send = (status, data) => {
      res.writeHead(status, {'Content-Type': 'application/json; charset=utf-8'});
      res.end(JSON.stringify(data));
    };
    if (req.method === 'GET' && req.url === '/health') return send(200, {status: 'ok'});
    if (req.method === 'GET' && req.url === '/rates') return send(200, {rates, note: 'Fictional teaching rates, not market quotes'});
    if (req.method === 'GET' && req.url === '/history') return send(200, converter.getHistory());
    if (req.method === 'POST' && req.url === '/convert') {
      let body = '';
      try {
        for await (const chunk of req) {
          body += chunk;
          if (Buffer.byteLength(body) > 4096) return send(413, {error: 'Request too large'});
        }
        const {amount, from, to} = JSON.parse(body);
        return send(200, converter.convert(amount, from, to));
      } catch (error) {
        if (error instanceof SyntaxError || error instanceof TypeError || error instanceof RangeError) {
          return send(400, {error: error.message});
        }
        return send(500, {error: 'Internal error'});
      }
    }
    return send(404, {error: 'Not found'});
  });
}

if (require.main === module) {
  createServer().listen(Number(process.env.PORT || 3101), process.env.HOST || '127.0.0.1', () => console.log('Currency API started'));
}
module.exports = {createServer};
