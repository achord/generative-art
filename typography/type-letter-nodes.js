const canvasSketch  = require('canvas-sketch');
const random        = require('canvas-sketch-util/random');
const math          = require('canvas-sketch-util/math');
const color         = require('canvas-sketch-util/color');

const size = 1080
const settings = {
  dimensions: [ size, size ],
  animate: false,
  fps: 15,
  playbackRate: 'throttle',
};

// Type
let text = 'A';
let fontSize = 1300;
let fontFamily = 'Times';

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

// Gradient foreground
const fill = 'white'

// Lines
const cell = 14;
const connectDistance = 24;
const staticStrokeWidth = null;
const speed = 0.5;
const strokeColor = fill;
const bgColor = '#111';
const shake = 0.6;

const sketch = ({ context, width, height }) => {  
  const cols = Math.floor(width  / cell);
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;

  typeCanvas.width  = cols;
  typeCanvas.height = rows;

  return ({ context, width, height }) => {
    typeContext.fillStyle = 'white';
    typeContext.fillRect(0, 0, cols, rows);
    fontSize = cols;
    typeContext.font = `${fontSize}px ${fontFamily}`;
    typeContext.textBaseline = 'top';

    const metrics = typeContext.measureText(text);
    const mx = metrics.actualBoundingBoxLeft * -1;
    const my = metrics.actualBoundingBoxAscent * -1;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    const tx = (cols - mw) * 0.5 - mx;
    const ty = (rows - mh) * 0.5 - my;

    typeContext.save();
    typeContext.translate(tx, ty);
    typeContext.fillStyle='gray';
    typeContext.fillText(text, 0, 0);
    
    typeContext.strokeStyle='black';    
    typeContext.strokeText(text, 0, 0);
    typeContext.restore();

    context.textBaseline = 'middle';
    context.textAlign = 'center';

    const typeData = typeContext.getImageData(0, 0, cols, rows).data;
    
    // Small Canvas
    // context.drawImage(typeCanvas, 0, 0);

    // DRAW TO THE BIG CANVAS
    agents = [];
    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * cell + random.range(-cell, cell) * shake;
      const y = row * cell + random.range(-cell, cell) * shake;
      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];

      if (b < 190) {
        agents.push(new Agent(x, y));        
      }

      context.font = `${cell * 1}px ${fontFamily}`;
      context.fillStyle = `rgba(${r}, ${g}, ${b})`;

      context.save();
      context.translate(x, y);
      context.translate(cell * 0.5, cell * 0.5);
      context.restore();
      
    }  

    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);
    
    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];
      for (let j = i + 1; j < agents.length; j++) {
        const other = agents[j];
        const dist = agent.pos.getDistance(other.pos);
        if (dist > connectDistance) continue;        
        context.lineWidth  = staticStrokeWidth ? staticStrokeWidth : math.mapRange(dist, 0, connectDistance - 2, 3, 0.2);          
        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
        context.strokeStyle=strokeColor;
        
        context.stroke();  
      }
    }

  };
  
};

const start = async () => {
  manager = await canvasSketch(sketch, settings);
};

start();


// Draw Lines and Dots
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(-speed, speed), random.range(-speed, speed));
  }
}
