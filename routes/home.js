module.exports = function (router) {
  var homeRoute = router.route('/');
  homeRoute.get(function (req, res) {
    res.json({
      message: 'Welcome to WCS Point Checker',
    })
  });
  return router
}