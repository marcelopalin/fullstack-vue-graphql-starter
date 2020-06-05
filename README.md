# INICIO

Requisitos: NodeJS instalado na máquina

Baixou o projeto em https://github.com/marcelopalin/fullstack-vue-graphql-starter

Instale as dependências:

Dependências originais do Curso:

```json
  "dependencies": {
    "apollo-server": "^2.0.0-rc.7",
    "bcrypt": "^3.0.0",
    "dotenv": "^6.0.0",
    "graphql": "^0.13.2",
    "jsonwebtoken": "^8.3.0",
    "md5": "^2.2.1",
    "mongoose": "^5.2.6"
  },
```

Dependências atuais:

```json
  "dependencies": {
    "apollo-server": "^2.14.2",
    "bcrypt": "^4.0.1",
    "dotenv": "^8.2.0",
    "graphql": "^15.0.0",
    "jsonwebtoken": "^8.5.1",
    "md5": "^2.2.1",
    "mongoose": "^5.9.17"
  },
```

```
npm i
```

# CRIANDO O SERVER.JS

Inicializando o servidor:

```js
const { ApolloServer } = require("apollo-server");

const server = new ApolloServer({});

server.listen();
```

Execute:

```
npm run server
```

Você verá que é exigido ambos, o Schema e TypeDefs

```
[nodemon] starting `node server.js`
C:\wamp64\www\fullstack-vue-graphql-starter\node_modules\apollo-server-core\dist\ApolloServer.js:232
                throw Error('Apollo Server requires either an existing schema, modules or typeDefs');
```

# Versão Inicial Completa

Precisamos definir os dados (TypeDefs) e os resolvers para passarmos
para o ApolloServer, a versão inicial fica:


```js
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

```

# PLAYGROUND

Acessando o http://localhost:4000/

Podemos executar a Query:

```graphql
{
  getTodos {
    task
    completed
  }
}
```

Podemos executar também a Mutation:

```graphql
mutation {
  addTodo(task: "Lavar roupa", completed: true) {
    task
    completed
  }
}
```

se executar a Query novamente verá a nova tarefa:

```graphql
{
  getTodos {
    task
    completed
  }
}
```

# DESTRUCTURING ARGS

Ao invés de usarmos a variável **args** na mutation podemos utilizar
o destructuring 
