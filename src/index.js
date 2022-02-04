const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const { resolvers } = require('./resolvers');
const { schema: typeDefs } = require('./typeDefs');
const { PrismaClient } = require('@prisma/client');
const express = require('express');
const session = require("express-session");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { GraphQLLocalStrategy, buildContext } = require("graphql-passport");

const SESSION_SECRECT = 'wooo';

const prisma = new PrismaClient();

async function startApolloServer() {

  passport.serializeUser((user, done) => {
    console.log('serializeUser', user)
    done(null, user.id);
  })

  passport.deserializeUser(async (id, done) => {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    console.log('deserializeUser', user);
    done(null, user);
  })

  passport.use(
      new GraphQLLocalStrategy(async (email, password, done) => {
          console.log('login two');
          // Adjust this callback to your needs
          const matchingUser = await prisma.user.findUnique({
              where: {
                  email,
              }
          });

          console.log('matchingUser', matchingUser);

          let error = matchingUser ? null : new Error("no matching user");
          if(matchingUser) {
            const valid = await bcrypt.compare(password, matchingUser.password);
            error = valid ? null : new Error("Invalid password");
          }
          done(error, matchingUser);
      })
    );

    // Required logic for integrating with Express
  const app = express();

  const sessionMiddleware = session({
    genid: () => uuidv4(),
    secret: SESSION_SECRECT,
    resave: false,
    saveUninitialized: false,
  }); // optional
  const passportMiddleware = passport.initialize();
  const passportSessionMiddleware = passport.session();

  app.use(sessionMiddleware); // optional
  app.use(passportMiddleware);
  app.use(passportSessionMiddleware);


  // Same ApolloServer initialization as before, plus the drain plugin.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req, res}) => buildContext({req, res, prisma}),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

    // More required logic for integrating with Express
    await server.start();
    server.applyMiddleware({ app, path: '/' });

    // Modified server startup
    await app.listen({ port: 4000 });
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer();
