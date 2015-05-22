var Hapi = require('hapi'),
Good = require('good'),
server = new Hapi.Server();

server.connection({
  port: 3030
});

server.route([{
  method: 'GET',
  path: '/',
  handler: function(request, reply){
    reply("Hello World");
  }
  },{
    method : 'GET',
    path: '/{name}',
    handler: function(request, reply){
      reply('Hello, ' + encodeURIComponent(request.params.name) + '!' );
    }
  }]);

server.state('session', {
  ttl: 24*60*60*100,
  isSecure: true,
  path: '/',
  encoding: 'base64json'
});

var handler = function(request, reply){
  var session = request.this.state.session;
  if (!session) {
    session = {user: 'richard'}
  };

  session.last = Date.now();

  return reply('Success').state('session', session);
};

server.register({
  register: Good,
  options: {
    reporters: [{
      reporter: require('good-console'),
      events: {
        response: '*',
        log: '*'
      }
    }]
  }
}, function(err){
  if(err){
    throw err;
  }
  server.start(function(){
    server.log('info', 'Server running at: ' + server.info.uri);
  })
});