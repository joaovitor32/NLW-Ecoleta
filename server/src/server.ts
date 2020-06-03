import express, { response } from 'express';
import path from 'path'
import routes from './routes';
import cors from 'cors'

const app=express();

//Rota: Endereço completo da requisição
//Recurso: Qual entidade estamos tentando acessar

//GET: Buscar Informações
//POST: Criar uma nova informação
//PUT: Atualizar uma informação existente no Back-End
//DELETE: Remover uma informação do Back-End

//GET: http://localhost:3333/users = listar usuario
//POST: http://localhost:3333/users = Criar Usuario
//GET: http://localhost:3333/users/5 = buscar dados do Usuario de ID 5 

//Request param: Parametros que vem na própia rota que identificam um recurso
//Query param: Parametros que vem na propia rota geralmente opcionais par filtros, paginacao
//Request Body: Parametros para criação/atualização de informações
app.use(cors())
app.use(express.json())

app.use(routes);

app.use('/uploads',express.static(path.resolve(__dirname,'..','uploads')))

app.listen(3333);




