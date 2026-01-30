// ===========================
// GOOGLE SHEETS CMS
// ===========================

const CONTENT_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRioQp-dXNgMX3Jyy9ueZih_w7hX5g6jUQsMw7FiRY8jv-39eeFSDBsZ9njc-xdeMnLLMixyCyzcp3N/pub?gid=0&single=true&output=csv';
const BUTTONS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRioQp-dXNgMX3Jyy9ueZih_w7hX5g6jUQsMw7FiRY8jv-39eeFSDBsZ9njc-xdeMnLLMixyCyzcp3N/pub?gid=400009190&single=true&output=csv';
const SECTIONS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRioQp-dXNgMX3Jyy9ueZih_w7hX5g6jUQsMw7FiRY8jv-39eeFSDBsZ9njc-xdeMnLLMixyCyzcp3N/pub?gid=480137662&single=true&output=csv';

// ===========================
// CSV PARSER
// ===========================
function parseCSV(text) {
    const rows = text.trim().split('\n');
    const data = {};
    rows.slice(1).forEach(row => {
        const [key, value] = row.split(',');
        if (key) data[key.trim()] = value?.trim() || '';
    });
    return data;
}

// ===========================
// LOAD CONTENT
// ===========================
async function loadContent() {
    const res = await fetch(CONTENT_URL);
    const text = await res.text();
    const data = parseCSV(text);

    Object.keys(data).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = data[id];
    });
}

// ===========================
// LOAD BUTTONS
// ===========================
async function loadButtons() {
    const res = await fetch(BUTTONS_URL);
    const text = await res.text();
    const rows = text.trim().split('\n').slice(1);

    rows.forEach(row => {
        const [id, label, url] = row.split(',');
        const btn = document.getElementById(`btn_${id}`);
        if (!btn) return;

        btn.textContent = label;

        if (url === 'top') {
            btn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        } else {
            btn.href = url;
        }
    });
}

// ===========================
// LOAD SECTIONS
// ===========================
async function loadSections() {
    const res = await fetch(SECTIONS_URL);
    const text = await res.text();
    const rows = text.trim().split('\n').slice(1);

    rows.forEach(row => {
        const [id, visible] = row.split(',');
        const section = document.getElementById(id);
        if (!section) return;

        if (visible.trim().toUpperCase() === 'FALSE') {
            section.style.display = 'none';
        }
    });
}

// ===========================
// INIT
// ===========================
async function initCMS() {
    await loadContent();
    await loadButtons();
    await loadSections();
}

document.addEventListener('DOMContentLoaded', initCMS);
