const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const baseName = args.splice(0, 1)[0];
const outputDir = args.splice(0, 1)[0];
const types = args;

console.log(baseName);
console.log(outputDir);
console.log(types);

defineAST(outputDir, baseName, types);

function defineAST(outputDir, baseName, types) {
    const filePath = path.join(outputDir, `${baseName}.js`);
    fs.unlinkSync(filePath);
    fs.writeFileSync(filePath, 
`class ${baseName} {
    constructor(ini) {
        Object.assign(this, ini);
    }
    accept(visitor) {}
}
module.exports = {
${types.map(x => ({ name: x, baseName })).map(defineType).join(',\n')}
}`);
}

function defineType({ name, baseName }) {
    return `${name}: class extends ${baseName} {
    accept(visitor) {
        return visitor.visit${name}${baseName}(this);
    }
}`;
}

function defineVisitor(baseName, types) {
    return ``
}