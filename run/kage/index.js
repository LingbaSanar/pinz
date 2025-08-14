// Modify by 0832 - 25802

const Kage = require("./kage.js");
const Polygons = require("./polygons.js");

module.exports = { Kage, Polygons };
if (typeof __webpack_require__ === 'function') {
    global.Kage = Kage;
    global.Polygons = Polygons;
}
