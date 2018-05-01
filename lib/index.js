const fs = require('fs');
const readline = require('readline');
const Scanner = require('./Scanner');
const Parser = require('./Parser');
const TokenType = require('./TokenType');
const ASTPrinter = require('./ASTPrinter');
const Interpretor = require('./Interpreter');


class Wrapper {
    runFile(path) {
        this.run(fs.readFileSync(path).toString());
    }
    runPrompt() {
        let inputs = [];
        process.stdout.write('> ');
        process.stdin.on('data', (data) => {
            const line = data.toString().slice(0, -1);
            if (line[line.length -1 ] == '\\') {
                inputs.push(line.slice(0, -1));
                process.stdout.write('> ');
            } else {
                inputs.push(line);
                const source = inputs.join('\n');
                this.run(source);
                inputs = []
                process.stdout.write('> ');
            }
        });
    }
    run(source) {
        Wrapper.hadScannError = false;
        Wrapper.hadParseError = false;
        Wrapper.hadRuntimeError = false;

        const scanner = new Scanner(source);
        const tokens = scanner.scan();
        if (Wrapper.hadScannError) return;

        const parser = new Parser(tokens);
        const statements = parser.parse();
        if (Wrapper.hadParseError) return;

        Wrapper.interpretor.interpret(statements);
        if (Wrapper.hadRuntimeError) return;
    }
    static scannError({ line, message, source, offset }) {
        const sourceBeforeLine = source.split('\n', line - 1).join('\n');
        const sourceAfterLine = source.slice(sourceBeforeLine.length);
        let position = offset - sourceBeforeLine.length;
        if (line > 1) {
            position -= 1;
        }
        const report = `[${line}:${position}] ${source[offset - 1]} - ${message}`;
        console.log(report);
        this.hadScannError = true;
    }
    static runtimeError({ token, message }) {
        const report = `[${token.line}:-1] ${message}`;
        console.log(report);
        this.hadRuntimeError = true;
    }
    static parseError({ token, message }) {
        let report = '';
        if (token.type === TokenType.EOF) {
            report = `[${token.line}:at end] ${message}`;
        } else {
            report = `[${token.line}:at ${token.lexeme}] ${message}`;
        }
        console.log(report);
        this.hadParseError = true;
    }
}

Wrapper.hadRuntimeError = false;
Wrapper.hadParseError = false;
Wrapper.hadScannError = false;
Wrapper.interpretor = new Interpretor();



module.exports = Wrapper;