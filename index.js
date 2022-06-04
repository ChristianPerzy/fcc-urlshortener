require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const URL = require('url').URL;

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


let short_urls = [];
let surls_index = 0;

app.post('/api/shorturl', (req, res) => {
  let url = req.body.url;
  try {
    url = new URL(url);
  } catch(err) {
    return res.json({error: 'invalid url'});
  }

  dns.lookup(url.hostname, (err, hostname, service) => {
    if (err) return res.json({error: 'hostname not reachable'});

    short_urls.push({
      original_url: url.href,
      short_url: surls_index++
    });
    res.json(short_urls[surls_index-1]);
  });
});

app.get('/api/shorturl/:url_code', (req, res) => {
  let url_code = req.params.url_code;
  url_code = Number(url_code);

  let entry = short_urls.find((val) => val.short_url == url_code);
  res.redirect(entry.original_url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
