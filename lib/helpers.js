'use strict';

function removeClosedFunctions(text, resultParams) {
  // Removing closed parentheses `(_)})` from a string
  // @_(_{}) and @_(_, function() {}), when _ is a any symbols
  const isClosedFunction = /^.*(@.*(?:function)?\([^\(\)]*\)?\s*\{.*?\}.*?\))/.exec(text);
  if (isClosedFunction) {
    return removeClosedFunctions(text.replace(isClosedFunction[1], ''), resultParams);
  }

  // Returns the parameters for nearest function
  const params = /^.*(?:(@(?!\()(?:[a-zA-Z0-9\.]*\(.*?function\s*\(([^\(\)]*)\)\s*\{)))/.exec(text);
  if (params) {
    text = text.replace(params[1], '');

    params[2].split(/,\s*/).forEach((param) => {
      if (param !== '' && resultParams.indexOf(param) === -1) {
        resultParams.push(param);
      }
    });

    return removeClosedFunctions(text, resultParams);
  }

  return resultParams.reverse();
}

function lookupFunctionParameters(textBefore, textAfter) {
  textBefore = textBefore.replace(/[\r\n\t]|\s{2,}/g, '');
  textAfter = textAfter.replace(/[\r\n\t]|\s{2,}/g, '');

  if (textBefore.lastIndexOf('{') !== -1 && textAfter.indexOf('}') !== -1) {
    return removeClosedFunctions(textBefore, []);
  }

  return [];
}

module.exports = {
  removeClosedFunctions,
  lookupFunctionParameters
};
