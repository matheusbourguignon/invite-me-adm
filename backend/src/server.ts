import fastify from "fastify";

const app = fastify()

app.get('/', () => {
    return 'Hello NLW Unite'
})

app.get('/users', () => {
    return 'Hello Teste'
})

app.post('/users', () => {
    return 'Hello Teste'
})

app.listen({ port: 3000}).then(() => {
    console.log('HTTP server running');
    
})

//localhost:3333