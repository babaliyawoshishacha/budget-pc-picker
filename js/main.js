// ===== Theme toggle (shared, icon version) =====
const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");
const body = document.body;

// restore preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") body.classList.add("light");

// set initial icon
if (themeIcon) {
    themeIcon.textContent = body.classList.contains("light") ? "☼" : "☽";
}

if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        body.classList.toggle("light");
        const isLight = body.classList.contains("light");
        localStorage.setItem("theme", isLight ? "light" : "dark");

        if (themeIcon) {
            themeIcon.textContent = isLight ? "☼" : "☽";
        }
    });
}

// ===== Footer year (shared) =====
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Demo handlers (optional placeholders) =====
// These prevent form submission refresh during demo phase.
// You can remove these when you implement real logic.


const usedForm = document.getElementById("usedForm");
if (usedForm) {
    usedForm.addEventListener("submit", (e) => {
        e.preventDefault();

        alert("Used Price Checker：We will use JS here next");
    });
}
// ===============================
// Theme toggle (light / dark)
// ===============================
(function () {
  const btn = document.getElementById("themeBtn");
  const icon = document.getElementById("themeIcon");
  if (!btn || !icon) return;

  const root = document.documentElement;

  function updateIcon() {
    const isLight = root.classList.contains("light");
    icon.textContent = isLight ? "☀" : "☽";
  }

  btn.addEventListener("click", () => {
    root.classList.toggle("light");
    updateIcon();
  });

  updateIcon();
})();

// ===============================
// Footer year
// ===============================
(function () {
  const span = document.getElementById("year");
  if (!span) return;
  span.textContent = new Date().getFullYear();
})();

// ======================================
// Scroll -> smooth gradient shift on CTA
// Trigger when How It Works section
// reaches roughly the upper third of viewport
// ======================================
(function () {
  const btn = document.querySelector(".btn.scroll-reactive");
  const section = document.getElementById("how-it-works");
  if (!btn || !section) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      // 根据 isIntersecting 来切换 class
      btn.classList.toggle("is-active", entry.isIntersecting);
    },
    {
      /*
        rootMargin 使用百分比：
        - 上边界向下推 30% 视口高度
        - 下边界向上收 40% 视口高度
        这样只有当 how-it-works 真正滚到“中上部”时才算 intersecting。
      */
      rootMargin: "-30% 0px -40% 0px",
      threshold: 0
    }
  );

  observer.observe(section);
})();
// ======================================
// Scroll reveal for Feature 1 & 2 (fade in up)
// ======================================
(function () {
    const items = document.querySelectorAll(".reveal-up");
    if (!items.length) return;

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    // once revealed, stop observing for performance
                    obs.unobserve(entry.target);
                }
            });
        },
        {
            // triggers when item enters lower-mid viewport
            rootMargin: "0px 0px -10% 0px",
            threshold: 0.15,
        }
    );

    items.forEach((el) => observer.observe(el));
})();
/* =========================
   Budget Picker logic
   ========================= */

