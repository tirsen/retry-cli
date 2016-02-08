# retry-cli

Command line interface for retrying other commands with exponential backoff.

## Installation

    npm install retry-cli

## Based on

Just a command line interface to https://www.npmjs.com/package/retry

## Example

```
-> % node cli.js -t 1000 -n 3 -- ls asdf
ls: asdf: No such file or directory
ls: asdf: No such file or directory
ls: asdf: No such file or directory
ls: asdf: No such file or directory
```

## Documentation

```
Usage: retry [OPTION] -- [COMMAND]

  -n, --retries=ARG      The maximum amount of times to retry the operation. Default is 10.
      --factor=ARG       The exponential factor to use. Default is 2.
  -t, --min-timeout=ARG  The number of milliseconds before starting the first retry. Default is 1000.
      --max-timeout=ARG  The maximum number of milliseconds between two retries. Default is Infinity.
      --randomize        Randomizes the timeouts by multiplying with a factor between 1 to 2. Default is false.
  -h, --help             display this help.
```
