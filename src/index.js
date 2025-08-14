const layout = require('./layout');
const dump = require('../assets/dump.json');

function toUnicode(char) {
    const code = char.charCodeAt(0);           // 获取 Unicode 编码
    const hex = code.toString(16).padStart(4, '0'); // 转换为4位十六进制
    return 'u' + hex;
}

// Helper function: stretch
function stretch(dp, sp, p, min, max) {
    var p1, p2, p3, p4;
    if (p < sp + 100) {
        p1 = min;
        p3 = min;
        p2 = sp + 100;
        p4 = dp + 100;
    } else {
        p1 = sp + 100;
        p3 = dp + 100;
        p2 = max;
        p4 = max;
    }
    return Math.floor(((p - p1) / (p2 - p1)) * (p4 - p3) + p3);
}

// Helper function: getBox
function getBox(strokes) {
    var a = {
        minX: 200,
        minY: 200,
        maxX: 0,
        maxY: 0
    };

    for (var i = 0; i < strokes.length; i++) {
        if (strokes[i][0] === 0) continue;
        a.minX = Math.min(a.minX, strokes[i][3]);
        a.maxX = Math.max(a.maxX, strokes[i][3]);
        a.minY = Math.min(a.minY, strokes[i][4]);
        a.maxY = Math.max(a.maxY, strokes[i][4]);
        a.minX = Math.min(a.minX, strokes[i][5]);
        a.maxX = Math.max(a.maxX, strokes[i][5]);
        a.minY = Math.min(a.minY, strokes[i][6]);
        a.maxY = Math.max(a.maxY, strokes[i][6]);
        if (strokes[i][0] === 1) continue;
        if (strokes[i][0] === 99) continue;
        a.minX = Math.min(a.minX, strokes[i][7]);
        a.maxX = Math.max(a.maxX, strokes[i][7]);
        a.minY = Math.min(a.minY, strokes[i][8]);
        a.maxY = Math.max(a.maxY, strokes[i][8]);
        if (strokes[i][0] === 2) continue;
        if (strokes[i][0] === 3) continue;
        if (strokes[i][0] === 4) continue;
        a.minX = Math.min(a.minX, strokes[i][9]);
        a.maxX = Math.max(a.maxX, strokes[i][9]);
        a.minY = Math.min(a.minY, strokes[i][10]);
        a.maxY = Math.max(a.maxY, strokes[i][10]);
    }
    return a;
}

