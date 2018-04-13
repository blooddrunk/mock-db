#!/usr/bin/env node
'use strict';

const { join } = require('path');
const yargs = require('yargs');
const fs = require('fs-extra');
const chalk = require('chalk');

const argv = yargs
  .usage('mock <cmd> [args]')
  .command(
    'run [dir]',
    'run json-server at specified port',
    yargs => {
      return yargs
        .positional('dir', {
          describe: 'Specify config folder path. defaults to mock',
          default: 'mock',
          type: 'string',
        })
        .option('p', {
          alias: 'port',
          demandOption: true,
          default: 3001,
          describe: 'Specify the port to run json-server on. defaults to 3001',
          type: 'number',
        });
    },
    ({ port, dir }) => {
      let server;
      const folderSrc = join(process.cwd(), dir);

      const startServer = () => {
        if (!fs.pathExistsSync(folderSrc)) {
          console.error(`${folderSrc} doesn't exist, run mock create first!`);
          process.exit(1);
        }

        const configSrc = join(folderSrc, 'mock.config.js');
        if (!fs.pathExistsSync(configSrc)) {
          console.error(`${configSrc} doesn't exist, run mock create first!`);
          process.exit(1);
        }
        const config = require(configSrc);

        const dbSrc = join(folderSrc, config.dbPath || 'db.js');
        if (!fs.pathExistsSync(dbSrc)) {
          console.error(`${dbSrc} doesn't exist, run mock create first!`);
          process.exit(1);
        }

        const db = require(dbSrc);
        const jsonServer = require('json-server');

        const app = jsonServer.create();
        const middlewares = jsonServer.defaults();
        app.use(middlewares);

        if (config.routes) {
          app.use(jsonServer.rewriter(config.routes));
        }

        const router = jsonServer.router(db);
        router.render = config.render;

        app.use(router);
        server = app.listen(port, () => {
          console.log(`${chalk.green('JSON Server is running at port')} ${chalk.magenta(port)}`);
        });
      };

      // watch file changes
      const chokidar = require('chokidar');
      chokidar
        .watch(folderSrc, { ignored: /(^|[\/\\])\../, ignoreInitial: true })
        .on('all', (event, path) => {
          if (server) {
            console.log('');
            console.log(`${chalk.cyan(event)} ${chalk.grey(path)}`);
            console.log(chalk.yellow('server reloading...'));
            console.log('');
            server.close();
          }
          startServer();
        });

      startServer();
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
        });
    },
    ({ moduleName, force }) => {
      const folderSrc = join(__dirname, 'scaffolding');
      const folderDst = join(process.cwd(), moduleName);
      fs.copySync(folderSrc, folderDst, {
        overwrite: force,
        errorOnExist: true,
      });
      console.log(
        `Db and config file created in ${moduleName}, use "mock run" to start json-server and try checking http://localhost:{YOUR_PORT}/posts?_limit=10&_page=1`
      );
    }
  )
  .demandCommand(1, 'You need at least one command before moving on')
  .help().argv;
