#!/usr/bin/env node
'use strict';

const { join } = require('path');
const yargs = require('yargs');
const fs = require('fs-extra');
const chalk = require('chalk');
const jsonServer = require('json-server');
const chokidar = require('chokidar');
const stoppable = require('stoppable');

const requireUncached = module => {
  delete require.cache[require.resolve(module)];
  return require(module);
};

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
      let app;
      let server;
      let currentPort = port;
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
        const config = requireUncached(configSrc);

        const dbSrc = join(folderSrc, config.dbPath || 'db.js');
        if (!fs.pathExistsSync(dbSrc)) {
          console.error(`${dbSrc} doesn't exist, run mock create first!`);
          process.exit(1);
        }

        const db = requireUncached(dbSrc);

        app = jsonServer.create();
        const middlewares = jsonServer.defaults();
        app.use(middlewares);

        if (config.routes) {
          app.use(jsonServer.rewriter(config.routes));
        }

        app.use(jsonServer.bodyParser);
        app.use((req, res, next) => {
          if (req.method === 'POST') {
            req.body.createdAt = Date.now();
          }
          next();
        });

        const router = jsonServer.router(db);
        router.render = config.render;
        app.use(router);

        server = app.listen(currentPort, () => {
          console.log(
            `${chalk.green('JSON Server is running at port')} ${chalk.magenta(
              server.address().port
            )}`
          );
        });
        server = stoppable(server);

        server.on('error', e => {
          if (e.code === 'EADDRINUSE') {
            console.log(
              `${chalk.gray('Port')} ${chalk.yellowBright(currentPort++)} ${chalk.gray(
                'in use, trying'
              )} ${chalk.yellowBright(currentPort)} ${chalk.gray('instead...')}`
            );
            setTimeout(() => {
              server.close();
              server.listen(currentPort);
            }, 1000);
          }
        });
      };

      // watch file changes
      chokidar
        .watch(folderSrc, { ignored: /(^|[\/\\])\../, ignoreInitial: true })
        .on('all', (event, path) => {
          if (server) {
            console.log('');
            console.log(`${chalk.cyan(event)} ${chalk.grey(path)}`);
            console.log(chalk.yellow('server reloading...'));
            console.log('');
            server.stop(() => {
              startServer();
            });
          }
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
