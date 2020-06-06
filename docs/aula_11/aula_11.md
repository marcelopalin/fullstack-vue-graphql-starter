# CRIANDO O BD NO MLAB CLOUD MONGODB

- No curso ele cria o BD na nuvem
  
- Ensina como utilizar o dotenv para pegar a string de conexão

```
use fullstack_db;
db.createUser(
   {
     user: "admin_apis",
     pwd:  "Ampere159", //passwordPrompt(),   
     roles: [ { role: "readWrite", db: "api_graphql_gestao_db" },
     {role: "userAdminAnyDatabase" , db:"admin"}]
   }
 )
```