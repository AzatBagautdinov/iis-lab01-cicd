const http = require('node:http');
const {createServer} = require('../src/app');
let server, port;
beforeAll(done => {server = createServer(); server.listen(0,'127.0.0.1', () => {port = server.address().port; done();});});
afterAll(done => { server.close(done); });
function request(path, method='GET', body) {
  return new Promise((resolve,reject) => {
    const req = http.request({host:'127.0.0.1',port,path,method}, res => {
      let data=''; res.on('data', x => data+=x); res.on('end', () => resolve({status:res.statusCode,data:JSON.parse(data)}));
    });
    req.on('error',reject); if (body !== undefined) req.write(body); req.end();
  });
}
test('health and fixed rates', async () => {
  expect((await request('/health')).status).toBe(200);
  expect((await request('/rates')).data.rates.USD).toBe(90);
});
test('HTTP conversion and history', async () => {
  expect((await request('/convert','POST',JSON.stringify({amount:2,from:'USD',to:'RUB'}))).data.result).toBe(180);
  expect((await request('/history')).data).toHaveLength(1);
});
test.each(['{','null','{"amount":-1,"from":"USD","to":"RUB"}','{"amount":1,"from":"GBP","to":"RUB"}'])('bad request is rejected',async body => expect((await request('/convert','POST',body)).status).toBe(400));
test('oversized body and missing route',async () => {
  expect((await request('/convert','POST','x'.repeat(5000))).status).toBe(413);
  expect((await request('/missing')).status).toBe(404);
});
