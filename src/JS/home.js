const W = 2;
const mazes = 
[
    { x: 'calc(100vw - 520px)', y: '50%', size: 22, cellPx: 34 },
];

function genMaze(N)
{
    const h   = Array.from({ length: N + 1 }, () => Array(N).fill(true));
    const v   = Array.from({ length: N },     () => Array(N + 1).fill(true));
    const vis = Array.from({ length: N },     () => Array(N).fill(false));
    const stack = [[0, 0]];
    vis[0][0] = true;
    const dirs = [[0,1],[1,0],[0,-1],[-1,0]];

    while (stack.length > 0)
    {
        const [r, c] = stack[stack.length - 1];
        const sh = dirs.slice().sort(() => Math.random() - 0.5);
        let moved = false;
        for (const [dr,dc] of sh)
        {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < N && nc >= 0 && nc < N && !vis[nr][nc])
            {
                vis[nr][nc] = true;
                if (dr === 0) v[r][dc > 0 ? c + 1 : c] = false;
                else h[dr > 0 ? r + 1 : r][c] = false;
                stack.push([nr, nc]);
                moved = true;
                break;
            }
        }
        if (!moved) stack.pop();
    }
    return { h, v};
}

function solveMaze(N, h, v) {
    const prev = Array.from({ length: N }, () => Array(N).fill(null));
    const seen = Array.from({ length: N }, () => Array(N).fill(false));
    const q = [[0, 0]];
    seen[0][0] = true;

    while (q.length) {
        const [r, c] = q.shift();
        if (r === N - 1 && c === N - 1) break;
        for (const [nr, nc, open] of [
            [r - 1, c, !h[r][c]],
            [r + 1, c, !h[r + 1][c]],
            [r, c - 1, !v[r][c]],
            [r, c + 1, !v[r][c + 1]],
        ]) {
            if (nr < 0 || nr >= N || nc < 0 || nc >= N || !open || seen[nr][nc]) continue;
            seen[nr][nc] = true;
            prev[nr][nc] = [r, c];
            q.push([nr, nc]);
        }
    }

    const path = [];
    let cur = [N - 1, N - 1];
    while (cur) { path.unshift(cur); cur = prev[cur[0]][cur[1]]; }
    return path;
}

function drawMaze(cfg) {
    const { x, y, size: N, cellPx: CELL } = cfg;
    const SZ = N * CELL + W;

    const cv = document.createElement('canvas');
    cv.width  = SZ;
    cv.height = SZ;
    cv.style.left = x;
    cv.style.top  = y;
    cv.classList.add('maze-canvas');
    document.getElementById('bgLayer').appendChild(cv);

    const ctx = cv.getContext('2d');
    const { h, v } = genMaze(N);

    ctx.fillStyle = '#1c1c1e';
    ctx.fillRect(0, 0, SZ, SZ);

    for (let r = 0; r < N; r++)
        for (let c = 0; c < N; c++) {
            ctx.fillStyle = '#272a36';
            ctx.fillRect(W + c * CELL, W + r * CELL, CELL - W, CELL - W);
        }

    ctx.fillStyle = '#b1bbcf';
    for (let r = 0; r <= N; r++)
        for (let c = 0; c < N; c++)
            if (h[r][c]) ctx.fillRect(W + c * CELL, r * CELL, CELL - W, W);

    for (let r = 0; r < N; r++)
        for (let c = 0; c <= N; c++)
            if (v[r][c]) ctx.fillRect(c * CELL, W + r * CELL, W, CELL - W);

    for (let r = 0; r <= N; r++)
        for (let c = 0; c <= N; c++)
            ctx.fillRect(c * CELL, r * CELL, W, W);

    const path = solveMaze(N, h, v);
    if (path.length > 1) {
        ctx.save();
        ctx.strokeStyle = '#a1f06c';
        ctx.lineWidth   = 1.5;
        ctx.lineJoin    = ctx.lineCap = 'round';
        ctx.beginPath();
        for (let i = 0; i < path.length; i++) {
            const px = W + path[i][1] * CELL + (CELL - W) / 2;
            const py = W + path[i][0] * CELL + (CELL - W) / 2;
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.restore();
    }
}

mazes.forEach(drawMaze);