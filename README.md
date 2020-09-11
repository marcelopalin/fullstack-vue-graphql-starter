# 1. INICIO

PROJETO PÚBLICO: GITHUB https://github.com/marcelopalin/fullstack-vue-graphql-starter

Requisitos: NodeJS instalado na máquina

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

# Alterando o comando START

Ao invés de utilizarmos o **server** vamos criar no 
package.json o comando start:

```
"start": "nodemon server.js --ext js,graphql,gql",
```

Veja que definimos que qualquer alteração nos arquivos do tipo js, graphql ou gql
deve reiniciar o servidor.


# 2. CRIANDO O SERVER.JS

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

# 3. Versão Inicial Completa

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

# 4. PLAYGROUND

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

# 5. DESTRUCTURING ARGS

Ao invés de usarmos a variável **args** na mutation podemos utilizar
o destructuring.

# 6. CONFIGURAÇÕES DO BD LOCAL

Vamos instalar os Plug-ins no VSCode para nos auxiliar.

Plug-ins:
- DotEnv
- Eslint
- GraphQL for VSCode
- SQL Tools

# 7. BD MONGO

USER: admin_apis
PASS: SENHA_USER_BD
BD: fullstack_db

CRIANDO o BD e USUARIO ADMIN DO BD

1) Autentique-se com o Admin do MONGO

```
mongo -u useradmin -p SENHA_ADMIN --authenticationDatabase admin
```

2) Execute o comando:

```json
> use fullstack_db
switched to db fullstack_db
db.createUser({
   user: "admin_apis",
   pwd:  "senha123", //passwordPrompt(), 
   roles: [ { role: "readWrite", db: "fullstack_db" }]
})

Successfully added user: {
	"user" : "admin_apis",
	"roles" : [
		{
			"role" : "readWrite",
			"db" : "fullstack_db"
		}
	]
}
```

Não esqueça de acertar seu arquivo **.env** com a seguinte string de conexão:

```ini
# MONGODB 
MONGO_URI=mongodb://admin_apis:SENHA_USER_BD@127.0.0.1:27017/fullstack_db
```


# 8. AJUSTANDO O CODIGO PARA CONEXÃO COM O BD MONGODB LOCAL

```
npm i -S mongoose, dotenv
```

```js
const mongoose = require("mongoose");
require("dotenv").config(); // .env
// require("dotenv").config({ path: 'config/config.env'});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));
```

# REFATORANDO O CÓDIGO - VERSÃO I

Vamos fazer a leitura sem o auxílio do graphql-import.

server.js:

```js
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
const filePath = path.join(__dirname,"schema_graphql", "typeDefs.gql");
const typeDefs = fs.readFileSync(filePath, "utf-8");

const resolvers = require("./resolvers");

const User = require("./schema_mongoose/User");
const Post = require("./schema_mongoose/Post");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
```

Nele já importamos os dois Schemas, do MongoDB e do GraphQL.

Se colocarmos lado a lado os arquivos:

schema_graphql\typeDefs.gql

com schema_mongoose\User.js e schema_mongoose\Post.js


E os resolvers são:

```js
module.exports = {
  Query: {
    getPosts: async (_, args, { Post }) => {
      const posts = await Post.find({}).sort({ createdDate: "desc" }).populate({
        path: "createdBy",
        model: "User",
      });
      return posts;
    },
  },
  Mutation: {
    addPost: async (
      _,
      { title, imageUrl, categories, description, creatorId },
      { Post }
    ) => {
      const newPost = await new Post({
        title,
        imageUrl,
        categories,
        description,
        createdBy: creatorId,
      }).save();
      return newPost;
    },
    /** Registra o usuário */
    signupUser: async (_, { username, email, password }, { User }) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error("User already exists");
      }
      const newUser = await new User({
        username,
        email,
        password,
      }).save();
      return newUser;
    },
  },
};
```

E no Schema do GraphQL em schema_graphql\typeDefs.gql

@unique dá problemas, talvez na versão anterior funcionasse

```graphql
scalar Date

type User {
  _id: ID
  username: String! 
  email: String!
  password: String!
  avatar: String
  joinDate: String
  favorites: [Post]
}

type Post {
  title: String!
  imageUrl: String!
  categories: [String]!
  description: String!
  createdDate: Date
  likes: Int
  createdBy: User!
  messages: [Message]
}

type Message {
  _id: ID
  messageBody: String!
  messageDate: Date
  messageUser: User!
}

type Query {
  getPosts: [Post]
}

type Mutation {
  addPost(
    title: String!
    imageUrl: String!
    categories: [String]!
    description: String!
    creatorId: ID!
  ): Post!
  signupUser(username: String!, email: String!, password: String!): User!
}
```


# INICIANDO OS TESTES NO PLAYGROUND

Inicie o servidor:

```
npm run server
```

Acesse a URL http://localhost:4000

Execute a primeira Mutation de Registrar um Usuário:

```graphql
mutation {
  signupUser(username:"palin", email: "palin@mail.com", password: "senha123") {
    _id
    username
    email
    password
    avatar
  }
}
```

```graphql
mutation {
  addPost(title: "Introdução ao MongoDB", 
    imageUrl: "http://image", 
    categories: ["Artes","Gráfico"], 
    description: "Obra Importante", 
    creatorId: "5edbcdd25120523b506a238c" ) {
    title
    imageUrl
    description
  }
}
```

```graphql
query {
  getPosts{
    title
    imageUrl
    categories
    description
    createdDate
    createdBy {
      username
      email
    }
  }
}
```


