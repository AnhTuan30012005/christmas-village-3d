/* ==========================================================================
   CODE EDITOR ENGINE (agac.py SIMULATOR)
   Recreates the exact VS Code editor view shown in the video with syntax
   highlighting, active line following, and terminal cursor animation.
   ========================================================================== */

const AGAC_PYTHON_SOURCE = `import numpy as np
import time, math, sys

# --- Constants and Configuration
TAU = 2 * np.pi
NEEDLE, TRUNK, BALL, LIGHT, GARLAND, GIFT, RIBBON, SNOWCAP, GROUND = range(9)
Y0, Y1 = 0.42, 2.55   # foliage bounds from .. to

def envelope(y):
    f = np.clip((y - Y0) / (Y1 - Y0), 0, 1)
    return 0.03 + 0.84 * (1 - f) ** 1.08

def fib(n):
    i = np.arange(n) + 0.5
    y = 1 - 2 * i / n
    r = np.sqrt(np.maximum(0.0, 1 - y * y))
    th = np.pi * (3 - np.sqrt(5)) * i
    return np.stack([r * np.cos(th), y, r * np.sin(th)], 1)

class Parts:
    def __init__(s):
        s.P, s.N, s.C, s.K, s.T, s.PH, s.SH = [], [], [], [], [], [], []

    def add(s, p, n, col, kind, t0=0.0, ph=0.0, shine=0.0):
        m = len(p)
        s.P.append(np.asarray(p, float))
        s.N.append(np.broadcast_to(np.asarray(n, float), (m, 3)))
        s.C.append(np.broadcast_to(np.asarray(col, float), (m, 3)))
        s.K.append(np.full(m, kind))
        s.T.append(np.full(m, t0))
        s.PH.append(np.full(m, ph))
        s.SH.append(np.full(m, shine))

    def done(s):
        return [np.concatenate(v) for v in (s.P, s.N, s.C, s.K, s.T, s.PH, s.SH)]

def build():
    rng = np.random.default_rng(7)
    q = Parts()
    tips = []
    tiers = np.linspace(Y0 + 0.08, Y1 - 0.15, 14)

    # --- needles: whorls of drooping branches
    for i, v in enumerate(tiers):
        R = envelope(v)
        nb = int(7 + 11 * (1 - (v - Y0) / (Y1 - Y0)))
        for b in range(nb):
            a = TAU * b / nb + i * 0.618 * TAU + rng.normal(0, 0.08)
            L = R * rng.uniform(0.82, 1.06)
            n = int(250 + 1400 * L)
            s = rng.random(n) ** 0.65
            d = np.array([np.cos(a), 0, np.sin(a)])
            side = np.array([-np.sin(a), 0, np.cos(a)])
            spread = (0.035 + 0.11 * s) * rng.normal(0, 0.35, n)
            yy = v + 0.07 * s * L - 0.22 * (s * L) ** 2 + 0.03 * rng.normal(0, 0.1, n)
            p = d[None] * (s * L)[:, None] + side[None] * spread[:, None]
            p[:, 1] = yy
            nrm = d[None] * 0.75 + np.array([0, 0.55, 0]) + rng.normal(0, 0.1, (n, 3))
            ao = 0.35 + 0.65 * s ** 1.3
            col = np.array([0.07, 0.30, 0.13]) + rng.uniform(-0.02, 0.03, (n, 3))
            t0 = 1.3 + 5.0 * (v - Y0) / (Y1 - Y0) + 0.45 * s
            snow = (s > 0.45) & (rng.random(n) < 0.06 * s) & (nrm[:, 1] > 0.3)
            q.add(p[~snow], nrm[~snow], col[~snow] * ao[~snow, None], NEEDLE, t0=t0[~snow])
            q.add(p[snow], np.array([0, 1.0, 0]), [0.92, 0.95, 1.0], SNOWCAP, t0=t0[snow])
            tips.append(d * L * 0.93 + np.array([0, v + 0.07 * L - 0.22 * L ** 2, 0]))

    # --- trunk: cylindrical bark lattice
    h, a = np.meshgrid(np.linspace(-0.05, 0.6, 50), np.linspace(0, TAU, 30))
    p = np.stack([0.085 * np.cos(a), h, 0.085 * np.sin(a)], -1).reshape(-1, 3)
    nn = np.stack([np.cos(a), 0 * a, np.sin(a)], -1).reshape(-1, 3)
    bark = 0.75 + 0.25 * np.sin(h * 90 + a * 3).ravel()
    q.add(p, nn, np.array([0.42, 0.26, 0.14])[None] * bark[:, None], TRUNK, t0=0.8)

    # --- the tinsel garland: a drooping gold spiral, in swags between tiers
    u = np.linspace(0, 1, 2600)
    turns = 3.6
    yg = Y0 + 0.15 + (Y1 - Y0 - 0.45) * u
    ag = TAU * turns * u + 0.9
    swag = -0.06 * np.abs(np.sin(ag * 2.5))
    rg_ = envelope(yg) * 1.0 + 0.02
    base = np.stack([rg_ * np.cos(ag), yg + swag, rg_ * np.sin(ag)], 1)
    q.add(base, np.array([0, 1, 0]), [1.0, 0.84, 0.0], GARLAND, t0=8.0, shine=0.9)

    # --- golden star topper & radiant beams
    p_star = fib(180) * 0.09 + np.array([0, Y1 + 0.12, 0])
    q.add(p_star, p_star - np.array([0, Y1 + 0.12, 0]), [1.0, 0.92, 0.2], LIGHT, t0=7.5, shine=1.0)

    # --- baubles & colorful festive lights
    palette = [[0.95, 0.15, 0.15], [1.0, 0.82, 0.1], [0.15, 0.65, 0.95], [0.95, 0.35, 0.8]]
    for idx, tip in enumerate(tips[::3]):
        color = palette[idx % len(palette)]
        ball_pts = fib(24) * 0.038 + tip
        q.add(ball_pts, fib(24), color, BALL, t0=8.8, shine=0.8)

    # --- presents under the tree
    box_positions = [(-0.35, 0.08, 0.3), (0.38, 0.07, 0.25), (0.05, 0.06, -0.4)]
    box_colors = [[0.85, 0.1, 0.2], [0.15, 0.45, 0.95], [0.95, 0.75, 0.1]]
    for (bx, by, bz), bcol in zip(box_positions, box_colors):
        bpts = create_box_points(bx, by, bz, size=0.18)
        q.add(bpts, np.array([0, 1, 0]), bcol, GIFT, t0=10.2)

    return q.done()

if __name__ == "__main__":
    model = build()
    print(f"Model compiled: {len(model[0])} vertices. Launching 3D ASCII terminal view...")
`;

