'use strict';

export function removeClosedFunctions(text: string, resultParams): string[] {
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

export function lookupFunctionParameters(textBefore: string, textAfter: string): string[] {
	textBefore = textBefore.replace(/[\r\n\t]|\s{2,}/g, '');
	textAfter = textAfter.replace(/[\r\n\t]|\s{2,}/g, '');

	if (textBefore.lastIndexOf('{') !== -1 && textAfter.indexOf('}') !== -1) {
		return removeClosedFunctions(textBefore, []);
	}

	return [];
}

export const languageFacts = [
	{
		"label": "raw",
		"detail": "By default, all content that passes from a model to a template is HTML encoded. This method passes content without HTML encoded.",
		"documentation": "@html.raw(\"<text>\")"
	},
	{
		"label": "escape",
		"detail": "This method passes content with HTML encoded.",
		"documentation": "@html.escape(\"<text>\")"
	},
	{
		"label": "tplcache",
		"detail": "tplcache can use for set global index for a compiled template. this will initialized when using \"vash.install\", or can initialize manualy. for more see \"vash.install\", \"vash.uninstall\" and \"vash.lookup\"",
		"documentation": "vash.helpers.tplcache[name_of_precompiled_template]"
	},
	{
		"label": "extend",
		"detail": "Used to inheritance for view templates.",
		"documentation": "@html.extend(parent_path, callback)"
	},
	{
		"label": "block",
		"detail": "A block is essentially a placeholder within a template that can be overridden via another call to \"vash.helpers.block\", or modified using \"vash.helpers.append\" and \"vash.helpers.prepend\".",
		"documentation": "@html.block(name, callback)"
	},
	{
		"label": "append",
		"detail": "Is a way to control the content of a block from within an extending template. In this way, it allows templates to invert control over content \"above\" them.",
		"documentation": "@html.append(name, callback)"
	},
	{
		"label": "prepend",
		"detail": "Behaves nearly the same as \"vash.helpers.append\" except that it places content at the beginning of a block instead of at the end. ",
		"documentation": "@html.prepend(name, callback)"
	},
	{
		"label": "include",
		"detail": "Used to literally include the contents of another template.",
		"documentation": "@html.include(name, model)"
	},
	{
		"label": "highlight",
		"detail": "Used to syntax highlighting.",
		"documentation": "@html.highlight(language, callback)"
	}
];
