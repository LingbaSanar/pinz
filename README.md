# PINZ
由IDS字符串通过Kage字形组建图像。  
[动态组字](https://0832.ink/pinz)  
  
感谢：[IDSKage](https://github.com/g0v/idskage) · [Kage字形引擎](https://github.com/kamichikoichi/kage-engine) · [GlyphWiki](https://glyphwiki.org/)

# 使用方法
### 拉取引用
```
npm i
```
  
### 生成图像
```
npm run test
```
`test/index.js`会根据`⿱艹⿰日月`生成`萌`字的SVG图像，保存在`output.svg`。  
  
### 启动服务器
```
npm run serve
```
这将在 http://localhost:3500/processids 启动服务器，允许使用`fetch()`访问。
  
### 构建Kage引擎
```
npm run build-kage
```
这将构建`run/kage`下的Kage引擎Nodejs版本为一个独立文件，输出在`dist/kage.js`。  
  
### 运行GUI
```
npm run dev
```
这将运行程序。   
  
### Node.js引用
```js
const Render = require('./pinz')
const render = new Render()
```
或:
```js
const Pinz = require('./pinz/run')
const pinz = new Pinz()
```
使用`pinz.printSVG(ids,size)`获取SVG,  
使用`render.drawglyph(ids,size)`只获取Kage字符串（无需GPL）。