class CodeEditor {
  constructor(lineNumContainer, codeContainer, scrollContainer) {
    this.lineNumContainer = lineNumContainer;
    this.codeContainer = codeContainer;
    this.scrollContainer = scrollContainer;
    this.lines = AGAC_PYTHON_SOURCE.trim().split("\n");
    this.currentActiveLine = 67;
    this.render();
  }

  // Token-based syntax highlighter for zero HTML corruption
  highlight(line) {
    if (!line) return "";
    const trimmed = line.trimStart();
    if (trimmed.startsWith("#")) {
      return `<span class="syn-cmt">${this.escape(line)}</span>`;
    }

    // Tokenize strings, comments, numbers, words, punctuation, whitespace
    const regex = /(".*?"|'.*?'|#.*$|\b\d+\.?\d*\b|\b[a-zA-Z_]\w*\b|[^\s\w"']+|\s+)/g;
    let match;
    let result = "";

    const keywords = new Set(["def", "class", "for", "in", "return", "import", "as", "range", "if", "else", "and", "or", "not", "is", "None", "True", "False"]);
    const builtins = new Set(["envelope", "fib", "Parts", "add", "done", "build", "print", "len", "int", "clip", "sqrt", "maximum", "stack", "cos", "sin", "asarray", "broadcast_to", "full", "concatenate", "default_rng", "linspace", "enumerate", "normal", "uniform", "random", "meshgrid", "ravel", "abs"]);
    const constants = new Set(["TAU", "NEEDLE", "TRUNK", "BALL", "LIGHT", "GARLAND", "GIFT", "RIBBON", "SNOWCAP", "GROUND", "Y0", "Y1"]);

    while ((match = regex.exec(line)) !== null) {
      const token = match[0];
      if (token.startsWith("#")) {
        result += `<span class="syn-cmt">${this.escape(token)}</span>`;
      } else if (token.startsWith('"') || token.startsWith("'")) {
        result += `<span class="syn-str">${this.escape(token)}</span>`;
      } else if (/^\d+\.?\d*$/.test(token)) {
        result += `<span class="syn-num">${this.escape(token)}</span>`;
      } else if (keywords.has(token)) {
        result += `<span class="syn-kw">${this.escape(token)}</span>`;
      } else if (constants.has(token)) {
        result += `<span class="syn-kw">${this.escape(token)}</span>`;
      } else if (builtins.has(token)) {
        result += `<span class="syn-fn">${this.escape(token)}</span>`;
      } else if (token === "s" || token === "self") {
        result += `<span class="syn-self">${this.escape(token)}</span>`;
      } else if (token === "np" || token === "math" || token === "sys" || token === "time") {
        result += `<span class="syn-var">${this.escape(token)}</span>`;
      } else {
        result += this.escape(token);
      }
    }
    return result;
  }

  escape(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  render() {
    let lineNumsHtml = "";
    let codeHtml = "";

    this.lines.forEach((line, idx) => {
      const lineNo = idx + 1;
      lineNumsHtml += `<div class="line-no">${lineNo}</div>`;
      const highlighted = this.highlight(line);
      codeHtml += `<div class="code-line" id="line-${lineNo}" data-line="${lineNo}">${highlighted}</div>`;
    });

    this.lineNumContainer.innerHTML = lineNumsHtml;
    this.codeContainer.innerHTML = codeHtml;
  }

  // Follow the construction timeline and scroll/highlight
  syncWithTimeline(timeSec) {
    let targetLine = 12;
    if (timeSec < 2) {
      targetLine = 12 + Math.floor((timeSec / 2) * 15);
    } else if (timeSec < 6) {
      targetLine = 27 + Math.floor(((timeSec - 2) / 4) * 20);
    } else if (timeSec < 10) {
      targetLine = 48 + Math.floor(((timeSec - 6) / 4) * 25);
    } else if (timeSec < 14) {
      targetLine = 73 + Math.floor(((timeSec - 10) / 4) * 18);
    } else {
      targetLine = 85 + Math.floor(((timeSec - 14) / 6) * 16);
    }

    targetLine = Math.min(this.lines.length, Math.max(1, targetLine));

    if (this.currentActiveLine !== targetLine) {
      const oldEl = document.getElementById(`line-${this.currentActiveLine}`);
      if (oldEl) {
        oldEl.classList.remove("active-line");
        const cursor = oldEl.querySelector(".cursor-block");
        if (cursor) cursor.remove();
      }

      this.currentActiveLine = targetLine;
      const newEl = document.getElementById(`line-${this.currentActiveLine}`);
      if (newEl) {
        newEl.classList.add("active-line");
        const cursor = document.createElement("span");
        cursor.className = "cursor-block";
        newEl.appendChild(cursor);

        const containerHeight = this.scrollContainer.clientHeight;
        const lineTop = newEl.offsetTop;
        this.scrollContainer.scrollTop = lineTop - containerHeight / 2;
      }
    }
  }
}

window.CodeEditor = CodeEditor;