/* Data from your spreadsheet */
const CONFIGS = [
    { PRIZE: 230, CPU: "R5 5500GT", GPU: "VEGA7", SSD: "RC20 512GB", RAM: "DDR4 8G×2" },
    { PRIZE: 320, CPU: "i3 13100F", GPU: "RX6500XT", SSD: "RC20 512GB", RAM: "DDR4 8G×2" },
    { PRIZE: 390, CPU: "i3 13100F", GPU: "RTX5050", SSD: "RC20 512GB", RAM: "DDR4 8G×2" },
    { PRIZE: 470, CPU: "i5 12400F", GPU: "ARC B580", SSD: "SN3000 1T", RAM: "DDR4 8G×2" },
    { PRIZE: 540, CPU: "R5 5600", GPU: "RTX5060", SSD: "SN3000 1T", RAM: "DDR4 8G×2" },
    { PRIZE: 570, CPU: "i5 12600KF", GPU: "RTX5060", SSD: "SN3000 1T", RAM: "DDR4 8G×2" },
    { PRIZE: 690, CPU: "i5 12600KF", GPU: "RTX5060TI", SSD: "S790 1TB", RAM: "DDR4 8G×2" },
    { PRIZE: 790, CPU: "i5 14600KF", GPU: "RTX5060TI", SSD: "S790 1TB", RAM: "DDR4 8G×2" },
    { PRIZE: 915, CPU: "i5 14600KF", GPU: "RTX5070", SSD: "S790 1TB", RAM: "DDR4 8G×2" },
    { PRIZE: 1050, CPU: "R7 9700", GPU: "RTX5070", SSD: "S790 1TB", RAM: "DDR5 16G×2" },
    { PRIZE: 1120, CPU: "R7 7800X3D", GPU: "RTX5070", SSD: "SN700 1TB", RAM: "DDR5 16G×2" },
    { PRIZE: 1320, CPU: "Ultra7 265K", GPU: "RTX5070TI", SSD: "SN700 1TB", RAM: "DDR5 16G×2" },
    { PRIZE: 1460, CPU: "R7 9800X3D", GPU: "RTX5070TI", SSD: "SN700 1TB", RAM: "DDR5 16G×2" },
    { PRIZE: 1720, CPU: "R7 9800X3D", GPU: "RTX5080", SSD: "SN850X 1TB", RAM: "DDR5 16G×2" },
    { PRIZE: 2060, CPU: "R9 9950X3D", GPU: "RTX5080OC", SSD: "SN850X 2TB", RAM: "DDR5 24G×2" }
];
function getLowestConfig() {
    return CONFIGS.reduce((min, row) => (row.PRIZE < min.PRIZE ? row : min), CONFIGS[0]);
}

function getEligibleConfigs(budget) {
    // 低于等于预算的全部配置
    return CONFIGS
        .filter(r => r.PRIZE <= budget)
        .sort((a, b) => b.PRIZE - a.PRIZE); // 从高到低(离预算最近的在前)
}

function getConfigByMode(budget, mode) {
    const eligible = getEligibleConfigs(budget);
    const lowest = getLowestConfig();

    // 你说的规则：如果不够 2 或 3 个，直接给最低价
    if (mode === "gaming") {
        return eligible.length >= 1 ? eligible[0] : lowest;
    }
    if (mode === "balanced") {
        return eligible.length >= 2 ? eligible[1] : lowest;
    }
    if (mode === "productivity") {
        return eligible.length >= 3 ? eligible[2] : lowest;
    }

    // 默认兜底
    return eligible[0] || lowest;
}

const useCaseSelect = document.getElementById("useCase");

