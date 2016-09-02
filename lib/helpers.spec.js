'use strict';

const assert = require('assert');
const fs = require('fs');

const { lookupFunctionParameters } = require('./helpers');

describe('removeClosedFunctions', () => {
  it('Should show hints in different parts of the file.', () => {
    const data = fs.readFileSync(`./test/intellisense.vash`, 'utf-8');

    const expectedCountOfHints = data.match(/\(\d+,(\d+)\)/g).map((item) => {
      return parseInt(/,(\d+)/.exec(item)[1], 10);
    });

    for (let index = 1; index <= expectedCountOfHints.length; index++) {
      const text = data.split(`(${index}`);
      const params = lookupFunctionParameters(text[0], text[1]);

      // +1 by `html`
      assert.equal(params.length + 1, expectedCountOfHints[index - 1], `Error index: ${index + 1}`);
    }
  });

  it('At the end of the file should not be hints.', () => {
    fs.readdirSync('./test').forEach((filename) => {
      const data = fs.readFileSync(`./test/${filename}`, 'utf-8');

      assert.equal(lookupFunctionParameters(data, '}').length, 0);
    });
  });
});
