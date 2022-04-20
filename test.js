import test from 'ava';
import { execa } from 'execa';

test('success case', t => {
  return execa('node', ['./cli.js', '--', 'echo', 'asdf']).then((result) => {
    t.is(result.stdout, 'asdf');
    t.is(result.stderr, '');
  });
});
test('retry case', t => {
  return execa('node', ['./cli.js', '-n', '3', '-t', '100', '--', 'ls', 'asdf']).then(() => {
      t.fail('should throw because exit code should be non-zero');
  }, (result) => {
    t.is(result.stdout, '');
    // Make sure we have 4 errors
    t.is((result.stderr.match(/asdf/g) || []).length, 4);
  });
});
