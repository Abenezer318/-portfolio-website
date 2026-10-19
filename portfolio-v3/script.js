// ===== THEME =====
document.getElementById("theme-btn").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
});

// ===== MOBILE MENU =====
const menuBtn = document.getElementById("menu-btn");
const navbar = document.getElementById("navbar");

function setMenu(open) {
    navbar.classList.toggle("show", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    const icon = menuBtn.querySelector("i");
    icon.classList.toggle("fa-xmark", open);
    icon.classList.toggle("fa-bars", !open);
}
menuBtn.addEventListener("click", () => setMenu(!navbar.classList.contains("show")));
navbar.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

// ===== ACTIVE NAV LINK =====
const visible = new Set();
const sections = [...document.querySelectorAll("section[id]")];
const links = document.querySelectorAll(".navbar a");

const observer = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id));
    const current = sections.map(s => s.id).filter(id => visible.has(id)).pop();
    links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + current));
}, { rootMargin: "-45% 0px -54% 0px" });
sections.forEach(s => observer.observe(s));

// ===== CONTACT FORM =====
const form = document.getElementById("contact-form");
const sendBtn = document.getElementById("send-btn");
const statusEl = document.getElementById("form-status");
const scriptURL = "https://script.google.com/macros/s/AKfycbzZe_yCHT3GGXZ3Pcxhsz_RsZTQ7Ka-hnhQbCyjKmMbwKPu69olsafOxz0IwlQE2IrL/exec";

function showStatus(text, type) { statusEl.textContent = text; statusEl.className = type; }

form.addEventListener("submit", async e => {
    e.preventDefault();
    const fd = new FormData(form);
    if (fd.get("website")) return; // honeypot: bots fill it, people don't

    sendBtn.disabled = true;
    showStatus("Sending...", "");
    try {
        const res = await fetch(scriptURL, {
            method: "POST",
            body: JSON.stringify({ name: fd.get("name"), email: fd.get("email"), message: fd.get("message") })
        });
        const result = await res.json();
        if (result.success) {
            showStatus("Thank you! Your message has been sent.", "ok");
            form.reset();
        } else {
            showStatus("Your message could not be saved. Please try again or email me directly.", "err");
        }
    } catch (err) {
        console.error("Contact form error:", err);
        showStatus("Something went wrong. Please try again or email me directly.", "err");
    } finally {
        sendBtn.disabled = false;
    }
});

// ===== LATEST GITHUB REPOS =====
// Shows nothing if the request fails, so the static projects above always stand on their own.
fetch("https://api.github.com/users/Abenezer318/repos?sort=pushed&per_page=10")
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(list => {
        const repos = list.filter(r => !r.fork).slice(0, 5);
        if (!repos.length) return;
        const ul = document.getElementById("repos");

        repos.forEach(r => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = r.html_url;
            a.rel = "noopener";
            a.textContent = r.name;

            const meta = document.createElement("span");
            meta.className = "meta";
            const bits = [r.language, "Updated " + new Date(r.pushed_at).toLocaleDateString("en", { month: "short", year: "numeric" })];
            bits.filter(Boolean).forEach(t => {
                const s = document.createElement("span");
                s.textContent = t;
                meta.appendChild(s);
            });

            li.append(a, meta);
            if (r.description) {
                const p = document.createElement("p");
                p.textContent = r.description;
                li.appendChild(p);
            }
            ul.appendChild(li);
        });
        document.getElementById("live").hidden = false;
    })
    .catch(() => {});
