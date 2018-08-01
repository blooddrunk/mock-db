# mock-db

Simple cli tool to to create a local data mock server based on **json-server**.

### Install

```
npm i -g blooddrunk/mock-db
```

### Usage

```
mock create
```

By default, `mock create` creates a folder named `mock` insider current directory with a config file `mock.config.js` and an example DB file `db.js` inside it.

Edit `db.js`(using faker or chance js for example), then run

```
mock run
```

You should find json-server launched on http://localhost:3001

You can change json-server' render method and route mapper insider `mock.config.js`. You can also specify you own db file path in `mock.config.js`

```
mock --help

cli.js run [dir]            run json-server at specified port
cli.js create [moduleName]  create default mock-db structure
```

```
mock create --help

Positional：
  moduleName  mock folder name                         [string] [default: "mock"]

Optional:
  -f, --force  remove folder first if exists                              [boolean]
```

```
mock run --help

Positional：
  dir  Specify config folder path. defaults to mock    [string] [default: "mock"]

Optional：
  -p, --port  Specify the port to run json-server on. defaults to 3001
                                                    [number] [required] [default: 3001]
  -o, --open  Whether or not open default browser to inspect json-server root.
              defaults to false                                           [boolean]
```
