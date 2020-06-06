# 2. CRIANDO UM BANCO DE DADOS e UM USUARIO ADMIN DO BD

1) Autentique-se

```
mongo -u mpi -p 
use admin
```

Caso ele já exista: 
```
use api_graphql_gestao_db
show users
{
        "_id" : "api_gestao.admin_apis",
        "userId" : UUID("9d3c8e17-9ad9-42bc-8d73-e7644f39fdc3"),
        "user" : "admin_apis",
        "db" : "api_gestao",
        "roles" : [
                {
                        "role" : "readWrite",
                        "db" : "api_gestao"
                }
        ],
        "mechanisms" : [
                "SCRAM-SHA-1",
                "SCRAM-SHA-256"
        ]
}
> db.dropUser("admin_apis")
true
```

2) Execute o comando:

```json
> use api_graphql_gestao_db
switched to db api_graphql_gestao_db
> db.createUser(
    {
      user: "admin_apis",
      pwd:  "Ampere159", //passwordPrompt(), 
      roles: [ 
       { role: "readWrite", db: "api_graphql_gestao_db" },
       { role: "readWrite", db: "api_gestao" }
      ]
    }
  )
Successfully added user: {
        "user" : "admin_apis",
        "roles" : [
                {
                        "role" : "readWrite",
                        "db" : "api_graphql_gestao_db"
                },
                {
                        "role" : "readWrite",
                        "db" : "api_gestao"
                }
        ]
}

```