// Main function to flatten Kage string
// buhinMap is an object where keys are buhin names and values are their Kage strings
function flattenKage(glyphData, buhinMap) {
    function getEachStrokes(glyphData) {
        var strokesArray = [];
        var strokes = glyphData.split("$");
        for (var i = 0; i < strokes.length; i++) {
            var columns = strokes[i].split(":");
            var type = Math.floor(columns[0] || 0);
            if (type !== 99) {
                strokesArray.push([
                    type,
                    Math.floor(columns[1] || 0),
                    Math.floor(columns[2] || 0),
                    Math.floor(columns[3] || 0),
                    Math.floor(columns[4] || 0),
                    Math.floor(columns[5] || 0),
                    Math.floor(columns[6] || 0),
                    Math.floor(columns[7] || 0),
                    Math.floor(columns[8] || 0),
                    Math.floor(columns[9] || 0),
                    Math.floor(columns[10] || 0)
                ]);
            } else {
                var buhinName = columns[7];
                var buhin = buhinMap[buhinName] || "";
                if (buhin !== "") {
                    strokesArray = strokesArray.concat(getEachStrokesOfBuhin(buhin,
                        Math.floor(columns[3] || 0),
                        Math.floor(columns[4] || 0),
                        Math.floor(columns[5] || 0),
                        Math.floor(columns[6] || 0),
                        Math.floor(columns[1] || 0),
                        Math.floor(columns[2] || 0),
                        Math.floor(columns[9] || 0),
                        Math.floor(columns[10] || 0)
                    ));
                }
            }
        }
        return strokesArray;
    }

    function getEachStrokesOfBuhin(buhin, x1, y1, x2, y2, sx, sy, sx2, sy2) {
        var temp = getEachStrokes(buhin);
        var result = [];
        var box = getBox(temp);
        if (sx !== 0 || sy !== 0) {
            if (sx > 100) {
                sx -= 200;
            } else {
                sx2 = 0;
                sy2 = 0;
            }
        }
        for (var i = 0; i < temp.length; i++) {
            if (sx !== 0 || sy !== 0) {
                temp[i][3] = stretch(sx, sx2, temp[i][3], box.minX, box.maxX);
                temp[i][4] = stretch(sy, sy2, temp[i][4], box.minY, box.maxY);
                temp[i][5] = stretch(sx, sx2, temp[i][5], box.minX, box.maxX);
                temp[i][6] = stretch(sy, sy2, temp[i][6], box.minY, box.maxY);
                if (temp[i][0] !== 99) {
                    temp[i][7] = stretch(sx, sx2, temp[i][7], box.minX, box.maxX);
                    temp[i][8] = stretch(sy, sy2, temp[i][8], box.minY, box.maxY);
                    temp[i][9] = stretch(sx, sx2, temp[i][9], box.minX, box.maxX);
                    temp[i][10] = stretch(sy, sy2, temp[i][10], box.minY, box.maxY);
                }
            }
            result.push([
                temp[i][0],
                temp[i][1],
                temp[i][2],
                x1 + temp[i][3] * (x2 - x1) / 200,
                y1 + temp[i][4] * (y2 - y1) / 200,
                x1 + temp[i][5] * (x2 - x1) / 200,
                y1 + temp[i][6] * (y2 - y1) / 200,
                x1 + temp[i][7] * (x2 - x1) / 200,
                y1 + temp[i][8] * (y2 - y1) / 200,
                x1 + temp[i][9] * (x2 - x1) / 200,
                y1 + temp[i][10] * (y2 - y1) / 200
            ]);
        }
        return result;
    }

    // Get the flattened strokes array
    var flattenedStrokes = getEachStrokes(glyphData);

    // Convert back to Kage string format
    var resultParts = [];
    for (var i = 0; i < flattenedStrokes.length; i++) {
        resultParts.push(flattenedStrokes[i].join(":"));
    }
    return resultParts.join("$");
}

const extradump = {
    "u9485-l01": "99:0:0:0:0:170:200:u9485-01",
    "u9485-l": "99:0:0:29:0:257:200:u9485-l01",
    "u77e2-l01": "99:0:0:0:0:180:200:u77e2-01",
}

class render {
    constructor() {
        this.dump = dump;
        for (const item in extradump) this.dump[item] = extradump[item];
        this.draw = new layout().draw;
    }

    drawglyph(ids, size) {
        let string = ''
        if (ids.length == 1) return this.dump[toUnicode(ids)]
        else {
            const partframes = this.draw(ids, size);

            // 生成 IDS 格式字符串
            string = partframes.map(P =>
                `99:0:0:${P.x}:${P.y}:${P.x + P.w}:${P.y + P.h}:${P.part}`
            ).join('$');

            return flattenKage(string, this.dump)
        }
    }

    /**
     * 递归寻找 IDS 串中的所有引用（包括 dump 定义里的引用）。
     * @param {string} idsframe 形如 "99:0:0:x:y:x2:y2:uXXXX$其他...$..." 的 IDS 字符串
     * @param {Object<string,string>} dump 从字符到 IDS 定义的映射表
     * @param {Object<string,string>} seen 内部参数，用于跟踪当前展开链
     * @returns {Object<string,string>} 引用表
    resolveIdsFrame(idsframe, seen = new Object()) {
        // 按 '$' 拆分
        const tokens = idsframe.split('$');

        for (const token of tokens) {
            // 检测是否为引用模式
            if (isNaN(token)) {
                const parts = token.split(':');
                for (const ucode of parts) {
                    if (isNaN(ucode)) {
                        const definition = this.dump[ucode];
                        if (!definition) {
                            throw new Error(`在 dump 中找不到定义：${ucode}`);
                        }
                        if (!seen.hasOwnProperty(ucode)) seen[ucode] = definition;
                        // 递归展开子定义里的引用
                        this.resolveIdsFrame(definition, seen);
                    }
                }
            }
        }
        return seen;
    }
    **/
}

module.exports = render;
