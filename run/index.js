const { Kage, Polygons } = require('./kage')
const render = require("../src");

class Pinz {
    constructor() {
        this.render = new render();
    }
    printSVG(ids, size) {
        if (typeof ids != 'string' || ids == '') throw new Error('提供IDS');
        
        // 创建 Kage 和 Polygons 实例
        const kage = new Kage();
        kage.kUseCurve = false;
        const polygons = new Polygons();

        const string = this.render.drawglyph(ids, size);

        kage.kBuhin.push('ids', string);

        // 生成多边形数据
        kage.makeGlyph(polygons, 'ids');

        // SVG 坐标缩放因子（Kage 内部使用 200×200 精度）
        const scale = size / 200;

        // 拼接每个多边形的 <path d="..."/>
        const paths = polygons.array.map(poly => {
            const pts = poly.array
                .map((pt, i) => `${i === 0 ? 'M' : 'L'}${(pt.x * scale).toFixed(2)},${(pt.y * scale).toFixed(2)}`)
                .join(' ');
            return `<path d="${pts} Z" fill="black" />`;
        }).join('\n  ');

        // 最终的 SVG 字符串
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">\n${paths}\n</svg>`;
        return svg;
    };
}

module.exports = Pinz;
if (typeof __webpack_require__ === 'function') {
    global.Pinz = Pinz;
}
