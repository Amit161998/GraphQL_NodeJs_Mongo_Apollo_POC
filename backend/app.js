const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const {
    graphqlHTTP
} = require('express-graphql');
const graphQLSchema = require('./graphql/schema')
const graphQLResolver = require('./graphql/resolvers');
const e = require('express');

const app = express()


app.use(bodyParser.json());

app.use(cors())

//graphql middleware 
https: //medium.com/codingthesmartway-com-blog/creating-a-graphql-server-with-node-js-and-express-f6dddc5320e1
    app.use('/graphql', graphqlHTTP({
        schema: graphQLSchema,
        rootValue: graphQLResolver,
        graphiql: true,
    }))

mongoose.connect(`mongodb://localhost:27017/quotations?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false`, {
    useUnifiedTopology: true
}).then(() => {
    app.listen(3000, console.log("Connected to port 3000 & Mongo connected Successfully"))
}).catch((err) => {
    console.log(err)
})

// const foo = [1, 2, 3]
// const [n] = foo
// console.log(n)

// var start = 1;