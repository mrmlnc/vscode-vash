'use strict';

import * as path from 'path';

import { ExtensionContext } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient';

export function activate(context: ExtensionContext) {
	const serverModule = path.join(__dirname, 'server.js');

	const debugOptions = {
		execArgv: ['--nolazy', '--debug=6004']
	};

	const serverOptions: ServerOptions = {
		run: {
			module: serverModule,
			transport: TransportKind.ipc
		},
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	};

	const clientOptions: LanguageClientOptions = {
		documentSelector: ['vash'],
		synchronize: {
			configurationSection: ['html']
		},
		initializationOptions: {}
	};

	const client = new LanguageClient('vash', 'Vash Language Server', serverOptions, clientOptions);
	const disposable = client.start();

	context.subscriptions.push(disposable);
}
