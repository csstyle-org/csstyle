const fs = require('fs');
const sass = require('sass');
const mkdirp = require('mkdirp');
const { promisify } = require('util');

let promised = {
    mkdirp: promisify(mkdirp),
    fs: {
        writeFile: promisify(fs.writeFile),
    },
    sass: {
        render: promisify(sass.render),
        renderSync: sass.renderSync,
    },
};

module.exports = promised;
