'use strict';
// Clearance-aware A*: diagonal corner cutting is prohibited. Static occupancy is
// rebuilt only when a structure changes; mobile separation never pushes into it.
const NAV = 30,
  NC = 60,
  NR = 42;
const obstacles = [
  { x: 780, y: 0, w: 120, h: 350 },
  { x: 780, y: 535, w: 120, h: 180 },
  { x: 780, y: 1000, w: 120, h: 260 },
];
const covers = [
  { x: 615, y: 440, r: 78 },
  { x: 1030, y: 430, r: 78 },
  { x: 620, y: 875, r: 80 },
  { x: 1090, y: 875, r: 80 },
  { x: 1330, y: 540, r: 65 },
];
const NAV_DIRECTIONS = [[1,0],[Math.SQRT1_2,Math.SQRT1_2],[0,1],[-Math.SQRT1_2,Math.SQRT1_2],[-1,0],[-Math.SQRT1_2,-Math.SQRT1_2],[0,-1],[Math.SQRT1_2,-Math.SQRT1_2]];
let navVersion = 0,
  navStamp = '',
  blocked = new Uint8Array(NC * NR),
  navStats = { searches: 0, expanded: 0 };
let solidCacheAt = -1,
  solidCacheCount = -1,
  solidBuildings = [];
