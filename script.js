const CLOUD_NAME = 'dki455vp';
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/`;

let translations = {};
let currentLang = 'en';

document.addEventListener('DOMContentLoaded', () => {
    Promise.all([
        fetch('translations.json').then(r => r.json()),
        fetch('data.json').then(r => r.json())
    ]).then(([langData, galleryData]) => {
        translations = langData;
        const browserLang = navigator.language.split('-')[0];
        if (translations[browserLang]) currentLang = browserLang;
        document.getElementById('lang-select').value = currentLang;
        initGallery(galleryData);
        updateUI();
    });

    document.getElementById('lang-select').addEventListener('change', (e) => {
        currentLang = e.target.value;
        updateUI();
    });
});

function updateUI() {
    const t = translations[currentLang];
    document.getElementById('site-title').innerText = t.site_name;
    document.getElementById('footer-copy').innerHTML = `&copy; ${new Date().getFullYear()} ${t.site_name}. ${t.footer_all_rights}`;

    document.querySelectorAll('[data-t]').forEach(el => {
        const key = el.getAttribute('data-t');
        if (t[key]) el.innerText = t[key];
    });

    document.getElementById('bio-content').innerHTML = t.bio.map(item => `<p class="text mb-3">${item}</p>`).join('');
    document.getElementById('solo-list').innerHTML = t.solo_exhibitions.map(item => `<div class="mb-2 border-bottom pb-1 small">${item}</div>`).join('');
    document.getElementById('major-list').innerHTML = t.major_exhibitions.map(item => `<div class="mb-2 border-bottom pb-1 small">${item}</div>`).join('');

    document.getElementById('awards-list').innerHTML = t.awards.map(a => `
        <div class="col-md-4">
            <h2 class="title">${a.year}</h2>
            <span class="text">${a.text}</span>
        </div>`).join('');

    document.getElementById('located-list').innerHTML = t.located.map(item => `<div class="col-md-6 mb-2 small">${item}</div>`).join('');
}

function initGallery(data) {
    const pGrid = document.getElementById('paintings-grid');
    const sGrid = document.getElementById('sculptures-grid');
    const cCont = document.getElementById('carousel-items-container');

    const paintings = data.paintings.map(item => ({ ...item, folder: 'paintings' }));
    const sculptures = data.sculptures.map(item => ({ ...item, folder: 'sculptures' }));
    const all = [...paintings, ...sculptures];

    const render = (items, container, offset) => {
        items.forEach((item, i) => {
            const idx = offset + i;
            const div = document.createElement('div');
            div.className = 'col-item';
            div.innerHTML = `
                <div class="cursor-pointer" data-bs-toggle="modal" data-bs-target="#galleryModal" data-bs-slide-to="${idx}">
                    <img src="${BASE_URL}w_600,c_limit/${item.id}.jpg" class="img-fluid rounded-4 object-fit-cover shadow-sm">
                </div>`;
            div.onclick = () => bootstrap.Carousel.getOrCreateInstance(document.getElementById('carouselGallery')).to(idx);
            container.appendChild(div);
        });
    };

    render(paintings, pGrid, 0);
    render(sculptures, sGrid, paintings.length);

    all.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = `carousel-item h-100 ${i === 0 ? 'active' : ''}`;
        div.innerHTML = `
            <div class="d-flex flex-column justify-content-center align-items-center h-100 w-100 px-3">
                <img src="${BASE_URL}${item.id}.jpg" class="img-lightbox" alt="${item.title}">
                <div class="text-center mt-3 text-white" style="max-width: 800px;">
                    <h5 class="fw-bold m-0">${item.title}</h5>
                    ${item.comment ? `<p class="small mt-2 opacity-75">${item.comment}</p>` : ''}
                </div>
            </div>`;
        cCont.appendChild(div);
    });
}