if (useCaseSelect) {
    useCaseSelect.addEventListener("change", () => {
        const v = budgetInput.value.trim();
        const num = Number(v);

        // 只有“有价格”时才自动刷新
        if (v && !Number.isNaN(num)) {
            // 触发表单 submit 逻辑（你已 preventDefault）
            form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("budgetForm");
    const budgetInput = document.getElementById("budgetInput");

    // mini cards
    const cpuCard = document.getElementById("cpuCard");
    const gpuCard = document.getElementById("gpuCard");
    const ssdCard = document.getElementById("ssdCard");
    const ramCard = document.getElementById("ramCard");

    const cpuValue = document.getElementById("cpuValue");
    const gpuValue = document.getElementById("gpuValue");
    const ssdValue = document.getElementById("ssdValue");
    const ramValue = document.getElementById("ramValue");

    if (!form || !budgetInput) return;

    const cards = [cpuCard, gpuCard, ssdCard, ramCard];

    function resetCards() {
        cards.forEach(c => c && c.classList.remove("is-show"));
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const brandRow = document.querySelector(".bp-brand-row");
        if (brandRow) brandRow.classList.add("is-hide");

        const budget = Number(budgetInput.value);

        if (!budgetInput.value || Number.isNaN(budget)) {
            alert("Please enter a valid number.");
            return;
        }

        if (budget < 250) {
            alert("At least 250");
            return;
        }

        const useCaseSelect = document.getElementById("useCase");
        const mode = (useCaseSelect?.value || "Balanced").toLowerCase();
        const row = getConfigByMode(budget, mode);

        if (!row) {
            alert("No suitable configuration found.");
            return;
        }
        // ✅ Hide brand logos on Generate (works for all layouts)
        const brandWrap = document.querySelector(".bp-brand-row, .bp-brand-grid, .brand-logos");
        if (brandWrap) brandWrap.classList.add("is-hide");


        // 每次点击都像“刷新”一样重置再播放
        // 判断是不是已经有“旧 label/旧结果”
        const hasOld = cards.some(c => c && c.classList.contains("is-show"));

        const playReveal = () => {
            // 先保证是干净的隐藏态
            cards.forEach(c => c && c.classList.remove("is-show", "is-fade-out"));

            // 更新新内容
            cpuValue.textContent = row.CPU;
            gpuValue.textContent = row.GPU;
            ssdValue.textContent = row.SSD;
            ramValue.textContent = row.RAM;

            // 依次从下往上出现
            cards.forEach((card, i) => {
                if (!card) return;
                setTimeout(() => card.classList.add("is-show"), i * 180);
            });
        };

        if (!hasOld) {
            // ✅ 没有旧 label：直接出现
            playReveal();
        } else {
            // ✅ 有旧 label：先原地渐隐
            cards.forEach(c => c && c.classList.add("is-fade-out"));

            // 等淡出完成，再播新一轮出现
            setTimeout(() => {
                playReveal();
            }, 230);
        }

    });
});
window.addEventListener(
    "scroll",
    () => document.body.classList.add("has-scrolled"),
    { once: true }
);
/* =========================
   Re-show logos when Used Guide button enters view
   Hide 4 config cards if visible
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
    const usedBtn = document.getElementById("usedGuideBtn");

    // brand container (robust selector)
    const brandWrap = document.querySelector(
        ".bp-brand-row, .bp-brand-grid, .brand-logos, .brand-scroll-lock"
    );

    // your four mini cards
    const cards = [
        document.getElementById("cpuCard"),
        document.getElementById("gpuCard"),
        document.getElementById("ssdCard"),
        document.getElementById("ramCard")
    ].filter(Boolean);

    const hideCardsInstant = () => {
        cards.forEach(c => {
            c.classList.remove("is-show");
            c.classList.remove("is-fade-out");
            // 可选：如果你想彻底收起交互
            // c.style.pointerEvents = "none";
        });
    };

    if (!usedBtn) return;

    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 1) logos re-appear
                    if (brandWrap) brandWrap.classList.remove("is-hide");

                    // 2) if 4 labels are shown, auto hide them
                    const hasLabels = cards.some(c => c.classList.contains("is-show"));
                    if (hasLabels) hideCardsInstant();
                }
            });
        },
        {
            root: null,
            threshold: 0.25 // 按钮 25% 进入屏幕就触发
        }
    );

    io.observe(usedBtn);
});
/* =============================================
   Budget PC Picker - main.js (clean + stable)
   ============================================= */

// -----------------------------
// Theme toggle (shared)
// -----------------------------
(function () {
    const btn = document.getElementById("themeBtn");
    const icon = document.getElementById("themeIcon");
    const target = document.body;
    if (!btn) return;

    const saved = localStorage.getItem("theme");
    if (saved === "light") target.classList.add("light");

    function syncIcon() {
        if (!icon) return;
        icon.textContent = target.classList.contains("light") ? "☼" : "☽";
    }

    btn.addEventListener("click", () => {
        target.classList.toggle("light");
        localStorage.setItem("theme", target.classList.contains("light") ? "light" : "dark");
        syncIcon();
    });

    syncIcon();
})();

// -----------------------------
// Footer year (shared)
// -----------------------------
(function () {
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
})();

// -----------------------------
// Generic reveal-up observer
// -----------------------------
(function () {
    const items = document.querySelectorAll(".reveal-up");
    if (!items.length) return;

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    obs.unobserve(entry.target);
                }
            });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );

    items.forEach((el) => observer.observe(el));
})();

// -----------------------------
// Home: scroll-reactive CTA
// -----------------------------
(function () {
    const btn = document.querySelector(".btn.scroll-reactive");
    const section = document.getElementById("how-it-works");
    if (!btn || !section) return;

    const observer = new IntersectionObserver(
        (entries) => {
            btn.classList.toggle("is-active", entries[0].isIntersecting);
        },
        { rootMargin: "-30% 0px -40% 0px", threshold: 0 }
    );

    observer.observe(section);
})();

