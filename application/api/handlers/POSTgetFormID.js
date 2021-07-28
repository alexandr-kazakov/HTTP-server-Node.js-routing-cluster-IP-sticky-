module.exports = function POSTgetFormID() {
  return async function (fn, req, res) {
    let body = '';

    req.on('data', function (data) {
      body += data;
    });

    req.on('end', function () {
      let post = qs.parse(body);
      console.log(`post: ${post}`);
      res.statusCode = 200;
      res.end('Not bad');
    });
  };
};
