const API_KEY = 'oa_pk_ZTbqfslalCICKbURcTiHrTpEppAlaLGjKppKuvtQgASUyNUJVGSQstKrFDWeAJbl';
const AGENDA = '21769447';

const loadingState = document.getElementById('loading-state');
const eventContent = document.getElementById('event-content');
const errorState = document.getElementById('error-state');

const params = new URLSearchParams(window.location.search);
const eventId = params.get('id');

loadEvent();

async function loadEvent() {
    if (!eventId) { showError(); return; }

    try {
        const url = `https://api.openagenda.com/v2/agendas/${AGENDA}/events?key=${API_KEY}&uid[]=${eventId}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);

        const data = await res.json();
        const event = data.events?.[0];
        if (!event) throw new Error('Événement introuvable');

        renderEvent(event);

    } catch (err) {
        console.error('Erreur :', err);
        showError();
    }
}

function renderEvent(event) {
    const title = event.title?.fr || event.title?.en || 'Sans titre';
    const description = event.description?.fr || event.description?.en || '';
    const imageUrl = (event.image?.base && event.image?.filename)
        ? event.image.base + event.image.filename : '';
    const location = event.location?.name || '';
    const city = event.location?.city || '';
    const locationStr = city ? `${location}, ${city}` : location;
    const timing = event.timings?.[0];
    const dateStr = timing ? formatDateRange(timing.begin, timing.end) : '';
    const isFree = !event.registration || event.registration.length === 0;
    const price = isFree ? 'Gratuit' : (event.registration?.[0]?.description || 'Payant');
    const ctaUrl = event.registration?.[0]?.url || null;

    document.title = `${title} – VillaNova`;

    const img = document.getElementById('detail-img');
    if (imageUrl) {
        img.src = imageUrl;
        img.alt = title;
    } else {
        img.closest('.detail-img-wrapper').style.display = 'none';
    }

    document.getElementById('detail-category').textContent = 'Événement';
    document.getElementById('detail-title').textContent = title;
    document.getElementById('detail-date').textContent = dateStr;
    document.getElementById('detail-location').textContent = locationStr;
    document.getElementById('detail-price').textContent = price;
    document.getElementById('detail-description').textContent = description;

    const cta = document.getElementById('detail-cta');
    if (ctaUrl) {
        cta.href = ctaUrl;
    } else {
        cta.style.display = 'none';
    }

    loadingState.hidden = true;
    eventContent.hidden = false;

    const titleEl = document.getElementById('detail-title');
    titleEl.setAttribute('tabindex', '-1');
    titleEl.focus();
}

function showError() {
    loadingState.hidden = true;
    errorState.hidden = false;
}

function formatDateRange(begin, end) {
    if (!begin) return '';
    const opts = { day: 'numeric', month: 'long', year: 'numeric' };
    const dBegin = new Date(begin).toLocaleDateString('fr-FR', opts);
    if (!end) return dBegin;
    const dEnd = new Date(end).toLocaleDateString('fr-FR', opts);
    return dBegin === dEnd ? dBegin : `Du ${dBegin} au ${dEnd}`;
}