// -----------------------------
// Used Price Checker logic
// -----------------------------
(function () {
    const modelForm = document.getElementById("usedModelForm");
    const priceForm = document.getElementById("usedPriceForm");
    const modelInput = document.getElementById("usedModelInput");
    const priceInput = document.getElementById("usedPriceInput");
    const scribble = document.getElementById("last6Scribble");
    const chartWrapper = document.getElementById("chartWrapper");
    const chartTitle = document.getElementById("chartTitle");
    const canvas = document.getElementById("priceChart");

    if (!modelForm || !priceForm || !canvas) return;
    // ① “Generate 6-Month Chart” 提交：清空 Target budget 输入框
    modelForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const v = modelInput?.value.trim();
        if (!v) return;

        // 清空下面的 Target budget 输入框
        if (priceInput) {
            priceInput.value = "";
        }

        const row = findByModel(v);
        if (!row) {
            alert("Model not found in the demo table. Please check spelling.");
            return;
        }
        renderRow(row, "exact model match");
    });

    // ② “Find Closest Model & Chart” 提交：清空 Model name 输入框
    priceForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const raw = priceInput?.value.trim();
        const num = Number(raw);
        if (!raw || Number.isNaN(num)) return;

        // 清空上面的 Model name 输入框
        if (modelInput) {
            modelInput.value = "";
        }

        const row = findByPrice(num);
        renderRow(row, "closest lower December price");
    });

    const MONTH_KEYS = ["JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const MONTH_LABELS = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Demo table (replace with your real data later)
    const USED_PRICES = [
        { MODEL: "RTX 4090", JUL: 1830, AUG: 1760, SEP: 1700, OCT: 1700, NOV: 1750, DEC: 1840 },
        { MODEL: "RTX 4080S", JUL: 633, AUG: 667, SEP: 632, OCT: 635, NOV: 620, DEC: 610 },
        { MODEL: "RTX 4080", JUL: 590, AUG: 610, SEP: 610, OCT: 601, NOV: 600, DEC: 600 },
        { MODEL: "RTX 4070TiS", JUL: 510, AUG: 500, SEP: 479, OCT: 451, NOV: 422, DEC: 442 },
        { MODEL: "RTX 4070S", JUL: 364, AUG: 360, SEP: 350, OCT: 340, NOV: 346, DEC: 335 },
        { MODEL: "RTX 4070", JUL: 333, AUG: 321, SEP: 315, OCT: 305, NOV: 301, DEC: 304 },
        { MODEL: "RTX 4060Ti", JUL: 271, AUG: 265, SEP: 255, OCT: 255, NOV: 252, DEC: 260 },
        { MODEL: "RTX 4060", JUL: 190, AUG: 188, SEP: 187, OCT: 185, NOV: 185, DEC: 181 },
        { MODEL: "RTX 3090", JUL: 550, AUG: 497, SEP: 460, OCT: 452, NOV: 465, DEC: 480 },
        { MODEL: "RTX 3080Ti", JUL: 300, AUG: 288, SEP: 280, OCT: 288, NOV: 269, DEC: 265 },
        { MODEL: "RTX 3080", JUL: 212, AUG: 218, SEP: 200, OCT: 200, NOV: 195, DEC: 168 },
        { MODEL: "RTX 3070Ti", JUL: 190, AUG: 179, SEP: 176, OCT: 174, NOV: 145, DEC: 145 },
        { MODEL: "RTX 3070", JUL: 166, AUG: 155, SEP: 149, OCT: 148, NOV: 168, DEC: 145 },
        { MODEL: "RTX 3060Ti", JUL: 152, AUG: 145, SEP: 142, OCT: 140, NOV: 145, DEC: 138 },
        { MODEL: "RTX 3060", JUL: 135, AUG: 132, SEP: 130, OCT: 128, NOV: 140, DEC: 130 },
        { MODEL: "RTX 2080Ti", JUL: 210, AUG: 182, SEP: 185, OCT: 180, NOV: 130, DEC: 170 }
    ];


    function norm(s) {
        return String(s || "")
            .trim()
            .toUpperCase()
            .replace(/\s+/g, " ");
    }

    function findByModel(input) {
        const key = norm(input);
        return USED_PRICES.find(r => norm(r.MODEL) === key) || null;
    }

    function findByPrice(inputPrice) {
        const budget = Number(inputPrice);
        if (Number.isNaN(budget)) return null;

        const sorted = [...USED_PRICES].sort((a, b) => a.DEC - b.DEC);
        const eligible = sorted.filter(r => r.DEC <= budget);

        if (eligible.length) return eligible[eligible.length - 1];
        return sorted[0] || null;
    }

    function fadeOutScribble() {
        if (!scribble) return;
        scribble.classList.add("is-fade");
    }

    function showChartWrapper() {
        if (!chartWrapper) return;
        chartWrapper.hidden = false;
        chartWrapper.classList.add("is-visible");
    }

    function drawLineChart(values) {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const parent = canvas.parentElement;
        const width = Math.min(680, parent?.clientWidth || 680);
        const height = 360;

        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        const padding = { top: 34, right: 24, bottom: 42, left: 52 };
        const w = width - padding.left - padding.right;
        const h = height - padding.top - padding.bottom;

        const minV = Math.min(...values);
        const maxV = Math.max(...values);
        const range = Math.max(1, maxV - minV);
        const pad = range * 0.12;
        const yMin = minV - pad;
        const yMax = maxV + pad;

        const lineColor =
            getComputedStyle(document.body).getPropertyValue("--accent").trim() || "#38bdf8";
        const textColor =
            getComputedStyle(document.body).getPropertyValue("--muted").trim() || "#94a3b8";

        ctx.clearRect(0, 0, width, height);

        // axes
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(128,128,128,0.25)";
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top);
        ctx.lineTo(padding.left, padding.top + h);
        ctx.lineTo(padding.left + w, padding.top + h);
        ctx.stroke();

        // y labels + grid
        ctx.fillStyle = textColor;
        ctx.font = "12px Manrope, system-ui, sans-serif";
        for (let i = 0; i <= 2; i++) {
            const t = i / 2;
            const val = Math.round((yMax - t * (yMax - yMin)));
            const y = padding.top + t * h;
            ctx.fillText(`£${val}`, 8, y + 4);

            ctx.strokeStyle = "rgba(128,128,128,0.12)";
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(padding.left + w, y);
            ctx.stroke();
        }

        // x labels
        const stepX = w / (values.length - 1);
        MONTH_LABELS.forEach((lab, i) => {
            const x = padding.left + i * stepX;
            ctx.fillStyle = textColor;
            ctx.fillText(lab, x - 10, padding.top + h + 28);
        });

        // line
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        values.forEach((v, i) => {
            const x = padding.left + i * stepX;
            const y = padding.top + (1 - (v - yMin) / (yMax - yMin)) * h;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // points
        ctx.fillStyle = lineColor;
        values.forEach((v, i) => {
            const x = padding.left + i * stepX;
            const y = padding.top + (1 - (v - yMin) / (yMax - yMin)) * h;
            ctx.beginPath();
            ctx.arc(x, y, 3.5, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function renderRow(row, reason) {
        if (!row) return;
        const values = MONTH_KEYS.map(k => Number(row[k]));

        const canvasWrap = document.getElementById("chartCanvasWrap");

        // 1) 更新标题文本
        if (chartTitle) {
            chartTitle.textContent = `${row.MODEL} · Last 6 Months (${reason})`;
        }

        // 2) 先重置动画类（为了每次点击都能重新播）
        if (chartTitle) {
            chartTitle.classList.remove("animate-in");
            void chartTitle.offsetWidth; // 强制 reflow
        }
        if (canvasWrap) {
            canvasWrap.classList.remove("reveal-in");
            void canvasWrap.offsetWidth;
        }

        // 3) 你的原有逻辑
        fadeOutScribble();
        showChartWrapper();
        drawLineChart(values);

        // 4) 下一帧触发动画（更稳定）
        requestAnimationFrame(() => {
            chartTitle?.classList.add("animate-in");
            canvasWrap?.classList.add("reveal-in");
        });
    }
    modelForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const v = modelInput?.value.trim();
        if (!v) return;

        const row = findByModel(v);
        if (!row) {
            alert("Model not found in the demo table. Please check spelling.");
            return;
        }
        renderRow(row, "exact model match");
    });

    priceForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const raw = priceInput?.value.trim();
        const num = Number(raw);
        if (!raw || Number.isNaN(num)) return;

        const row = findByPrice(num);
        renderRow(row, "closest lower December price");
    });
})();



