const os = require('os');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const mnpm = require('./mnpm');

describe("stringifyPackageJson", () => {

  it("Uses two whitespaces to indent (the Yolean convention) and adds a trailing newline", () => {
    const string = mnpm.stringifyPackageJson({name: 'test-module'});
    expect(string).toBe('{\n  "name": "test-module"\n}\n');
  });

});

describe("writeProdPackageTgzWithDeterministicHash", () => {

  it("Writes a file", async () => {
    const filePath = path.join(os.tmpdir(), 'build-contract-test-mnpm-' + Date.now() + '.tgz');
    await mnpm.writeProdPackageTgzWithDeterministicHash({
      packageJsonObject: {
        "dependencies": {
          "build-contract": "1.5.0"
        }
      },
      filePath
    });
    const stat = await fs.promises.stat(filePath);
    // we base these assertions on a test result, not on npm pack output (which differs)
    // and use the assertions to see if something changes over time or across platforms
    expect(stat.size).toBe(154);
    const tgz = await fs.promises.readFile(filePath);
    const sha256 = crypto.createHash('sha256');
    sha256.update(tgz);
    expect(sha256.digest('hex')).toBe('f9153d2eb9f6c5fce542c07540c60d30f819f8886c300d6e39fa1c272e90a2c0');
    const sha512 = crypto.createHash('sha512');
    sha512.update(tgz);
    expect(sha512.digest('base64')).toBe('PWPbKiNEVWpu+1gyqpvy0uYpGnq7tJUBq4OxFzllDI+3AgZJcivUcP5k5BIOBG7lIxI3WUkBNA8cAVg/KUU4uw==');
    await fs.promises.unlink(filePath);
  });

});
