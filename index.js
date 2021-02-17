const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { graphqlHTTP } = require('express-graphql')
const { execute, subscribe } = require('graphql')
const expressPlayground = require('graphql-playground-middleware-express').default
const { SubscriptionServer } = require('subscriptions-transport-ws')
const schema = require('./schema')

const app = express()

const endpoint = '/graphql'
const host = 'localhost'
const port = 3000
const subscriptionsEndpoint = '/subscriptions'

app.use(cors())

app.use(
  endpoint,
  bodyParser.json(),
  graphqlHTTP({
    schema,
  }),
)

app.get(
  '/',
  expressPlayground({
    endpoint,
    subscriptionEndpoint: `ws://${host}:${port}${subscriptionsEndpoint}`,
  }),
)

const server = app.listen(port, () => {
  console.log(`🎯 Playground: http://${host}:${port}`)
  console.log(`🚀 GraphQL: http://${host}:${port}${endpoint}`)
  console.log(`🚨 Subscriptions: ws://${host}:${port}${subscriptionsEndpoint}`)
})

SubscriptionServer.create({
    execute,
    subscribe,
    schema,
  },
  {
    server,
    path: subscriptionsEndpoint,
  },
)