const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
	dimensions: [ 1080, 1080 ]
};

let manager;


// Type
let text = 'A';
let fontSize = 1200;
let fontFamily = 'Times';

// Dots & Lines
const shapeCount = 200;
const minRad = 2;
const maxRad = 6;
const connectDistance = 100;
const speed = 1;
const strokeWidth = 1;


const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

const sketch = ({ context, width, height }) => {

  const agents = [];

	const cell = 20;
	const cols = Math.floor(width  / cell);
	const rows = Math.floor(height / cell);
	const numCells = cols * rows;

  for (let i = 0; i < numCells; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * cell;
    const y = row * cell;
    agents.push(new Agent(x, y));
  }

  console.log(agents);

	// typeCanvas.width  = cols;
	// typeCanvas.height = rows;


	// return ({ context, width, height }) => {
	// 	typeContext.fillStyle = 'gray';
	// 	typeContext.fillRect(0, 0, cols, rows);

	// 	fontSize = cols * 1.2;

	// 	typeContext.fillStyle = 'black';
	// 	typeContext.font = `${fontSize}px ${fontFamily}`;
	// 	typeContext.textBaseline = 'top';

	// 	const metrics = typeContext.measureText(text);
	// 	const mx = metrics.actualBoundingBoxLeft * -1;
	// 	const my = metrics.actualBoundingBoxAscent * -1;
	// 	const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
	// 	const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

	// 	const tx = (cols - mw) * 0.5 - mx;
	// 	const ty = (rows - mh) * 0.5 - my;

	// 	typeContext.save();
	// 	typeContext.translate(tx, ty);

	// 	typeContext.beginPath();
	// 	typeContext.rect(mx, my, mw, mh);

	// 	typeContext.fillText(text, 0, 0);
	// 	typeContext.restore();

	// 	const typeData = typeContext.getImageData(0, 0, cols, rows).data;

	// 	context.fillStyle = 'gray';
	// 	context.fillRect(0, 0, width, height);

	// 	context.textBaseline = 'middle';
	// 	context.textAlign = 'center';

	// 	context.drawImage(typeCanvas, 0, 0);



  //   return ({ context, width, height }) => {
  //     context.fillStyle = 'white';
  //     context.fillRect(0, 0, width, height);
  
  //     for (let i = 0; i < agents.length; i++) {
  //       const agent = agents[i];
  //       for (let j = i + 1; j < agents.length; j++) {
  //         const other = agents[j];
  //         const dist = agent.pos.getDistance(other.pos);
  //         if (dist > connectDistance) continue;
  //         context.lineWidth = math.mapRange(dist, 0, connectDistance - 2, 2, 0.1);
  //         context.beginPath();
  //         context.moveTo(agent.pos.x, agent.pos.y);
  //         context.lineTo(other.pos.x, other.pos.y);
  //         context.lineWidth = strokeWidth;
  //         context.stroke();  
  //       }
  //     }
  
  //     agents.forEach(agent => {
  //       agent.update();
  //       agent.draw(context);
  //       // agent.bounce(width, height);
  //       // agent.telePort(width, height);
  //     });
  //   };


	// 	// for (let i = 0; i < numCells; i++) {
	// 	// 	const col = i % cols;
	// 	// 	const row = Math.floor(i / cols);
	// 	// 	const x = col * cell;
	// 	// 	const y = row * cell;

	// 	// 	// const glyph = getGlyph(r);

	// 	// 	context.font = `${cell * 2}px ${fontFamily}`;
	// 	//   // if (Math.random() < 0.1) context.font = `${cell * 6}px ${fontFamily}`;

	// 	// 	const r = typeData[i * 4 + 0];
	// 	// 	const g = typeData[i * 4 + 1];
	// 	// 	const b = typeData[i * 4 + 2];
	// 	// 	const a = typeData[i * 4 + 3];
	// 	// 	context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
      

	// 	// 	// context.save();
	// 	// 	// context.translate(x, y);
	// 	// 	// context.translate(cell * 0.5, cell * 0.5);

	// 	// 	// context.fillRect(0, 0, cell, cell);
  //   //   // context.beginPath();   
  //   //   // context.arc(0, 0, cell * 0.25, 0, Math.PI * 2);

  //   //   // context.fill(); 
  //   //   // context.fillText(text, 0, 0);           
	// 	// 	// context.fillText(glyph, 0, 0);			
	// 	// 	// context.restore();

	// 	// }
	// };
  
};


const getGlyph = (v) => {
	if (v < 50) return ' ';
	if (v < 150) return '+';
	if (v < 200) return '😃';
  if (v < 225) return '⏱';
	const glyphs = 'revelry'.split('');
	return random.pick(glyphs);
};


const onKeyUp = (e) => {
	text = e.key.toUpperCase();
	manager.render();
};

 document.addEventListener('keyup', onKeyUp);


const start = async () => {
	manager = await canvasSketch(sketch, settings);
};

start();

console.log(agents);
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
    // this.vel = new Vector(random.range(-speed, speed), random.range(-speed, speed));
    // this.radius = random.range(minRad, maxRad);
  }

  // telePort(width, height, radius) {
  //   console.log(radius);
  //   if (this.pos.x < this.radius * -1) this.pos.x = width + this.radius;
  //   if (this.pos.x > width + this.radius) this.pos.x = this.radius * -1;
	// 	if (this.pos.y < this.radius * -1) this.pos.y = height + this.radius;
  //   if (this.pos.y > height + this.radius) this.pos.y = this.radius * -1;
  // }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  draw(context) {    
    context.save();
    context.translate(this.pos.x, this.pos.y);

    context.fillStyle= 'white';
    context.strokeStyle= 'black';
  
    context.lineWidth = 3;
    
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.restore();    
  }
}
