#!/usr/bin/env node
import program from 'commander';

import { CreateCommand } from './commands/create';

program
    .name('typegraphql-typeorm-starter')
    .version('1.0.2');

program
    .command('new <name>')
    .description('Creates a new typegraphql-typeorm starter package')
    .action((name: string) => {
        const command = new CreateCommand();
        command.execute(name);
    });

if (!process.argv.slice(2).length) {
    program.outputHelp();
}

program.parse(process.argv);