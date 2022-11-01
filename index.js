/* 
   -Query params => meusite.com/users?nome=henrique&age=23 //Filtros
   -Route params => /users/2 //Buscar, Deletar ou Atualizar algo especifíco
   -Request Body => {"name" : "Henrique", "age":}

   GET => Buscar informação no Back-End
   POST => Criar informação no Back-End
   PUT / PATCH => Alterar/Atualizar informação no Back-End
   DELETE => Deletar informação no Back-End
*/ 


const { response } = require('express')
const express = require('express') //exportando o express
const uuid = require('uuid')

const port =3000
const app = express()
app.use(express.json())
 //app.use(myFirstMiddleware)


const users = [] //Array para armazenar usuários

const checkUserId = ( request, response, next ) => {
    const { id } = request.params

    const index = users.findIndex( user => user.id === id ) //posição do usuário no array

    if(index < 0 ){
        return response.status(404).json({ message: "User not found" }) //Informando sobre usuário não existente
    }

    request.userIndex = index
    request.userId = id

    next()
}

app.get('/users', (request, response) => {
    return response.json(users)
}) //criando uma rota

app.post('/users', (request, response) => {
    const { name, age } = request.body

    const user = { id:uuid.v4(), name, age } //gerando o "id" para o usuário, através da biblioteca uuid

    users.push(user)

    return response.status(201).json(user)
}) //criando uma rota

app.put('/users/:id', checkUserId, (request, response) => {
    const { name, age } = request.body
    const index = request.userIndex
    const id = request.userId

    const updatedUser = { id, name, age } //updatedUser = usuário atualizado

   
    
    users[index] = updatedUser // Alteração(atualização) nas informações do usuário

    return response.json(updatedUser)
})

app.delete('/users/:id', checkUserId, (request, response) => {
    const index = request.userIndex

    users.splice(index, 1)

    return response.status(204).json()
})

app.listen(port)