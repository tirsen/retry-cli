import test from 'ava';
import { execa } from 'execa';

test('success case', t => {
  return execa('node', ['./cli.js', '--', 'node', '-e', 'console.log("asdf")']).then((result) => {
    t.is(result.stdout, 'asdf');
    t.is(result.stderr, '');
  });
});
test('retry case', t => {
  return execa('node', ['./cli.js', '-n', '3', '-t', '100', '--', 'node', '-e', `console.error("asdf");console.log("normal"); process.exit(1)`]).then(() => {
      t.fail('should throw because exit code should be non-zero');
  }, (result) => {
    // Should have 4 "normal" output
    t.is((result.stdout.match(/normal/g) || []).length, 4);
    // Should have 4 errors: 1 initial + 3 retries
    t.is((result.stderr.match(/asdf/g) || []).length, 4);
  });
});
// test case where involuntary exit via signal is treated as retryable error
test('retry case via signal', t => {
  return execa('node', ['./cli.js', '-n', '2', '-t', '100', '--', 'node', '-e', `console.log("normal"); process.kill(process.pid, "SIGTERM")`]).then(() => {
    t.fail('should throw because exit code should be non-zero');
  }, (result) => {
    // Should have 2 "normal" output
    t.is((result.stdout.match(/normal/g) || []).length, 3);
  });
});
