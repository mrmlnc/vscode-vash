'use strict';

import {
	createConnection, IConnection,
	IPCMessageReader, IPCMessageWriter,
	TextDocuments, TextDocument, InitializeResult
} from 'vscode-languageserver';

import {
	CompletionConfiguration,
	HTMLFormatConfiguration
} from 'vscode-html-languageservice';

import { provideCompletionItems } from './lib/completionProvider';

// Create a connection for the server
const connection: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));

console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);

// Create a simple text document manager. The text document manager
// _supports full document sync only
const documents: TextDocuments = new TextDocuments();

// Make the text document manager listen on the connection
// _for open, change and close text document events
documents.listen(connection);

// After the server has started the client sends an initilize request. The server receives
// _in the passed params the rootPath of the workspace plus the client capabilites
connection.onInitialize((): InitializeResult => {
	return {
		capabilities: {
			textDocumentSync: documents.syncKind,
			completionProvider: {
				resolveProvider: false,
				triggerCharacters: ['.', ':', '<', '"', '=', '/', '@']
			},
			documentRangeFormattingProvider: false,
			documentFormattingProvider: false
		}
	};
});

// The settings interface describes the server relevant settings part
interface Settings {
	html: LanguageSettings;
}

interface LanguageSettings {
	suggest: CompletionConfiguration;
	format: HTMLFormatConfiguration;
}

let languageSettings: LanguageSettings;

// The settings have changed. Is send on server activation as well.
connection.onDidChangeConfiguration((change) => {
	const settings = <Settings>change.settings;
	languageSettings = settings.html;
});

connection.onCompletion((textDocumentPosition) => {
	const document: TextDocument = documents.get(textDocumentPosition.textDocument.uri);
	const options = languageSettings && languageSettings.suggest;
	return provideCompletionItems(document, textDocumentPosition.position, options);
});

// Listen on the connection
connection.listen();
