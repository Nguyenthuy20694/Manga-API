var manga = require('./Models/manga');

module.exports = {
configure: function(app) {
  app.get('/manga', function(req, res) {
    manga.get(res);
  });
  app.get('/manga'+'/category', function(req, res) {
    manga.category(res);
  });
  app.get('/manga'+'/category'+'/:id/', function(req, res) {
    manga.findbyCategory(req.params.id,res);
  });
  app.get('/manga'+'/:keyword'+'/search', function(req, res) {
    manga.search(req.params.keyword,res);
  });
  app.get('/manga'+'/:id/', function(req, res) {
    manga.detail(req.params.id,res);
  });
  app.get('/manga'+'/:id/'+ 'chapter', function(req, res) {
    manga.chapter(req.params.id,res);
  });
  app.get('/manga'+'/chapter'+'/:id/', function(req, res) {
    manga.read(req.params.id,res);
  });
  app.get('/manga'+'/chapter'+'/:id/'+'image', function(req, res) {
    manga.list_image(req.params.id,res);
  });
  app.get('/user/'+'/:id/', function(req, res) {
    manga.user(req.params.id,res);
  });
  app.post('/user'+'/signin', function(req, res) {
    manga.login(req.body, res);
  });
  app.post('/user'+'/signup', function(req, res) {
    manga.register(req.body, res);
  });

}
};