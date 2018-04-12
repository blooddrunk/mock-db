#!/usr/bin/env node
'use strict'

const { join } = require('path')
const yargs = require('yargs')
const shell = require('shelljs')
const fs = require('fs-extra')

const argv = yargs
  .usage('mock <cmd> [args]')
  .command(
    'run',
    'run json-server at specified port',
    {
      p: {
        alias: 'port',
        demandOption: true,
        default: 3001,
        describe: 'Specify the port to run json-server on. defaults to 3001',
        type: 'number',
      },
      d: {
        alias: 'dir',
        demandOption: false,
        default: 'mock',
        describe: 'Specify config folder path. defaults to mock',
        type: 'string',
      },
    },
    ({ port, dir }) => {
      const folderSrc = join(process.cwd(), dir)
      if (!fs.pathExistsSync(folderSrc)) {
        console.error(`${folderSrc} doesn't exist, run mock create first!`)
        process.exit(1)
      }

      const configSrc = join(folderSrc, 'mock.config.js')
      if (!fs.pathExistsSync(configSrc)) {
        console.error(`${configSrc} doesn't exist, run mock create first!`)
        process.exit(1)
      }
      const config = require(configSrc)

      const dbSrc = join(folderSrc, config.dbPath || 'db.js')
      if (!fs.pathExistsSync(dbSrc)) {
        console.error(`${dbSrc} doesn't exist, run mock create first!`)
        process.exit(1)
      }

      const db = require(dbSrc)
      const jsonServer = require('json-server')

      const server = jsonServer.create()
      const middlewares = jsonServer.defaults()
      server.use(middlewares)

      if (config.routes) {
        server.use(jsonServer.rewriter(config.routes))
      }

      const router = jsonServer.router(db)
      router.render = config.render

      server.use(router)
      server.listen(port, () => {
        console.log(`JSON Server is running at port ${port}`)
      })
    }
  )
  .command(
    'create [moduleName]',
    'create default mock-db structure',
    yargs => {
      return yargs
        .positional('moduleName', {
          describe: 'mock folder name',
          default: 'mock',
          type: 'string',
        })
        .option('f', {
          alias: 'force',
          boolean: true,
          describe: 'remove folder first if exists',
        })
    },
    ({ moduleName, force }) => {
      const folderSrc = join(__dirname, 'scaffolding')
      const folderDst = join(process.cwd(), moduleName)
      fs.copySync(folderSrc, folderDst, {
        overwrite: force,
        errorOnExist: true,
      })
      console.log(
        `edit db and config file in ${moduleName}, use "mock run" to start json-server`
      )
    }
  )
  .demandCommand(1, 'You need at least one command before moving on')
  .help().argv
