const dump = require('../assets/dump.json')

const variants = {
	'⿰1': '01',
	'⿰2': '02',
	'⿱1': '03',
	'⿱2': '04',
	'⿸1': '05',
	'⿺1': '05',
	'⿲2': '08',
	'⿳2': '09'
}

const isIDC = (c) => getOperandByIDC(c) != 0;

const getOperandByIDC = function (c) {
	if (c == 0x2ff2 || c == 0x2ff3) return 3;
	else if (c >= 0x2ff0 && c <= 0x2fff) return 2;
	else return 0;
}

const fullframe = function () {
	return { x1: 0, y1: 0, x2: 1, y2: 1 };
};

function toUnicode(char) {
	const codePoint = char.codePointAt(0); // 直接取完整码点
	return 'u' + codePoint.toString(16);
}

function fromUnicode(unicodeStr) {
	// 去掉开头的 'u'，并转成数字
	const codePoint = parseInt(unicodeStr.slice(1), 16);
	// 从码点生成字符
	return String.fromCodePoint(codePoint);
}


const getVariantChar = function (char, idsKey) {
	if (!char) return char;

	const entry = char + '-' + variants[idsKey];
	if (!dump.hasOwnProperty(entry)) return char;

	return entry;
};

const _右侧细长部首 = ['卩', '阝', '刂', '卜'];
const _左侧细长部首 = ['亻', '氵', '纟', '口', '冫', '目', '牜', '牛', '歹', '彳'];
const _上侧细长部首 = ['艹', '宀', '冖', '亠', '罒', '𥫗'];
const _下侧细长部首 = ['心', '灬', '止'];
const _朝鲜语韵尾 = [, 'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const _临时左侧细长部首 = [];

let lastchar = '';
let nextchar = '';

const specialProcess = {
	钅() {
		if (getVariantChar(toUnigcode(nextchar, '⿰2')) == nextchar) return 'u9485-l01'
		_临时左侧细长部首.push('钅')
		return 'u9485-l'
	},
	矢({ part, defaultUnicode }) {
		if (part == 0) return 'u77e2-l01'
		return defaultUnicode
	}
}

const framebypart = function (idc, frame, part, char) {
	var f = {};
	const fullsurround = () => {
		if (part == 0) { f.x1 = frame.x1; f.y1 = frame.y1; f.x2 = frame.x2; f.y2 = frame.y2; }
		else if (part == 1) {
			var inner_width = (frame.x2 - frame.x1) * 2 / 3;
			var inner_height = (frame.y2 - frame.y1) * 2 / 3;
			f.x1 = frame.x1 + (frame.x2 - frame.x1 - inner_width) / 2;
			f.x2 = f.x1 + inner_width;
			f.y1 = frame.y1 + (frame.y2 - frame.y1 - inner_height) / 2;
			f.y2 = f.y1 + inner_height;
		}
	};
	switch (idc) {
		case 0x2ff0: // ⿰
			if (part == 0)
				if (_右侧细长部首.includes(nextchar)) { f.x1 = frame.x1; f.x2 = frame.x1 + (frame.x2 - frame.x1) / 1.5; f.y1 = frame.y1; f.y2 = frame.y2; }
				else { f.x1 = frame.x1; f.x2 = frame.x1 + (frame.x2 - frame.x1) / 2; f.y1 = frame.y1; f.y2 = frame.y2; }
			else if (part == 1) {
				if (_左侧细长部首.includes(lastchar) || _临时左侧细长部首.includes(lastchar)) { f.x1 = frame.x1 + (frame.x2 - frame.x1) / 4; f.x2 = frame.x2; f.y1 = frame.y1; f.y2 = frame.y2; }
				else { f.x1 = frame.x1 + (frame.x2 - frame.x1) / 2.5; f.x2 = frame.x2; f.y1 = frame.y1; f.y2 = frame.y2; }
				if (_临时左侧细长部首.includes(lastchar)) _临时左侧细长部首.pop()
			}
			break;
		case 0x2ff1: // ⿱
			if (part == 0)
				if (_下侧细长部首.includes(nextchar)) { f.y1 = frame.y1; f.y2 = frame.y2 - (frame.y2 - frame.y1) / 2.5; f.x1 = frame.x1; f.x2 = frame.x2; }
				else { f.y1 = frame.y1; f.y2 = frame.y2 - (frame.y2 - frame.y1) / 2; f.x1 = frame.x1; f.x2 = frame.x2; }
			else if (part == 1) {
				if (_朝鲜语韵尾.includes(char)) { f.y1 = frame.y1; f.y2 = frame.y2 + (frame.y2 - frame.y1) / 2.5; f.x1 = frame.x1; f.x2 = frame.x2; }
				else if (_上侧细长部首.includes(lastchar)) { f.y1 = frame.y1 + (frame.y2 - frame.y1) / 4; f.y2 = frame.y2; f.x1 = frame.x1; f.x2 = frame.x2; }
				else { f.y1 = frame.y1 + (frame.y2 - frame.y1) / 2.5; f.y2 = frame.y2; f.x1 = frame.x1; f.x2 = frame.x2; }
			}
			break;
		case 0x2ff2: // ⿲
			if (part == 0) { f.x1 = frame.x1; f.x2 = frame.x1 + (frame.x2 - frame.x1) / 2.5; }
			else if (part == 1) { f.x1 = frame.x1 + (frame.x2 - frame.x1) / 3; f.x2 = frame.x1 + 2 * (frame.x2 - frame.x1) / 3; }
			else if (part == 2) { f.x1 = frame.x1 + 2 * (frame.x2 - frame.x1) / 3.5; f.x2 = frame.x2; }
			f.y1 = frame.y1; f.y2 = frame.y2;
			break;
		case 0x2ff3: // ⿳
			if (part == 0) { f.y1 = frame.y1; f.y2 = frame.y1 + (frame.y2 - frame.y1) / 2.5; }
			else if (part == 1) { f.y1 = frame.y1 + (frame.y2 - frame.y1) / 3; f.y2 = frame.y1 + 2 * (frame.y2 - frame.y1) / 3; }
			else if (part == 2) {
				if (_朝鲜语韵尾.includes(char)) { f.y1 = frame.y1 + 2 * (frame.y2 - frame.y1) / 5; f.y2 = frame.y2 + (frame.y2 - frame.y1) / 5; }
				else { f.y1 = frame.y1 + 2 * (frame.y2 - frame.y1) / 3.5; f.y2 = frame.y2; }
			}
			f.x1 = frame.x1; f.x2 = frame.x2;
			break;
		case 0x2ff4: case 0x2ff5: case 0x2ff6: case 0x2ff7: // ⿴ ⿵ ⿶ ⿷
			fullsurround();
			break;
		case 0x2ff8: // ⿸
			if (part == 0) { f.x1 = frame.x1; f.y1 = frame.y1; f.x2 = frame.x2; f.y2 = frame.y2; }
			else if (part == 1) { f.x1 = frame.x1 + (frame.x2 - frame.x1) / 4; f.x2 = frame.x2; f.y1 = frame.y1 + (frame.y2 - frame.y1) / 4; f.y2 = frame.y2; }
			break;
		case 0x2ff9: // ⿹
			if (part == 0) { f.x1 = frame.x1; f.y1 = frame.y1; f.x2 = frame.x2; f.y2 = frame.y2; }
			else { f.x1 = frame.x1; f.x2 = frame.x1 + 2 * (frame.x2 - frame.x1) / 2.5; f.y1 = frame.y1 + (frame.y2 - frame.y1) / 2.5; f.y2 = frame.y2; }
			break;
		case 0x2ffa: // ⿺
			if (part == 0) { f.x1 = frame.x1; f.y1 = frame.y1; f.x2 = frame.x2; f.y2 = frame.y2; }
			else if (part == 1) { f.x1 = frame.x1 + (frame.x2 - frame.x1) / 3.5; f.x2 = frame.x2; f.y1 = frame.y1; f.y2 = frame.y1 + (frame.y2 - frame.y1) / 1.2; }
			break;
		case 0x2ffb: // ⿻
			if (part == 0 || part == 1) { f.x1 = frame.x1; f.y1 = frame.y1; f.x2 = frame.x2; f.y2 = frame.y2; }
			break;
	}
	lastchar = char;
	return f;
};
const framebypartVariant = function (idc, frame, part, char) {
	var f = {};
	switch (idc) {
		case 0x2ff1: // ⿱
			if (part == 0 && _下侧细长部首.includes(nextchar)) { f.y1 = frame.y1; f.y2 = frame.y2 + (frame.y2 - frame.y1) / 4; f.x1 = frame.x1; f.x2 = frame.x2; }
			else if (part == 1 && _上侧细长部首.includes(lastchar)) { f.y1 = frame.y1 - (frame.y2 - frame.y1) / 5; f.y2 = frame.y2; f.x1 = frame.x1; f.x2 = frame.x2; }
			else { f.x1 = frame.x1; f.y1 = frame.y1; f.x2 = frame.x2; f.y2 = frame.y2 }
			break;
		case 0x2ffa: // ⿺
			if (part == 0) { f.x1 = frame.x1; f.y1 = frame.y1; f.x2 = frame.x2; f.y2 = frame.y2; }
			else if (part == 1) { f.x1 = frame.x1; f.x2 = frame.x2; f.y1 = frame.y1; f.y2 = frame.y1 + (frame.y2 - frame.y1) / 1.2; }
			break;
		default:
			f.x1 = frame.x1; f.y1 = frame.y1; f.x2 = frame.x2; f.y2 = frame.y2;
			break;
	}
	lastchar = char;
	return f;
};

const fitparts = function (parent, frame) {
	var idc = parent["ch"] && parent["ch"].charCodeAt ? parent["ch"].charCodeAt(0) : 0;
	var operand = getOperandByIDC(idc);
	var i = 1;
	while (operand > 0) {
		var child = parent["p" + i];
		if (!child) { i++; operand--; continue; }

		var topLevelKey = String.fromCharCode(idc) + i;

		// 如果 child 是一个 IDC 操作符节点，必须为其分配子槽并继续递归
		if (isIDC(child["ch"].charCodeAt(0))) {
			var f = framebypart(idc, frame, i - 1, variant);
			// 递归处理子树
			fitparts(child, f);
		} else {
			var childCh = child["ch"] || "";
			var base = (childCh.split ? childCh.split('-')[0] : childCh).toLowerCase();

			var variant = getVariantChar(base, topLevelKey);

			if (variant === base || !variant.split('-')[1].includes('0')) {
				var f = framebypart(idc, frame, i - 1, fromUnicode(variant));
				child.frame = f;
			} else {
				child.frame = framebypartVariant(idc, frame, i - 1, variant);
			}
		}

		i++; operand--;
	}
};


const addchild = function (ids, parent, frame, depth = 0, parentIDC = null) {
	if (depth > 20) throw new Error("递归深度超过限制，可能存在循环引用");
	if (!ids || ids.length === 0 || !isIDC(ids.charCodeAt(0))) {
		throw new Error(`无效的IDS格式，必须以IDC开头：${ids}`);
	}
	var idc = ids.charCodeAt(0);
	var operand = getOperandByIDC(idc);
	parent.ch = Array.from(ids)[0];
	let arr = Array.from(ids);
	arr.shift();
	ids = arr.join('');

	var i = 1;
	while (operand > 0) {
		if (!ids) throw new Error("IDS缺少部件字符");
		const char = Array.from(ids)[0];

		var originalUnicode = toUnicode(char); // e.g. "u5965"
		var topLevelKey = String.fromCharCode(idc) + i;
		var finalUnicode = isIDC(ids.charCodeAt(0))
			? originalUnicode
			: getVariantChar(originalUnicode, topLevelKey);

		var f;
		nextchar = ids[1] ?? '';

		if (specialProcess.hasOwnProperty(char)) finalUnicode = specialProcess[char]({
			defaultUnicode: finalUnicode,
			part: i - 1
		});

		//console.log(finalUnicode)
		if (isIDC(ids.charCodeAt(0))) {
			f = framebypart(idc, frame, i - 1, char);
		} else {
			if (finalUnicode === originalUnicode || !finalUnicode.split('-')[1].includes('0')) {
				f = framebypart(idc, frame, i - 1, char);
			} else {
				f = framebypartVariant(idc, frame, i - 1, char);
			}
		}

		var child = parent["p" + i] = { "ch": finalUnicode };

		if (isIDC(ids.charCodeAt(0))) {
			ids = addchild(ids, child, f, depth + 1, idc);
			fitparts(child, f);
		} else {
			child.frame = f;
			let arr = Array.from(ids);
			arr.shift();
			ids = arr.join('');
		}

		i++; operand--;
	}
	return ids;
};


const drawparts = function (output, parent, x, y, w, h) {
	var idc = parent.ch.charCodeAt && parent.ch.charCodeAt(0) ? parent.ch.charCodeAt(0) : null;
	var operand = getOperandByIDC(idc || 0);
	var i = 1;
	while (operand > 0) {
		var child = parent["p" + i];
		if (isIDC(child.ch.charCodeAt && child.ch.charCodeAt(0) ? child.ch.charCodeAt(0) : 0)) {
			drawparts(output, child, x, y, w, h);
		} else {
			var f = child.frame;
			var xr = f.x2 - f.x1;
			var yr = f.y2 - f.y1;
			// 输出的 part 是 Unicode 字符串，而不是汉字
			output.push({ part: child.ch, x: f.x1 * w, y: f.y1 * h, w: w * xr, h: h * yr });
		}
		i++; operand--;
	}
};

class layout {
	draw(ids) {
		const idstree = {};
		try {
			addchild(ids, idstree, fullframe());
			var output = [];
			drawparts(output, idstree, 0, 0, 200, 200);
			return output;
		} catch (error) {
			console.error("布局生成失败:", error.message);
			return [];
		}
	};
}

module.exports = layout;
