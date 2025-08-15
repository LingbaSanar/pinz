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
	if (!char || typeof char !== 'string') return char;
	const codePoint = char.codePointAt(0);
	return 'u' + codePoint.toString(16);
}

function getBaseChar(unicodeStr) {
	if (!unicodeStr || typeof unicodeStr !== 'string') return '';
	if (unicodeStr[0] === 'u' && /^[uU][0-9a-fA-F]/.test(unicodeStr)) {
		const baseHex = unicodeStr.slice(1).split('-')[0];
		return String.fromCodePoint(parseInt(baseHex, 16));
	} else {
		// 已经是单个字符（或以字符开头），返回第一个 code point 对应的字符
		const cp = unicodeStr.codePointAt(0);
		return cp ? String.fromCodePoint(cp) : '';
	}
}

const getVariantChar = function (char, idsKey) {
	if (!char) return char;

	const entry = char + '-' + variants[idsKey];
	if (!dump.hasOwnProperty(entry)) return char;

	return entry;
};

const _右侧细长部首 = ['卩', '阝', '刂', '卜'];
const _左侧细长部首 = ['亻', '氵', '纟', '口', '冫', '目', '牜', '牛', '歹', '彳'];
const _上侧细长部首 = ['艹', '宀', '冖', '亠', '罒'];
const _下侧细长部首 = ['心', '灬', '止'];
const _朝鲜语韵尾 = ['ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const _临时左侧细长部首 = [];

const specialProcess = {
	钅({nextchar }) {
		if (nextchar && getVariantChar(toUnicode(nextchar), '⿰2') == toUnicode(nextchar)) return 'u9485-l01'
		_临时左侧细长部首.push('钅')
		return 'u9485-l'
	},
	矢({ part, defaultUnicode }) {
		if (part == 0) return 'u77e2-l01'
		return defaultUnicode
	}
}

function getEffectiveChar(node) {
	if (node.p1) return '';
	return getBaseChar(node.ch);
}

// 辅助：取得字符串第一个 code point（整数），如果不是字符串或为空返回 0
const firstCodePoint = (s) => (s && typeof s === 'string') ? s.codePointAt(0) : 0;

const framebypart = function (idc, frame, part, char, lastchar, nextchar) {
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
				if (_下侧细长部首.includes(nextchar)) { f.y1 = frame.y1; f.y2 = frame.y2 - (frame.y2 - frame.y1) / 4; f.x1 = frame.x1; f.x2 = frame.x2; }
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
	return f;
};
const framebypartVariant = function (idc, frame, part, char, lastchar, nextchar) {
	var f = {};
	switch (idc) {
		case 0x2ff1: // ⿱
			if (part == 0 && _下侧细长部首.includes(nextchar)) { f.y1 = frame.y1; f.y2 = frame.y2 + (frame.y2 - frame.y1) / 2; f.x1 = frame.x1; f.x2 = frame.x2; }
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
	return f;
};

function parseIds(ids, depth = 0) {
	if (depth > 20) throw new Error("递归深度超过限制");
	if (!ids || ids.length === 0) {
		throw new Error(`无效的IDS格式，必须以IDC开头：${ids}`);
	}
	const chars = Array.from(ids);
	let pos = 0;

	if (chars.length === 0 || !isIDC(chars[pos].codePointAt(0))) {
		throw new Error(`无效的IDS格式，必须以IDC开头：${ids}`);
	}

	// 内部递归函数：从 chars[pos] 开始解析，返回 [node, newPos]
	function parseFromArray(arr, startPos, d) {
		if (d > 20) throw new Error("递归深度超过限制");
		if (startPos >= arr.length) throw new Error("IDS解析意外结束");

		const idcChar = arr[startPos];
		const idc = idcChar.codePointAt(0);
		if (!isIDC(idc)) throw new Error(`预期 IDC，但得到: ${idcChar}`);

		let operand = getOperandByIDC(idc);
		const tree = { ch: idcChar };
		let curPos = startPos + 1;
		let i = 1;
		while (operand > 0) {
			if (curPos >= arr.length) throw new Error("IDS缺少部件字符");
			const ch = arr[curPos];
			let child;
			const chCp = ch.codePointAt(0);
			if (isIDC(chCp)) {
				// 递归解析子 IDC
				const [childNode, nextPos] = parseFromArray(arr, curPos, d + 1);
				child = childNode;
				curPos = nextPos;
			} else {
				// 非 IDC，使用 toUnicode（会生成 'uXXXX' 格式）
				child = { ch: toUnicode(ch) };
				curPos++;
			}
			tree[`p${i}`] = child;
			i++; operand--;
		}
		return [tree, curPos];
	}

	const [tree, newPos] = parseFromArray(chars, pos, depth);
	const remaining = chars.slice(newPos).join('');
	return [tree, remaining];
}

function applyVariants(node) {
	if (!node.p1) return;
	const idcCode = firstCodePoint(node.ch);
	const operand = getOperandByIDC(idcCode);
	const children = [];
	for (let i = 1; i <= operand; i++) {
		children.push(node[`p${i}`]);
	}
	for (let i = 0; i < operand; i++) {
		const child = children[i];
		if (child.p1) {
			applyVariants(child);
		} else {
			const base = child.ch;
			const idsKey = node.ch + (i + 1);
			const defaultUnicode = getVariantChar(base, idsKey);
			const thisChar = getBaseChar(base);
			const nextChar = i + 1 < operand ? getEffectiveChar(children[i + 1]) : '';
			if (specialProcess.hasOwnProperty(thisChar)) {
				child.ch = specialProcess[thisChar]({
					part: i,
					defaultUnicode,
					nextchar: nextChar
				});
			} else {
				child.ch = defaultUnicode;
			}
		}
	}
}

function fitparts(parent, frame) {
	const idcCode = firstCodePoint(parent.ch);
	const operand = getOperandByIDC(idcCode);
	const children = [];
	for (let i = 1; i <= operand; i++) {
		children.push(parent[`p${i}`]);
	}
	for (let i = 0; i < operand; i++) {
		const child = children[i];
		const lastChar = i > 0 ? getEffectiveChar(children[i - 1]) : '';
		const nextChar = i < operand - 1 ? getEffectiveChar(children[i + 1]) : '';
		const thisChar = getEffectiveChar(child);
		let f;
		let useVariantFrame = false;
		if (!child.p1) {
			const variantStr = child.ch;
			// 判断 variantStr 是否包含 '-0' 类的标志（与原逻辑保持一致）
			if (variantStr.includes('-') && variantStr.split('-')[1].includes('0')) {
				useVariantFrame = true;
			}
		}
		if (useVariantFrame) {
			f = framebypartVariant(idcCode, frame, i, thisChar, lastChar, nextChar);
		} else {
			f = framebypart(idcCode, frame, i, thisChar, lastChar, nextChar);
		}
		child.frame = f;
		if (child.p1) {
			fitparts(child, f);
		}
	}
}

const drawparts = function (output, parent, x, y, w, h) {
	var idc = parent.ch ? firstCodePoint(parent.ch) : null;
	var operand = getOperandByIDC(idc || 0);
	var i = 1;
	while (operand > 0) {
		var child = parent["p" + i];
		// 判断 child 是否是 IDC：注意 child.ch 可能是 'uXXXX' 之类或实际字符
		if (isIDC(firstCodePoint(child.ch))) {
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
		try {
			const [idstree, remaining] = parseIds(ids);
			if (remaining) throw new Error("IDS解析后剩余未处理字符");
			applyVariants(idstree);
			fitparts(idstree, fullframe());
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
