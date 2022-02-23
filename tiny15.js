const status = document.querySelector('h2');
const canvas = document.querySelector('canvas');
const button = document.querySelector('button');
const ctx = canvas.getContext('2d');
const field = [
  [{ num: null, x:0 , y:0 }, { num: null, x:1 , y:0 }, { num: null, x:2 , y:0 }, { num: null, x:3 , y:0 }],
  [{ num: null, x:0 , y:1 }, { num: null, x:1 , y:1 }, { num: null, x:2 , y:1 }, { num: null, x:3 , y:1 }],
  [{ num: null, x:0 , y:2 }, { num: null, x:1 , y:2 }, { num: null, x:2 , y:2 }, { num: null, x:3 , y:2 }],
  [{ num: null, x:0 , y:3 }, { num: null, x:1 , y:3 }, { num: null, x:2 , y:3 }, { num: null, x:3 , y:3 }],
];
const sequence = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
let moves = 0, pos = { x: -1, y: -1 }

const placePuzzleOnField = () => {
  for (let i = 0; i < 12; i++) {
    let [index1, index2] = [15, 15];
    while (index1 === 15 || index2 === 15 || index1 === index2) {
      [index1, index2] = [Math.floor(Math.random() * 16), Math.floor(Math.random() * 16)];
    }
    [sequence[index1], sequence[index2]] = [sequence[index2], sequence[index1]]
  }
  let row = 0;
  sequence.forEach((elem, i) => {
    const col = i % 4;
    field[row][col].num = elem;
    if (col === 3) { row += 1; }
  });
};

const hasZeroNeighbor = (x, y) => {
  if (field[y - 1]?.[x]?.num === 0) { return {x: x, y: y - 1}; }
  if (field[y + 1]?.[x]?.num === 0) { return {x: x, y: y + 1}; }
  if (field[y]?.[x - 1]?.num === 0) { return {x: x - 1, y: y}; }
  if (field[y]?.[x + 1]?.num === 0) { return {x: x + 1, y: y}; }
};

const switchWithZero = (x, y) => {
  const target = hasZeroNeighbor(x, y);
  if (target) {
    field[target.y][target.x].num = field[y][x].num;
    field[y][x].num = 0;
    status.textContent = `${++moves} move${moves !== 1 ? 's' : ''}`;
  }
}

const draw = () => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.font = '30px Arial';
  field.forEach((row, y) => row.forEach((col, x) => {
    if (col.num !== 0) {
      if (x === pos.x && y === pos.y) {
        ctx.fillStyle = hasZeroNeighbor(x, y) ? '#40b700' : '#b70000';
        ctx.fillRect(x * 85 + 2 + (x * 4), y * 85 + 2 + (y * 4), 85, 85);
      }
      ctx.strokeRect(x * 85 + 2 + (x * 4), y * 85 + 2 + (y * 4), 85, 85);
      const textWidth = ctx.measureText(col.num).width;
      ctx.fillStyle = x === pos.x && y === pos.y ? '#ffffff' : '#000000';
      ctx.fillText(
        col.num,
        x * (ctx.canvas.width / 4) + ((ctx.canvas.width / 4 - textWidth) / 2),
        y * (ctx.canvas.height / 4) + ((ctx.canvas.height / 4) / 2) + 12,
      );
    }
  }));
};

placePuzzleOnField();

button.addEventListener('click', () => window.location.reload());
canvas.addEventListener('click', () => switchWithZero(pos.x, pos.y));
canvas.addEventListener('mousemove', e => {
  const canv = canvas.getBoundingClientRect();
  pos = { x: Math.floor((e.clientX - canv.left) / 89), y: Math.floor((e.clientY - canv.top) / 89) };
});

(main = () => {
  draw();
  if (!field.flat().every((elem, i, arr) => elem.num === 0 || elem.num === 15 || elem.num === arr[i + 1]?.num - 1)) {
    frame = requestAnimationFrame(main);
  } else {
    status.textContent = `You won in ${moves} moves!`;
    button.style.display = 'inline';
  }
})();
