const API_KEY = 'oa_pk_ZTbqfslalCICKbURcTiHrTpEppAlaLGjKppKuvtQgASUyNUJVGSQstKrFDWeAJbl';
const AGENDA = '21769447';
const BASE_URL = `https://api.openagenda.com/v2/agendas/${AGENDA}/events`;
const LIMIT = 12;

let currentPage = 1;
let currentCategory = '';
let totalEvents = 0;

document.addEventListener('DOMContentLoaded', () => {
    loadEvents(1, '');
    initFilters();
});

async function loadEvents(page, category) {
    currentPage = page;
    currentCategory = category;

    const container = document.getElementById('events-container');
    if (!container) return;

    container.innerHTML = '<p class="loading-msg">Chargement des événements...</p>';

    try {
        let url = `${BASE_URL}?key=${API_KEY}&limit=${LIMIT}&relative[0]=current&relative[1]=upcoming`;

        if (page > 1) url += `&offset=${(page - 1) * LIMIT}`;
        if (category && category !== 'Tous' && category !== 'Gratuit') {
            url += `&search=${encodeURIComponent(category)}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);

        const data = await res.json();
        totalEvents = data.total || 0;

        let events = data.events || [];

        if (category === 'Gratuit') {
            events = events.filter(e => !e.registration || e.registration.length === 0);
        }

        if (events.length === 0) {
            container.innerHTML = '<p class="empty-msg">Aucun événement trouvé.</p>';
            renderPagination(0);
            return;
        }

        container.innerHTML = '';
        events.forEach(event => container.appendChild(createEventCard(event)));

        renderPagination(totalEvents);

        container.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (err) {
        console.error('Erreur API OpenAgenda :', err);
        container.innerHTML = `<p class="error-msg">Impossible de charger les événements. (${err.message})</p>`;
    }
}

function renderPagination(total) {
    const nav = document.getElementById('pagination');
    if (!nav) return;

    const totalPages = Math.ceil(total / LIMIT);
    if (totalPages <= 1) {
        nav.innerHTML = '';
        return;
    }

    nav.innerHTML = '';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.type = 'button';
    prevBtn.textContent = '←';
    prevBtn.setAttribute('aria-label', 'Page précédente');
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => loadEvents(currentPage - 1, currentCategory));
    nav.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        // Afficher : première page, dernière, et les 2 autour de la page courante
        const isNearCurrent = Math.abs(i - currentPage) <= 1;
        const isFirstOrLast = i === 1 || i === totalPages;

        if (!isNearCurrent && !isFirstOrLast) {
            // Afficher "..." si on saute des pages
            if (i === 2 || i === totalPages - 1) {
                const dots = document.createElement('span');
                dots.textContent = '…';
                dots.className = 'page-dots';
                nav.appendChild(dots);
            }
            continue;
        }

        const btn = document.createElement('button');
        btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
        btn.type = 'button';
        btn.textContent = i;
        btn.setAttribute('aria-label', `Page ${i}`);
        if (i === currentPage) btn.setAttribute('aria-current', 'page');
        btn.addEventListener('click', () => loadEvents(i, currentCategory));
        nav.appendChild(btn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.type = 'button';
    nextBtn.textContent = '→';
    nextBtn.setAttribute('aria-label', 'Page suivante');
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => loadEvents(currentPage + 1, currentCategory));
    nav.appendChild(nextBtn);
}

function createEventCard(event) {
    const article = document.createElement('article');
    article.className = 'event-card';

    const title = event.title?.fr || event.title?.en || 'Sans titre';
    const imageUrl = (event.image?.base && event.image?.filename)
        ? event.image.base + event.image.filename
        : '';
    const location = event.location?.name || '';
    const timing = event.timings?.[0];
    const dateStr = timing ? formatDate(timing.begin) : '';
    const isFree = !event.registration || event.registration.length === 0;
    const price = isFree ? 'Gratuit' : 'Payant';

    article.innerHTML = `
        <div class="event-img-wrapper">
            ${imageUrl
            ? `<img src="${imageUrl}" alt="${escapeHTML(title)}" loading="lazy">`
            : `<div class="event-img-placeholder"></div>`
        }
            <span class="event-badge ${isFree ? 'free' : 'paid'}">${price}</span>
        </div>
        <div class="event-info">
            <h3 class="event-title">${escapeHTML(title)}</h3>
            ${dateStr ? `<p class="event-meta"><span class="meta-label">Date :</span> ${dateStr}</p>` : ''}
            ${location ? `<p class="event-meta"><span class="meta-label">Lieu :</span> ${escapeHTML(location)}</p>` : ''}
            <a href="event_detail.html?id=${event.uid}" class="btn-card">Voir les détails</a>
        </div>
    `;

    return article;
}

function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            loadEvents(1, btn.textContent.trim());
        });
    });
}

function formatDate(isoString) {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}