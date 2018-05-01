const fs = require('fs');
const readline = require('readline');
const Scanner = require('./Scanner');


class Interpretor {
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
        if (Interpretor.hadError) {
            process.exit(65);
        }
        const scanner = new Scanner(source);
        const tokens = scanner.scanTokens();
        tokens.map((token) => console.log(token.toString()));
    }
    

    static error(line, position, message) {
        this.report(line, position, message);
    }
    static report(line, position, message) {
        console.log(`${line}, ${position}: ${message}`);
        this.hadError = true;
    }
}

Interpretor.hadError = false;



module.exports = Interpretor;