const Pinz = require('../run');
const fs = require('fs');

const pinz = new Pinz();

fs.writeFileSync('output.svg',pinz.printSVG('⿱艹⿰日月',512),'utf8');
