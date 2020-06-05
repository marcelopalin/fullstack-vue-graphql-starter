const { ApolloServer, gql } = require("apollo-server");

const todos = [
  { task: "Lavar carro", completed: false },
  { task: "Arrumar o quarto", completed: true },
];

const typeDefs = gql`
  type Todo {
    task: String
    completed: Boolean
  }

  type Query {
    getTodos: [Todo]
  }

  type Mutation {
    addTodo(task: String, completed: Boolean): Todo
  }
`;

const resolvers = {
  Query: {
    getTodos: () => {
      return todos;
    },
  },
  Mutation: {
    addTodo: (_, args) => {
      const todo = { task: args.task, completed: args.completed };
      todos.push(todo);
      return todo;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
