#!/usr/bin/env node

const program = require('commander')

program
  .version('0.0.1', '-v, --version')
  .option('-p, --port <port>', 'Specify port to run on', parseInt)
  .parse(process.argv)

const jsonServer = require('json-server')
// const path = require('path')
const db = require('./dbInMemory')
const renderByPath = require('./renderByPath')

const server = jsonServer.create()
const middlewares = jsonServer.defaults()
server.use(middlewares)

server.use(
  jsonServer.rewriter({
    '/api/*': '/$1',
  })
)

// const router = jsonServer.router(path.join(__dirname, 'db.js'))
const router = jsonServer.router(db)
router.render = (req, res) => {
  const result = renderByPath(req, res)
  res.jsonp(result)
}

const port = program.port || 3001
server.use(router)
server.listen(port, () => {
  console.log(`JSON Server is running at port ${port}`)
})
