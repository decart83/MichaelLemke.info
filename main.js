// michaellemke.info — minimal vanilla JS
// Handles: mobile nav, hero word rotator, and rendering experience/projects from JSON.

(function () {
  // --- Mobile nav toggle ---
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
  }

  // --- Hero word rotator ---
  const rotator = document.querySelector("[data-rotator]");
  if (rotator) {
    const words = (rotator.dataset.rotator || "").split(",").map((s) => s.trim()).filter(Boolean);
    let i = 0;
    if (words.length) {
      rotator.textContent = words[0];
      setInterval(() => {
        i = (i + 1) % words.length;
        rotator.style.opacity = 0;
        setTimeout(() => {
          rotator.textContent = words[i];
          rotator.style.opacity = 1;
        }, 250);
      }, 2600);
      rotator.style.transition = "opacity .25s ease";
    }
  }

  // --- Data rendering helpers ---
  async function loadJSON(path) {
    try {
      const res = await fetch(path, { cache: "no-cache" });
      if (!res.ok) throw new Error(res.status);
      return await res.json();
    } catch (e) {
      console.warn("Could not load", path, e);
      return [];
    }
  }

  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function dateRange(start, end) {
    if (!start && !end) return "";
    return [start, end].filter(Boolean).join(" – ");
  }

  // --- Render experience cards/timeline ---
  const expMount = document.querySelector("[data-experience]");
  if (expMount) {
    const limit = parseInt(expMount.dataset.limit || "0", 10);
    const timeline = expMount.classList.contains("timeline");
    loadJSON(expMount.dataset.experience || "data/experience.json").then((items) => {
      const list = limit ? items.slice(0, limit) : items;
      list.forEach((job) => {
        const meta = [job.title, dateRange(job.start, job.end)].filter(Boolean).join(" · ");
        if (timeline) {
          const entry = el("div", "entry");
          entry.appendChild(el("h3", null, job.company));
          entry.appendChild(el("p", "exp-meta", meta));
          if (job.summary) entry.appendChild(el("p", "muted", job.summary));
          expMount.appendChild(entry);
        } else {
          const card = el("div", "card exp-card");
          const logo = el("img", "exp-logo");
          logo.src = job.logo || "";
          logo.alt = job.company + " logo";
          logo.loading = "lazy";
          logo.onerror = () => { logo.style.display = "none"; };
          const body = el("div");
          body.appendChild(el("h3", null, job.company));
          body.appendChild(el("p", "exp-meta", meta));
          card.appendChild(logo);
          card.appendChild(body);
          expMount.appendChild(card);
        }
      });
    });
  }

  // --- Render project cards ---
  const projMount = document.querySelector("[data-projects]");
  if (projMount) {
    const limit = parseInt(projMount.dataset.limit || "0", 10);
    loadJSON(projMount.dataset.projects || "data/projects.json").then((items) => {
      const list = limit ? items.slice(0, limit) : items;
      list.forEach((p) => {
        const card = el("div", "card project-card");
        if (p.thumb) {
          const img = el("img");
          img.src = p.thumb; img.alt = p.title; img.loading = "lazy";
          img.onerror = () => { img.style.display = "none"; };
          card.appendChild(img);
        }
        card.appendChild(el("h3", null, p.title));
        if (p.summary) card.appendChild(el("p", "muted", p.summary));
        const linkRow = el("div", "links");
        if (p.link) linkRow.appendChild(el("a", null, "View ↗")).setAttribute("href", p.link);
        if (p.detail) linkRow.appendChild(el("a", null, "Details")).setAttribute("href", p.detail);
        card.appendChild(linkRow);
        projMount.appendChild(card);
      });
    });
  }
})();
