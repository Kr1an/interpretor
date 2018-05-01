const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const baseName = args.splice(0, 1)[0];
const outputDir = args.splice(0, 1)[0];
const types = args;

console.log(baseName);
console.log(outputDir);
console.log(types);


function defineAST(outputDir, baseName, types) {
    const filePath = path.join(outputDir, baseName);
    fs.unlink(filePath);
    fs.writeFileSync(filePath, `class ${baseName} {
        constructor(ini) {
            Object.assign(this, ini);
        }
    }
    module.exports = {
        ${types.map(x => ({ name: x, baseName })).map(defineType).join(',\n\t')}
    }
    `);
}

function defineType({ name, baseName }) {
    return `${name}: class extends ${baseName} {}`;
}
