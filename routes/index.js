const graphql_route = require('./graphql')

module.exports = function (app) {
  app.use('/graphql', graphql_route);
};