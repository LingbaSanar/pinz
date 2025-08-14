const express = require('express');
const Render = require('../src');
const app = express();
const port = 3500;

app.use(express.json());

const render = new Render();

app.post('/processids', (req, res) => {
    const { ids, size } = req.body;
    
    try {
        console.log(`INFO: IDS: ${ids}`)
        const svgGroup = render.drawglyph(ids, size);
        res.send(svgGroup);
    } catch (error) {
        console.error('Error generating SVG:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});