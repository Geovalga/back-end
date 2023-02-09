const https = require('https')
https.get("https://jsonplaceholder.typicode.com/users", res => {
  let Data = '';
  res.on('data', chunk => {
    Data += chunk;
  });
  res.on('end', () => {
    Data = JSON.parse(Data);
    module.exports.data = Data;
  })
}).on('error', err => {
    module.exports.data = err.message;
})