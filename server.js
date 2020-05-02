var express = require('express'),
  request = require('request'),
  bodyParser = require('body-parser'),
  app = express();

var myLimit = typeof process.argv[2] != 'undefined' ? process.argv[2] : '100kb';
console.log('Using limit: ', myLimit);

app.use(bodyParser.json({ limit: myLimit }));

app.all('*', function (req, res, next) {
  // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE');
  res.header('Access-Control-Allow-Headers', req.header('access-control-request-headers'));
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');

  var targetURL = req.header('Target-URL');
  if (!targetURL) {
    res.send(500, { error: 'There is no Target-URL header in the request' });
    return;
  }
  console.log('Requesting URL: ' + targetURL);
  request(
    { url: targetURL + req.url, method: req.method, qs: req.query },
    function (error) {
      if (error) res.send(404, { error });
    }
  ).pipe(res);
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
  console.log('Proxy server listening on port ' + app.get('port'));
});
