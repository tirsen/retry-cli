#!/usr/bin/env node
import retry from 'retry';
import spawn from 'cross-spawn';
import Getopt from 'node-getopt';

const getopt = new Getopt([
  ['n', 'retries=ARG', 'Maximum amount of times to retry the operation. (default: 10)'],
  ['f', 'factor=ARG', 'Exponential factor to use. (default: 2)'],
  ['t', 'min-timeout=ARG', 'Number of milliseconds before starting the first retry. (default: 1000)'],
  ['', 'max-timeout=ARG', 'Maximum number of milliseconds between two retries. (default: Infinity)'],
  ['', 'randomize', 'Randomizes the timeouts by multiplying with a factor between 1 to 2.'],
  ['h', 'help', 'Display this help.']
]);

getopt.setHelp(
  "Usage: retry [OPTION] -- [COMMAND]\n" +
  "\n" +
  "[[OPTIONS]]\n" +
  "\n" +
  "Examples:\n" +
  "retry -- ls -lah dir\n" +
  "retry -n 3 -t 100 -- ls asdf"
);

const opt = getopt.parse(process.argv);

const cmd = opt.argv.slice(2);

if (!cmd[0]) {
  getopt.showHelp();
  process.exit();
}

const operation = retry.operation({
  retries: opt.options['retries'] || 10,
  factor: opt.options['factor'] || 2,
  minTimeout: opt.options['min-timeout'] || 1000,
  maxTimeout: opt.options['max-timeout'] || Infinity,
  randomize: opt.options['randomize'] || false
});

/** @param {Error | undefined} err */
/** @param {number} code */
function retryOrExit(err, code) {
  const willRetry = operation.retry(err);
  if (!willRetry) process.exit(code)
}

operation.attempt((_currentAttempt) => {
  const ls = spawn(cmd[0], cmd.slice(1), {stdio: 'inherit'});

  // The strict 0 check also catches null (involuntary exit via signal) as a retryable error
  ls.on('exit', (code) => retryOrExit(code !== 0 ? new Error(`Exited with code ${code}`) : undefined, code ?? 1));
  ls.on('error', (err) => retryOrExit(err, 1));
});