function solidAt(x, y, r = 21) {
  if (solidCacheAt !== t || solidCacheCount !== units.length) {
    solidCacheAt = t;
    solidCacheCount = units.length;
    solidBuildings = units.filter((b) => !defs[b.type].speed);
  }
  if (x < r || y < r || x > W - r || y > H - r) return true;
  if (obstacles.some((o) => x > o.x - r && x < o.x + o.w + r && y > o.y - r && y < o.y + o.h + r))
    return true;
  return solidBuildings.some((b) => b.hp > 0 && dist({x,y},b) < b.r + r);
}
function rebuildNav() {
  const stamp = units
    .filter((b) => b.hp > 0 && !defs[b.type].speed)
    .map((b) => b.id)
    .join(',');
  if (stamp === navStamp) return;
  navStamp = stamp;
  navVersion++;
  for (let y = 0; y < NR; y++)
    for (let x = 0; x < NC; x++) blocked[y * NC + x] = solidAt(x * NAV + 15, y * NAV + 15) ? 1 : 0;
}
function clearSegment(a, b, r = 21) {
  const n = Math.ceil(dist(a, b) / 12);
  for (let i = 1; i <= n; i++)
    if (solidAt(a.x + ((b.x - a.x) * i) / n, a.y + ((b.y - a.y) * i) / n, r)) return false;
  return true;
}
function cell(p) {
  return clamp(Math.floor(p.y / NAV), 0, NR - 1) * NC + clamp(Math.floor(p.x / NAV), 0, NC - 1);
}
function point(i) {
  return { x: (i % NC) * NAV + 15, y: Math.floor(i / NC) * NAV + 15 };
}
function freeCell(p) {
  let best = -1,
    score = Infinity;
  for (let i = 0; i < blocked.length; i++)
    if (!blocked[i]) {
      const q = point(i),
        d = dist(p, q);
      if (d < score) {
        score = d;
        best = i;
      }
    }
  return best;
}
function route(start, goal) {
  rebuildNav();
  navStats.searches++;
  let s = cell(start),
    g = cell(goal);
  if (blocked[g]) g = freeCell(goal);
  if (g < 0) return [];
  const costs = new Float64Array(NC * NR).fill(Infinity),
    parent = new Int32Array(NC * NR).fill(-1),
    closed = new Uint8Array(NC * NR),
    heap = [];
  const heuristic = (i) => dist(point(i), point(g)) / NAV;
  function push(i, f) {
    heap.push({ i, f });
    let k = heap.length - 1;
    while (k) {
      let p = (k - 1) >> 1;
      if (heap[p].f <= f) break;
      [heap[k], heap[p]] = [heap[p], heap[k]];
      k = p;
    }
  }
  function pop() {
    const top = heap[0],
      end = heap.pop();
    if (heap.length) {
      heap[0] = end;
      let k = 0;
      while (true) {
        let a = k * 2 + 1,
          b = a + 1,
          m = k;
        if (a < heap.length && heap[a].f < heap[m].f) m = a;
        if (b < heap.length && heap[b].f < heap[m].f) m = b;
        if (m === k) break;
        [heap[k], heap[m]] = [heap[m], heap[k]];
        k = m;
      }
    }
    return top.i;
  }
  costs[s] = 0;
  push(s, heuristic(s));
  while (heap.length) {
    let i = pop();
    if (closed[i]) continue;
    closed[i] = 1;
    navStats.expanded++;
    if (i === g) {
      let path = [];
      while (i !== s && i >= 0) {
        path.push(point(i));
        i = parent[i];
      }
      return path.reverse();
    }
    const x = i % NC,
      y = Math.floor(i / NC);
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        let xx = x + dx,
          yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= NC || yy >= NR) continue;
        let n = yy * NC + xx;
        if (blocked[n] || closed[n] || (dx && dy && (blocked[y * NC + xx] || blocked[yy * NC + x])))
          continue;
        const c = costs[i] + (dx && dy ? Math.SQRT2 : 1);
        if (c < costs[n]) {
          costs[n] = c;
          parent[n] = i;
          push(n, c + heuristic(n));
        }
      }
  }
  return [];
}
function move(u, target, dt, stop = 3) {
  if (artilleryLocked(u)) return false;
  let approaching=false;
  if(u.approach){
    const a=u.approach;
    if(a.target!==target||a.stop!==stop||dist(a,target)>30||dist(u,a.point)<7)u.approach=null;
    else {target=a.point;stop=3;approaching=true;}
  }
  // Coordinate orders must finish at a traversable destination. A* already
  // routes to a free cell, but comparing arrival against the original blocked
  // click left these orders alive forever and trapped subsequent waypoints.
  if(target===u.order && Number.isFinite(target.x) && stop<=8 && solidAt(target.x,target.y,u.r+2)) {
    rebuildNav();
    const old=u.resolvedDestination;
    if(!old || old.order!==target || old.version!==navVersion || old.x!==target.x || old.y!==target.y) {
      const free=freeCell(target);
      u.resolvedDestination={order:target,version:navVersion,x:target.x,y:target.y,point:free<0?null:point(free)};
    }
    if(!u.resolvedDestination.point)return false;
    target=u.resolvedDestination.point;
  }
  const distance = dist(u, target);
  if (distance <= stop + 1) return !approaching;
  let goal = { x: target.x, y: target.y };
  if (stop > 5) {
    goal.x += ((u.x - target.x) / distance) * stop;
    goal.y += ((u.y - target.y) / distance) * stop;
  }
  let waypoint = goal;
  if (!clearSegment(u, goal, u.r + 2)) {
    if (
      !u.path ||
      u.pathVersion !== navVersion ||
      !u.pathGoal ||
      dist(goal, u.pathGoal) > 45 ||
      t > (u.repathAt || 0)
    ) {
      u.path = route(u, goal);
      // A nearest stand-off cell can be an isolated pocket between a building
      // and terrain. Try other approach sides before leaving cargo stranded.
      if(!u.path.length&&stop>5){
        const radius=stop+NAV;
        const approaches=Array.from({length:8},(_,i)=>({
          x:target.x+NAV_DIRECTIONS[i][0]*radius,
          y:target.y+NAV_DIRECTIONS[i][1]*radius,
        })).filter(p=>!solidAt(p.x,p.y,u.r+2)).sort((a,b)=>dist(a,goal)-dist(b,goal));
        for(const approach of approaches){
          const path=route(u,approach);
          if(path.length){u.path=path;u.approach={target,x:target.x,y:target.y,stop,point:approach};break;}
        }
      }
      u.pathGoal = goal;
      u.pathVersion = navVersion;
      u.repathAt = t + 2 + (u.id % 5) * 0.12;
    }
    while (u.path.length && dist(u, u.path[0]) < 7) u.path.shift();
    if (!u.path.length) return false;
    waypoint = u.path[0];
  } else u.path = null;
  const speed =
    defs[u.type].speed * ((u.advanceUntil || 0) > t || rapidActive(u) ? RAPID_ADVANCE.speed : 1) *
    (u.team === 0 && benefits.has('arthur') ? 1.15 : 1) *
    (u.team === 1 && wave >= 4 ? 1.1 : 1) *
    (u.order?.kind === 'retreat' ? 1.2 : u.morale < 45 ? 0.7 : 1);
  const step = Math.min(speed * dt, dist(u, waypoint));
  u.angle = Math.atan2(waypoint.y - u.y, waypoint.x - u.x);
  const length=dist(u,waypoint)||1;
  const x = u.x + (waypoint.x-u.x)/length * step,
    y = u.y + (waypoint.y-u.y)/length * step;
  if (!solidAt(x, y, u.r)) {
    u.x = x;
    u.y = y;
    u.walkDistance = (u.walkDistance || 0) + step;
    u.movingUntil = t + 0.12;
  } else {
    u.repathAt = 0;
  }
  return false;
}
function separate() {
  const mobile = units.filter((u) => u.hp > 0 && defs[u.type].speed);
  for (let i = 0; i < mobile.length; i++)
    for (let j = i + 1; j < mobile.length; j++) {
      const a = mobile[i],
        b = mobile[j],
        dx = a.x - b.x,
        dy = a.y - b.y,
        d = Math.sqrt(dx*dx+dy*dy),
        min = a.r + b.r + 3;
      if (d < min) {
        const direction = d > 0.01 ? [dx/d,dy/d] : NAV_DIRECTIONS[a.id%8];
        const push = (min - d) * 0.28;
        for (const [u, sign] of [
          [a, 1],
          [b, -1],
        ]) {
          if (artilleryLocked(u)) continue;
          const x = u.x + direction[0] * push * sign,
            y = u.y + direction[1] * push * sign;
          if (!solidAt(x, y, u.r)) {
            u.x = x;
            u.y = y;
          }
        }
      }
    }
}
