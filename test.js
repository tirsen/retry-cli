const test = require('ava');
const execa = require('execa');

test('success case', t => {
  return execa('node', ['./cli.js', '--', 'echo', 'asdf']).then((result) => {
    t.ok(result.stdout === 'asdf');
    t.ok(result.stderr === '');
  });
});
test('retry case', t => {
  return execa('node', ['./cli.js', '-n', '3', '-t', '100', '--', 'ls', 'asdf']).then(() => {
      t.fail('should throw because exit code should be non-zero');
  }, (result) => {
    const err =
`ls: asdf: No such file or directory
ls: asdf: No such file or directory
ls: asdf: No such file or directory
ls: asdf: No such file or directory
`;
    t.ok(result.stdout === '');
    t.ok(result.stderr === err);
  });
});
