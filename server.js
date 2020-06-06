const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "schema_graphql", "typeDefs.gql");
const typeDefs = fs.readFileSync(filePath, "utf-8");

const resolvers = require("./resolvers");

const User = require("./schema_mongoose/User");
const Post = require("./schema_mongoose/Post");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    User,
    Post
  }
});

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
