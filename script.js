// Configure GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// --- Configuration & Assets --- //
const config = {
    canvasWidth: 1920,
    canvasHeight: 1080,
    sections: {
        one: {
            frameCount: 122, // 0 to 121
            path: 'Media/Section One/Scene 1_Cloud Entry  Cinematic Intro_',
            padding: 5
        },
        two: {
            frameCount: 122, // 0 to 121
            path: 'Media/Section One/Scene 2_Drone Descent  Reveal from Sky_',
            padding: 5
        },
        section2Base: 'Media/Section Two/Scene 2.2_Select Building.png',
        section2Hover: {
            left: 'Media/Section Two/Scene 2.2_Select Building_Showroom on Hover.png',
            center: 'Media/Section Two/Scene 2.2_Select Building_tower on Hover.png',
            right: 'Media/Section Two/Scene 2.2_Select Building_Manufaturing Unit on Hover.png'
        },
        section3: {
            frameCount: 355,
            path: 'Media/Section Two Click on Left most building B/Scene 3.2 Factoy enter_',
            padding: 5
        },
        section4Hover: [
            'Media/Services Hover from Building Left/1. Hover on Healthcare.png',
            'Media/Services Hover from Building Left/2. Hover on Real Estate.png',
            'Media/Services Hover from Building Left/3. Hover on Hospitality.png',
            'Media/Services Hover from Building Left/4. Hover on Tech.png',
            'Media/Services Hover from Building Left/5. Hover on Public Sector.png',
            'Media/Services Hover from Building Left/6. Hover on Finance.png',
            'Media/Services Hover from Building Left/7. Hover on Retail.png',
            'Media/Services Hover from Building Left/8. Hover on Education.png',
            'Media/Services Hover from Building Left/9. Hover on More.png'
        ]
    }
};

const images = []; // Scroll sequence
const section2Images = {}; // Section 2
const section3Images = []; // Section 3 Entry
const section4Images = []; // Section 4 Service Hovers

let currentFrame = { frame: 0 };
// Calculate total frames exactly
let totalFramesToLoad = config.sections.one.frameCount + 
                        config.sections.two.frameCount + 
                        4 + // s2 base + 3 hovers
                        config.sections.section3.frameCount + 
                        config.sections.section4Hover.length; 
let loadedFrames = 0;
let isScrollComplete = false;

// --- Elements --- //
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d', { alpha: false }); 
const progressBar = document.getElementById('progress-bar');
const loadingText = document.getElementById('loading-text');
const loadingScreen = document.getElementById('loading-screen');
const section2Hitboxes = document.getElementById('section-2-hitboxes');
const section4Services = document.getElementById('section-4-services');

// --- Initialization & Sizing --- //
function initCanvas() {
    canvas.width = config.canvasWidth;
    canvas.height = config.canvasHeight;
}

// --- Preloader Logic --- //
function pad(num, size) {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

function handleImageLoad() {
    loadedFrames++;
    const progress = Math.floor((loadedFrames / totalFramesToLoad) * 100);
    progressBar.style.width = `${progress}%`;
    loadingText.innerText = `Loading Experience ${progress}%`;

    if (loadedFrames === totalFramesToLoad) {
        onLoadingComplete();
    }
}

function preloadImages() {
    initCanvas();

    // Scene 1
    for (let i = 0; i < config.sections.one.frameCount; i++) {
        const img = new Image();
        img.src = `${config.sections.one.path}${pad(i, config.sections.one.padding)}.png`;
        images.push(img);
        img.onload = handleImageLoad;
        img.onerror = handleImageLoad;
    }

    // Scene 2
    for (let i = 0; i < config.sections.two.frameCount; i++) {
        const img = new Image();
        img.src = `${config.sections.two.path}${pad(i, config.sections.two.padding)}.png`;
        images.push(img);
        img.onload = handleImageLoad;
        img.onerror = handleImageLoad;
    }

    // Section 2
    const s2base = new Image();
    s2base.src = config.sections.section2Base;
    section2Images.base = s2base;
    s2base.onload = handleImageLoad;
    s2base.onerror = handleImageLoad;

    for (const key in config.sections.section2Hover) {
        const img = new Image();
        img.src = config.sections.section2Hover[key];
        section2Images[key] = img;
        img.onload = handleImageLoad;
        img.onerror = handleImageLoad;
    }

    // Scene 3 Entry
    for (let i = 0; i < config.sections.section3.frameCount; i++) {
        const img = new Image();
        img.src = `${config.sections.section3.path}${pad(i, config.sections.section3.padding)}.jpg`;
        section3Images.push(img);
        img.onload = handleImageLoad;
        img.onerror = handleImageLoad;
    }

    // Section 4 Service Hovers
    config.sections.section4Hover.forEach(src => {
        const img = new Image();
        img.src = src;
        section4Images.push(img);
        img.onload = handleImageLoad;
        img.onerror = handleImageLoad;
    });
}

function onLoadingComplete() {
    // Fade out loading screen
    loadingScreen.style.opacity = 0;
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.style.overflowY = 'auto'; // Re-enable scrolling
        canvas.style.opacity = 1;
        
        // Initial Draw
        renderFrame();
        
        // Setup Scroll Animations
        setupScrollAnimation();
        
        // Setup Section 2 Interactions
        setupSection2Interactions();
    }, 1000);
}

// --- Rendering Logic --- //
function renderFrame() {
    if (isScrollComplete) return; 

    const frameIndex = Math.round(currentFrame.frame);
    if (images[frameIndex]) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
    }
}

function drawStaticFrame(imgObj) {
    if (imgObj && imgObj.complete) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imgObj, 0, 0, canvas.width, canvas.height);
    }
}

// --- Scroll Animation Setup --- //
function setupScrollAnimation() {
    const totalScrollFrames = config.sections.one.frameCount + config.sections.two.frameCount - 1;

    gsap.to(currentFrame, {
        frame: totalScrollFrames,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
            trigger: "#scroll-spacer",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            onUpdate: (self) => {
                if (self.progress === 1) {
                    if (!isScrollComplete) {
                        isScrollComplete = true;
                        section2Hitboxes.classList.remove('hidden');
                        drawStaticFrame(section2Images.base);
                    }
                } else {
                    if (isScrollComplete) {
                        isScrollComplete = false;
                        section2Hitboxes.classList.add('hidden');
                    }
                    renderFrame();
                }
            }
        }
    });
}

// --- Section 2 Hover & Click Logic --- //
function setupSection2Interactions() {
    const hitboxes = document.querySelectorAll('#section-2-hitboxes .hitbox');

    hitboxes.forEach(hitbox => {
        hitbox.addEventListener('mouseenter', (e) => {
            if (!isScrollComplete) return;
            const target = e.target.getAttribute('data-target');
            drawStaticFrame(section2Images[target]);
        });

        hitbox.addEventListener('mouseleave', () => {
            if (!isScrollComplete) return;
            drawStaticFrame(section2Images.base);
        });

        hitbox.addEventListener('click', (e) => {
            if (!isScrollComplete) return;
            const target = e.target.getAttribute('data-target');
            if (target === 'left') {
                startSection3Entry();
            }
        });
    });
}

// --- Section 3 Entry Logic & Scroll Reversal --- //
let section3Obj = { frame: 0 };
let section3Tween = null;

function startSection3Entry() {
    section2Hitboxes.classList.add('hidden');
    
    // Disable main scroll interaction
    document.getElementById('scroll-spacer').style.display = 'none';
    document.body.style.overflowY = 'hidden'; 
    window.scrollTo(0, 0); 

    // Reset frame if starting fresh
    section3Obj.frame = 0;

    section3Tween = gsap.to(section3Obj, {
        frame: config.sections.section3.frameCount - 1,
        snap: "frame",
        duration: 6.5, // Smoother 6.5s entry (approx 60fps)
        ease: "power2.inOut",
        onUpdate: () => {
            drawStaticFrame(section3Images[section3Obj.frame]);
        },
        onComplete: () => {
            setupSection4UI();
        },
        onReverseComplete: () => {
            // Reached the beginning, back to Section 2
            section2Hitboxes.classList.remove('hidden');
            drawStaticFrame(section2Images.base);
            
            // Re-enable main scroll
            document.getElementById('scroll-spacer').style.display = 'block';
            document.body.style.overflowY = 'auto';
            disableSection3Wheel();
        }
    });

    enableSection3Wheel();
}

function handleSection3Wheel(e) {
    // If the healthcare viewer is open, don't reverse the sequence
    if (healthcareUiContainer && !healthcareUiContainer.classList.contains('hidden')) return;

    if (e.deltaY < 0) {
        // Scrolling up -> reverse the sequence
        section4Services.classList.add('hidden'); // Hide services UI
        if (section3Tween) section3Tween.reverse();
    } else if (e.deltaY > 0) {
        // Scrolling down -> play sequence forward again if it was reversing
        if (section3Tween && section3Tween.reversed()) {
            section3Tween.play();
        }
    }
}

function enableSection3Wheel() {
    window.addEventListener('wheel', handleSection3Wheel, { passive: true });
}

function disableSection3Wheel() {
    window.removeEventListener('wheel', handleSection3Wheel);
}

// --- Section 4 Services Logic --- //
function setupSection4UI() {
    // Show the interactive hitboxes for the 9 services
    section4Services.classList.remove('hidden');
    
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            const index = parseInt(e.target.getAttribute('data-index')) - 1;
            if (section4Images[index]) {
                drawStaticFrame(section4Images[index]);
            }
        });
        
        card.addEventListener('mouseleave', () => {
            // Restore to the last frame of Section 3
            drawStaticFrame(section3Images[config.sections.section3.frameCount - 1]);
        });
        
        card.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            if (index === 1) { // Healthcare
                showHealthcareDetails();
            }
        });
    });
}

// --- Section 5 & 6 Healthcare UI Flow Logic --- //
const healthcareUiContainer = document.getElementById('healthcare-ui-container');
const screenLanding = document.getElementById('screen-landing');
const screenClinical = document.getElementById('screen-clinical');
const screenDeepDive = document.getElementById('screen-deep-dive');

const backToShowroomBtns = document.querySelectorAll('.back-btn');
const btnPrevLanding = document.getElementById('btn-prev-landing');

function hideAllScreens() {
    if (screenLanding) screenLanding.classList.add('hidden');
    if (screenClinical) screenClinical.classList.add('hidden');
    if (screenDeepDive) screenDeepDive.classList.add('hidden');
    const placeholders = ['screen-data-models', 'screen-frameworks', 'screen-best-practices', 'screen-healthcare-frameworks'];
    placeholders.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
}

const useCaseData = [
    { id: 'uc-1', title: 'Automated Patient Intake', desc: 'Extract data from referral forms and IDs.', domain: 'hospital', tech: 'computer-vision', project: 'production', impact: '60% Faster Processing', image: 'Media/Card Images/Card Image 1.jpg' },
    { id: 'uc-2', title: 'Medical Coding Automation', desc: 'Suggest billing codes based on unstructured physician notes.', domain: 'clinic', tech: 'nlp', project: 'production', impact: '99% Accuracy', image: 'Media/Card Images/Card Image 2.jpg' },
    { id: 'uc-3', title: 'Care Gap Analysis', desc: 'Identify missing documentation to improve patient outcomes.', domain: 'hospital', tech: 'predictive-ml', project: 'mvp', impact: '20% Risk Reduction', image: 'Media/Card Images/Card Image 3.jpg' },
    { id: 'uc-4', title: 'Audit Trail Generation', desc: 'Maintain compliance by generating automated audit logs.', domain: 'insurance', tech: 'generative-ai', project: 'poc', impact: '100% Compliance', image: 'Media/Card Images/Card Image 4.jpg' },
    { id: 'uc-5', title: 'Readmission Prediction', desc: 'Identify high-risk patients before discharge.', domain: 'hospital', tech: 'predictive-ml', project: 'production', impact: '30% Less Readmits', image: 'Media/Card Images/Card Image 5.jpg' },
    { id: 'uc-6', title: 'Resource Allocation', desc: 'Predict staffing and bed needs based on patient influx.', domain: 'clinic', tech: 'predictive-ml', project: 'mvp', impact: 'Optimized Staffing', image: 'Media/Card Images/Card Image 1.jpg' },
    { id: 'uc-7', title: 'Denial Prevention', desc: 'Predict and prevent insurance claim denials.', domain: 'insurance', tech: 'predictive-ml', project: 'production', impact: '40% Fewer Denials', image: 'Media/Card Images/Card Image 2.jpg' },
    { id: 'uc-8', title: '24/7 Appointment Scheduling', desc: 'Automated booking and rescheduling for patients.', domain: 'clinic', tech: 'generative-ai', project: 'production', impact: '24/7 Availability', image: 'Media/Card Images/Card Image 3.jpg' },
    { id: 'uc-9', title: 'Symptom Checker', desc: 'AI-driven initial symptom assessment and triage.', domain: 'pharmacy', tech: 'nlp', project: 'mvp', impact: 'Faster Triage', image: 'Media/Card Images/Card Image 4.jpg' },
    { id: 'uc-10', title: 'Billing Explanations', desc: 'Help patients understand their bills via chat.', domain: 'hospital', tech: 'generative-ai', project: 'poc', impact: 'Higher Satisfaction', image: 'Media/Card Images/Card Image 5.jpg' },
    { id: 'uc-11', title: 'Automated Screening', desc: 'Highlight potential anomalies in X-rays and MRIs.', domain: 'hospital', tech: 'computer-vision', project: 'production', impact: 'Faster Diagnosis', image: 'Media/Card Images/Card Image 1.jpg' },
    { id: 'uc-12', title: 'Scan Prioritization', desc: 'Route urgent scans to top of radiologist queue.', domain: 'clinic', tech: 'predictive-ml', project: 'production', impact: 'Priority Routing', image: 'Media/Card Images/Card Image 2.jpg' },
    { id: 'uc-13', title: 'Claim Scrubbing', desc: 'Automatically validate claims against payer rules before submission.', domain: 'insurance', tech: 'nlp', project: 'production', impact: 'Zero Errors', image: 'Media/Card Images/Card Image 3.jpg' },
    { id: 'uc-14', title: 'Prior Authorization', desc: 'Automate prior authorization requests from EHR data.', domain: 'hospital', tech: 'generative-ai', project: 'mvp', impact: 'Instant Approvals', image: 'Media/Card Images/Card Image 4.jpg' },
    { id: 'uc-15', title: 'Genomic Profiling', desc: 'Match patient profiles to targeted therapies.', domain: 'pharmacy', tech: 'predictive-ml', project: 'poc', impact: 'Targeted Therapy', image: 'Media/Card Images/Card Image 5.jpg' }
];

let currentPage = 1;
const itemsPerPage = 10;

function goBackOneScreen() {
    if (screenDeepDive && !screenDeepDive.classList.contains('hidden')) {
        hideAllScreens();
        if (screenLanding) screenLanding.classList.remove('hidden');
    } else {
        const p1 = document.getElementById('screen-data-models');
        const p2 = document.getElementById('screen-frameworks');
        if ((p1 && !p1.classList.contains('hidden')) || 
            (p2 && !p2.classList.contains('hidden'))) {
            hideAllScreens();
            if (screenLanding) screenLanding.classList.remove('hidden');
        } else {
            goToHome();
        }
    }
}

function openScreen(screenId) {
    hideAllScreens();
    const screen = document.getElementById(screenId);
    if(screen) {
        screen.classList.remove('hidden');
        window.scrollTo(0, 0);
    }
}

function showHealthcareDetails() {
    hideAllScreens();
    if (screenLanding) screenLanding.classList.remove('hidden');
    
    // Show container and hide main app
    if (healthcareUiContainer) healthcareUiContainer.classList.remove('hidden');
    const mainContainer = document.getElementById('main-container');
    if (mainContainer) mainContainer.classList.add('hidden');
    document.body.style.overflowY = 'hidden'; 
    window.scrollTo(0, 0);
    
    // Render capabilities on open
    currentPage = 1;
    renderUseCases();
}

// Remove old openClinicalScreen and setup Filters
function renderUseCases() {
    const grid = document.getElementById('capabilities-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    const usecaseFilter = document.getElementById('filter-usecase')?.value || 'all';
    const techFilter = document.getElementById('filter-tech')?.value || 'all';
    const domainFilter = document.getElementById('filter-domain')?.value || 'all';
    const projectFilter = document.getElementById('filter-project')?.value || 'all';
    const searchQuery = document.getElementById('search-cards')?.value.toLowerCase() || '';

    let filteredData = useCaseData.filter(uc => {
        if (techFilter !== 'all' && uc.tech !== techFilter) return false;
        if (domainFilter !== 'all' && uc.domain !== domainFilter) return false;
        if (projectFilter !== 'all' && uc.project !== projectFilter) return false;
        if (searchQuery && !uc.title.toLowerCase().includes(searchQuery) && !uc.desc.toLowerCase().includes(searchQuery)) return false;
        // Mock usecase filter logic since we didn't tag exactly 'patient-intake', 'clinical-ops' etc in the new mock. 
        // We'll just ignore usecaseFilter for this mock data unless we added it.
        return true;
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    paginatedData.forEach(uc => {
        const card = document.createElement('div');
        card.className = 'use-case-card highlight-card';
        card.style.position = 'relative';
        
        card.innerHTML = `
            <div class="card-img" style="background-image: url('${uc.image}');">
                <div class="card-glass-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 20V10M18 20V4M6 20v-4"/>
                    </svg>
                </div>
            </div>
            <div class="card-content">
                <h3>${uc.title}</h3>
                <p>${uc.desc}</p>
                <div class="card-tags">
                    <span class="tag-pill domain">${uc.domain.toUpperCase()}</span>
                    <span class="tag-pill tech">${uc.tech.replace('-', ' ').toUpperCase()}</span>
                </div>
                
                <div class="card-footer-impact">
                    <div class="impact-stats">
                        <span class="impact-title">Business Impact</span>
                        <span class="impact-value" style="font-size:1.1rem; color:#fff;">${uc.impact}</span>
                    </div>
                </div>
                
                <div class="card-actions">
                    <button class="btn-demo" onclick="event.stopPropagation(); openDeepDiveScreen('${uc.id}')">Demo</button>
                    <button class="btn-proto" onclick="event.stopPropagation(); openDeepDiveScreen('${uc.id}')">View Prototype</button>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => openDeepDiveScreen(uc.id));
        grid.appendChild(card);
    });
    
    if (paginatedData.length === 0) {
        grid.innerHTML = '<p style="color:#aaa; grid-column:1/-1; text-align:left; padding: 40px 0; font-size:1.1rem;">No use cases found matching your criteria.</p>';
    }

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const pageNumbers = document.getElementById('page-numbers');
    const btnPrev = document.getElementById('page-prev');
    const btnNext = document.getElementById('page-next');
    if(!pageNumbers) return;

    pageNumbers.innerHTML = '';
    btnPrev.disabled = (currentPage === 1);
    btnNext.disabled = (currentPage === totalPages || totalPages === 0);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = 'page-num' + (i === currentPage ? ' active' : '');
        btn.innerText = i;
        btn.addEventListener('click', () => {
            currentPage = i;
            renderUseCases();
        });
        pageNumbers.appendChild(btn);
    }
}

// Attach filter listeners
['filter-usecase', 'filter-tech', 'filter-domain', 'filter-project', 'search-cards'].forEach(id => {
    const el = document.getElementById(id);
    if(el) {
        el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => {
            currentPage = 1;
            renderUseCases();
        });
    }
});

const clearBtn = document.getElementById('clear-filters');
if(clearBtn) {
    clearBtn.addEventListener('click', () => {
        document.getElementById('filter-usecase').value = 'all';
        document.getElementById('filter-tech').value = 'all';
        document.getElementById('filter-domain').value = 'all';
        document.getElementById('filter-project').value = 'all';
        document.getElementById('search-cards').value = '';
        currentPage = 1;
        renderUseCases();
    });
}
const btnPrevPage = document.getElementById('page-prev');
if(btnPrevPage) btnPrevPage.addEventListener('click', () => { if(currentPage > 1) { currentPage--; renderUseCases(); }});
const btnNextPage = document.getElementById('page-next');
if(btnNextPage) btnNextPage.addEventListener('click', () => { currentPage++; renderUseCases(); });


function openDeepDiveScreen(ucId) {
    hideAllScreens();
    if (screenDeepDive) {
        screenDeepDive.classList.remove('hidden');
        window.scrollTo(0, 0);
    }
    
    // We navigate to Automated Patient Intake by default as requested.
    // Breadcrumbs update
    const bcUsecaseName = document.getElementById('bc-usecase-name');
    if (bcUsecaseName) bcUsecaseName.innerText = 'Automated Patient Intake';
    
    // Set tabs back to overview
    const tabs = document.querySelectorAll('.dd-tab');
    const panes = document.querySelectorAll('.tab-pane');
    tabs.forEach(t => t.classList.remove('active'));
    panes.forEach(p => p.classList.add('hidden'));
    
    if(tabs.length > 0) tabs[0].classList.add('active');
    const overview = document.getElementById('tab-overview');
    if(overview) overview.classList.remove('hidden');
    
    // Initialize image library carousel if not done
    initImageLibraryCarousel();
}

// Carousel logic for image library
let libraryIndex = 0;
function initImageLibraryCarousel() {
    // Basic implementation since it's a grid in the new HTML, but just in case we kept the carousel class
}

function openLightbox(src, type) {
    zoomLightbox(0);
    const modal = document.getElementById('lightbox-modal');
    const content = document.getElementById('lightbox-content');
    if (!modal || !content) return;
    
    content.innerHTML = '';
    if (type === 'video') {
        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        content.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.src = src;
        content.appendChild(img);
    }
    
    modal.classList.remove('hidden');
}

function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const content = document.getElementById('lightbox-content');
    if (modal) modal.classList.add('hidden');
    if (content) content.innerHTML = '';
}

function updateFeaturedImage(element, src, type) {
    // Update active state
    document.querySelectorAll('.library-thumbnail').forEach(t => t.classList.remove('active-thumb'));
    if(element) element.classList.add('active-thumb');
    
    // Update main image display
    const featuredContainer = document.getElementById('featured-image-container');
    if(!featuredContainer) return;
    
    // Apply fade out animation
    featuredContainer.classList.add('fade-anim');
    
    setTimeout(() => {
        if (type === 'video') {
            featuredContainer.innerHTML = `
                <video id="featured-image" src="${src}" autoplay muted loop style="width:100%; height:100%; object-fit:cover; border-radius:12px;"></video>
                <div class="hover-overlay"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg></div>
            `;
            featuredContainer.onclick = () => openLightbox(src, 'video');
        } else {
            featuredContainer.innerHTML = `
                <img id="featured-image" src="${src}" alt="Featured Image" style="width:100%; height:100%; object-fit:cover; border-radius:12px;">
                <div class="hover-overlay"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg></div>
            `;
            featuredContainer.onclick = () => openLightbox(src, 'image');
        }
        
        // Remove fade out to trigger fade in
        setTimeout(() => {
            featuredContainer.classList.remove('fade-anim');
        }, 50);
    }, 300); // 300ms matches a quick fade out duration
}

function scrollGallery(direction) {
    const track = document.getElementById('thumbnail-scroll-track');
    if(track) {
        // Scroll by 2 thumbnail widths approx (140px + gap) * 2 = 300px
        track.scrollBy({ left: direction * 300, behavior: 'smooth' });
    }
}

// Lightbox Escape Key Listener
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('lightbox-modal');
        if (modal && !modal.classList.contains('hidden')) {
            closeLightbox();
        }
    }
});

// Deep Dive Tabs Logic
document.querySelectorAll('.dd-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.dd-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
        const pane = document.getElementById(`tab-${tab.dataset.tab}`);
        if (pane) pane.classList.remove('hidden');
    });
});

// --- CMS Admin Logic --- //
const btnAdminToggle = document.getElementById('btn-admin-toggle');
if (btnAdminToggle) {
    btnAdminToggle.addEventListener('click', () => {
        isAdminMode = !isAdminMode;
        btnAdminToggle.innerText = isAdminMode ? 'Admin: ON' : 'Admin: OFF';
        btnAdminToggle.style.background = isAdminMode ? 'linear-gradient(135deg, #4ade80, #16a34a)' : '';
        if (screenLanding && !screenLanding.classList.contains('hidden')) {
            renderUseCases();
        }
    });
}

const cmsModal = document.getElementById('cms-modal');
const cmsForm = document.getElementById('cms-form');
const cmsUcFields = document.getElementById('cms-uc-fields');
const cmsCancel = document.getElementById('cms-cancel');

function openCMSModal(type, id) {
    document.getElementById('cms-type').value = type;
    document.getElementById('cms-id').value = id || '';
    
    const titleInput = document.getElementById('cms-title');
    const descInput = document.getElementById('cms-desc');
    
    if (type === 'cap') {
        if (cmsUcFields) cmsUcFields.classList.add('hidden');
        if (id) {
            const cap = healthcareData.find(c => c.id === id);
            document.getElementById('cms-modal-title').innerText = 'Edit Capability';
            titleInput.value = cap.title;
            descInput.value = cap.description;
        } else {
            document.getElementById('cms-modal-title').innerText = 'New Capability';
            titleInput.value = '';
            descInput.value = '';
        }
    } else {
        if (cmsUcFields) cmsUcFields.classList.remove('hidden');
        if (id) {
            const cap = healthcareData.find(c => c.id === currentCapabilityId);
            const uc = cap.useCases.find(u => u.title === id);
            document.getElementById('cms-modal-title').innerText = 'Edit Use Case';
            titleInput.value = uc.title;
            descInput.value = uc.desc;
            document.getElementById('cms-category').value = uc.category || 'operational';
            document.getElementById('cms-workflow').value = uc.workflow || 'all';
            document.getElementById('cms-section').value = uc.section || 'all';
        } else {
            document.getElementById('cms-modal-title').innerText = 'New Use Case';
            titleInput.value = '';
            descInput.value = '';
        }
    }
    if (cmsModal) cmsModal.classList.remove('hidden');
}

if (cmsCancel) {
    cmsCancel.addEventListener('click', () => {
        if (cmsModal) cmsModal.classList.add('hidden');
    });
}

if (cmsForm) {
    cmsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const type = document.getElementById('cms-type').value;
        const id = document.getElementById('cms-id').value;
        const title = document.getElementById('cms-title').value;
        const desc = document.getElementById('cms-desc').value;
        
        if (type === 'cap') {
            if (id) {
                const cap = healthcareData.find(c => c.id === id);
                if (cap) {
                    cap.title = title;
                    cap.description = desc;
                }
            } else {
                const newCap = {
                    id: 'cap-' + Date.now(),
                    title: title,
                    description: desc,
                    useCases: []
                };
                healthcareData.push(newCap);
            }
            saveHealthcareData();
            renderCapabilities();
        } else if (type === 'uc') {
            const cap = healthcareData.find(c => c.id === currentCapabilityId);
            if (!cap) return;
            const cat = document.getElementById('cms-category').value;
            const work = document.getElementById('cms-workflow').value;
            const sec = document.getElementById('cms-section').value;
            
            if (id) {
                const uc = cap.useCases.find(u => u.title === id);
                if (uc) {
                    uc.title = title;
                    uc.desc = desc;
                    uc.category = cat;
                    uc.workflow = work;
                    uc.section = sec;
                }
            } else {
                cap.useCases.push({
                    title: title,
                    desc: desc,
                    category: cat,
                    workflow: work,
                    section: sec
                });
            }
            saveHealthcareData();
            renderUseCases();
        }
        
        if (cmsModal) cmsModal.classList.add('hidden');
    });
}

function deleteItem(type, id) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    if (type === 'cap') {
        const idx = healthcareData.findIndex(c => c.id === id);
        if (idx > -1) healthcareData.splice(idx, 1);
        saveHealthcareData();
        renderCapabilities();
    } else if (type === 'uc') {
        const cap = healthcareData.find(c => c.id === currentCapabilityId);
        if (!cap) return;
        const idx = cap.useCases.findIndex(u => u.title === id);
        if (idx > -1) cap.useCases.splice(idx, 1);
        saveHealthcareData();
        renderUseCases();
    }
}

// Start loading process
preloadImages();

// --- KPI Animation Logic ---
function animateKPIs() {
    const kpis = document.querySelectorAll('.kpi-num');
    kpis.forEach(kpi => {
        const target = +kpi.getAttribute('data-val');
        const duration = 2000;
        const start = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = progress * (2 - progress); // Ease out quad
            kpi.innerText = Math.floor(easeProgress * target);
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                kpi.innerText = target;
            }
        }
        requestAnimationFrame(update);
    });
}

const kpiObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateKPIs();
            kpiObserver.disconnect();
        }
    });
});

setTimeout(() => {
    const kpiSection = document.querySelector('.sec-1-right');
    if (kpiSection) {
        kpiObserver.observe(kpiSection);
    }
}, 500);

// Also trigger if someone clicks the overview tab again (just in case)
document.querySelectorAll('.dd-tab[data-tab="overview"]').forEach(tab => {
    tab.addEventListener('click', () => {
        animateKPIs();
    });
});

// --- Carousel & Lightbox Logic ---
window.scrollCarousel = function(dir) {
    const carousel = document.getElementById('editorial-carousel');
    if (carousel) {
        const scrollAmount = 600 * dir; 
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
};

window.openLightbox = function(slideEl) {
    const imgEl = slideEl.querySelector('img');
    const captionEl = slideEl.querySelector('.f-caption');
    
    const lightbox = document.getElementById('image-lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbCaption = document.getElementById('lightbox-caption');
    
    if (lightbox && lbImg && imgEl) {
        lbImg.src = imgEl.src;
        if (captionEl && lbCaption) {
            lbCaption.innerHTML = captionEl.innerHTML;
        }
        lightbox.classList.remove('hidden');
    }
};

const lightbox = document.getElementById('image-lightbox');
const lbClose = document.getElementById('lightbox-close');

if (lbClose && lightbox) {
    lbClose.addEventListener('click', () => {
        lightbox.classList.add('hidden');
    });
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.add('hidden');
        }
    });
}

// Wire up new Custom Image Library Carousel
document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("library-track");
    const prevBtn = document.getElementById("library-prev");
    const nextBtn = document.getElementById("library-next");
    const items = document.querySelectorAll(".carousel-item");
    const lightbox = document.getElementById("image-lightbox");
    const lbImg = document.getElementById("lightbox-img");
    const lbCaption = document.getElementById("lightbox-caption");

    if (track && prevBtn && nextBtn) {
        prevBtn.addEventListener("click", () => {
            track.scrollBy({ left: -320, behavior: "smooth" });
        });
        nextBtn.addEventListener("click", () => {
            track.scrollBy({ left: 320, behavior: "smooth" });
        });
    }

    if (items.length > 0 && lightbox && lbImg) {
        items.forEach(item => {
            item.addEventListener("click", () => {
                lbImg.src = item.src;
                if (lbCaption) lbCaption.innerText = item.alt;
                lightbox.classList.remove("hidden");
            });
        });
    }
});


// --- Futuristic Waving Lines System ---
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width, height;
    let time = 0;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function drawWave(yOffset, color, speed, amplitude, frequency) {
        ctx.beginPath();
        ctx.moveTo(0, height / 2 + yOffset);
        for (let i = 0; i < width; i++) {
            let y = height / 2 + yOffset + Math.sin(i * frequency + time * speed) * amplitude;
            ctx.lineTo(i, y);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    function animateWaves() {
        ctx.clearRect(0, 0, width, height);
        time += 0.02;

        // Draw multiple glowing orange strands
        drawWave(-50, 'rgba(233, 76, 23, 0.1)', 0.5, 100, 0.003);
        drawWave(0, 'rgba(233, 76, 23, 0.2)', 0.7, 150, 0.002);
        drawWave(50, 'rgba(233, 76, 23, 0.3)', 0.9, 80, 0.004);
        drawWave(100, 'rgba(255, 255, 255, 0.05)', 0.4, 200, 0.001); // subtle white accent

        requestAnimationFrame(animateWaves);
    }

    window.addEventListener("resize", resize);
    resize();
    animateWaves();
});




// Practice Tabs Logic
document.querySelectorAll('.practice-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active from all practice tabs
        document.querySelectorAll('.practice-tab').forEach(t => t.classList.remove('active'));
        // Hide all practice panes
        document.querySelectorAll('.practice-pane').forEach(p => p.classList.add('hidden'));
        
        // Add active to clicked tab
        tab.classList.add('active');
        // Show target pane
        const target = document.getElementById(tab.dataset.target);
        if(target) target.classList.remove('hidden');
    });
});

// AI Practice Gallery Logic
function updateAiFeaturedImage(element, src, type) {
    const track = document.getElementById('ai-thumbnail-scroll-track');
    if(!track) return;
    
    // Update active state
    track.querySelectorAll('.library-thumbnail').forEach(t => t.classList.remove('active-thumb'));
    if(element) element.classList.add('active-thumb');
    
    // Update main image display
    const featuredContainer = document.getElementById('ai-featured-image-container');
    if(!featuredContainer) return;
    
    // Apply fade out animation
    featuredContainer.classList.add('fade-anim');
    
    // Hide overlay text if clicking anything other than the first process slide
    const overlay = document.getElementById('ai-slide-overlay');
    if(overlay) {
        // A simple check: if it's the first thumbnail, show overlay, else hide
        const isFirst = element.querySelector('.thumb-label') && element.querySelector('.thumb-label').innerText.includes('01');
        overlay.style.display = isFirst ? 'flex' : 'none';
    }
    
    setTimeout(() => {
        if (type === 'video') {
            featuredContainer.innerHTML = `
                <video id="ai-featured-image" src="${src}" autoplay muted loop style="width:100%; height:100%; object-fit:cover; border-radius:12px;"></video>
                <div class="hover-overlay"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg></div>
            `;
            if(overlay) featuredContainer.appendChild(overlay);
            featuredContainer.onclick = () => openLightbox(src, 'video');
        } else {
            featuredContainer.innerHTML = `
                <img id="ai-featured-image" src="${src}" alt="Featured Image" style="width:100%; height:100%; object-fit:cover; border-radius:12px;">
                <div class="hover-overlay"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg></div>
            `;
            if(overlay) featuredContainer.appendChild(overlay);
            featuredContainer.onclick = () => openLightbox(src, 'image');
        }
        
        setTimeout(() => {
            featuredContainer.classList.remove('fade-anim');
        }, 50);
    }, 300);
}

function scrollAiGallery(direction) {
    const track = document.getElementById('ai-thumbnail-scroll-track');
    if(track) {
        track.scrollBy({ left: direction * 300, behavior: 'smooth' });
    }
}

function openPracticesTab(tabId) {
    openScreen('screen-frameworks');
    const tabBtn = document.querySelector('.practice-tab[data-target="' + tabId + '"]');
    if(tabBtn) tabBtn.click();
}

// Global Event Listeners
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('lightbox-modal');
        if (modal && !modal.classList.contains('hidden')) {
            closeLightbox();
        }
    }
});

// --- Practices Screen Interactions --- //
function filterPractices() {
    const input = document.getElementById("practices-search");
    if (!input) return;
    const filter = input.value.toUpperCase();
    const ul = document.getElementById("practices-list");
    if (!ul) return;
    const li = ul.getElementsByTagName("li");

    for (let i = 0; i < li.length; i++) {
        const txtValue = li[i].textContent || li[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

const practiceData = {
    "Experience Design": {
        desc: "We design enterprise-grade product experiences that translate complex domain workflows into intuitive interfaces â€” combining research, systems thinking, and AI-native interaction patterns to accelerate adoption across our clients' organizations.",
        members: "12 Members"
    },
    "Product Owner & Business Analysis": {
        desc: "Bridging the gap between business objectives and technical execution. Our experts map complex requirements, define product strategies, and ensure seamless delivery of AI and data solutions that drive real value.",
        members: "8 Members"
    },
    "Data Functional": {
        desc: "Domain experts who understand the nuances of healthcare, finance, and enterprise data. We ensure data strategies align perfectly with operational realities, regulatory compliance, and business goals.",
        members: "5 Members"
    },
    "Data Engineering": {
        desc: "Building robust, scalable data pipelines and architectures. We transform fragmented data silos into unified, high-performance data lakes and warehouses ready for advanced analytics and AI modeling.",
        members: "24 Members"
    },
    "AI / ML Engineering": {
        desc: "Designing and deploying state-of-the-art machine learning models. From predictive analytics to Generative AI and LLM integrations, we build intelligent engines that power next-generation applications.",
        members: "18 Members"
    },
    "Solution Architecture": {
        desc: "Crafting scalable, secure, and future-proof enterprise architectures. We design full-stack ecosystems that seamlessly integrate modern AI capabilities with legacy healthcare and enterprise systems.",
        members: "9 Members"
    },
    "Quality Engineering": {
        desc: "Ensuring flawless execution through rigorous automated testing, performance tuning, and security validations. We guarantee enterprise reliability and compliance for all mission-critical AI applications.",
        members: "15 Members"
    },
    "Project Management": {
        desc: "Orchestrating complex technology deliveries with precision. Using agile methodologies, we manage timelines, resources, and risks to ensure on-time, high-quality deployments of transformational solutions.",
        members: "7 Members"
    }
};

function selectPractice(element) {
    const ul = document.getElementById("practices-list");
    if (ul) {
        const lis = ul.getElementsByTagName("li");
        for (let i = 0; i < lis.length; i++) {
            lis[i].classList.remove('active');
        }
    }
    element.classList.add('active');

    const practiceName = element.textContent.trim();

    const titleEl = document.getElementById("practice-main-title");
    const descEl = document.getElementById("practice-main-desc");
    const badgeEl = document.getElementById("practice-member-badge");

    if (titleEl) titleEl.innerText = practiceName;
    
    if (practiceData[practiceName]) {
        if (descEl) descEl.innerText = practiceData[practiceName].desc;
        if (badgeEl) badgeEl.innerText = practiceData[practiceName].members;
    }
}

// --- Navigation Fixes --- //
function goToHome() {
    hideAllScreens();
    const healthcareUiContainer = document.getElementById('healthcare-ui-container');
    if (healthcareUiContainer) healthcareUiContainer.classList.add('hidden');
    
    const mainContainer = document.getElementById('main-container');
    if (mainContainer) mainContainer.classList.remove('hidden');
    
    document.body.style.overflowY = 'auto';
}

function showBestPracticesDetails() {
    const healthcareUiContainer = document.getElementById('healthcare-ui-container');
    if (healthcareUiContainer) healthcareUiContainer.classList.remove('hidden');
    const mainContainer = document.getElementById('main-container');
    if (mainContainer) mainContainer.classList.add('hidden');
    document.body.style.overflowY = 'hidden'; 
    
    openPracticesTab('practice-tab-best-practices');
}

// --- Healthcare Frameworks Navigation --- //
function openHcPracticesTab(tabId) {
    openScreen('screen-healthcare-frameworks');
    const tabBtn = document.querySelector('#screen-healthcare-frameworks .practice-tab[data-target="' + tabId + '"]');
    if(tabBtn) tabBtn.click();
}

document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching for Healthcare Frameworks
    const hcTabs = document.querySelectorAll('#screen-healthcare-frameworks .practice-tab');
    hcTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            hcTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const targetId = tab.getAttribute('data-target');
            const allPanes = document.querySelectorAll('#screen-healthcare-frameworks .practice-pane');
            allPanes.forEach(pane => {
                pane.classList.remove('active');
                if(pane.id === targetId) {
                    pane.classList.add('active');
                }
            });
        });
    });
});

// --- Lightbox Zoom & Pan Logic --- //
let currentZoom = 1;
let isPanning = false;
let startX = 0, startY = 0;
let translateX = 0, translateY = 0;

function zoomLightbox(direction) {
    const content = document.getElementById('lightbox-content');
    if (!content) return;
    
    if (direction === 0) {
        currentZoom = 1;
        translateX = 0;
        translateY = 0;
    } else if (direction > 0) {
        currentZoom = Math.min(currentZoom + 0.5, 4); // Max zoom 4x
    } else {
        currentZoom = Math.max(currentZoom - 0.5, 0.5); // Min zoom 0.5x
    }
    
    updateLightboxTransform();
}

function updateLightboxTransform() {
    const content = document.getElementById('lightbox-content');
    if (content) {
        content.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('lightbox-content');
    if(content) {
        content.addEventListener('mousedown', (e) => {
            if(currentZoom > 1) {
                isPanning = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
            }
        });
        
        window.addEventListener('mousemove', (e) => {
            if(!isPanning) return;
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateLightboxTransform();
        });
        
        window.addEventListener('mouseup', () => {
            isPanning = false;
        });
    }
});

// --- Premium Lightbox Gallery Carousel --- //
let globalGalleryItems = [];
let currentLightboxIndex = -1;

class LightboxGallery {
    constructor(containerId, mediaItems) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.mediaItems = mediaItems;
        this.currentIndex = 0;
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        this.container.className = 'lightbox-gallery-container';

        // 1. Carousel View
        const carouselView = document.createElement('div');
        carouselView.className = 'gallery-carousel-view';

        // Prev Arrow
        const btnLeft = document.createElement('button');
        btnLeft.className = 'gallery-arrow gallery-arrow-left';
        btnLeft.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>';
        btnLeft.onclick = (e) => { e.stopPropagation(); this.navigate(-1); };
        
        // Track
        this.track = document.createElement('div');
        this.track.className = 'gallery-track';

        // Next Arrow
        const btnRight = document.createElement('button');
        btnRight.className = 'gallery-arrow gallery-arrow-right';
        btnRight.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>';
        btnRight.onclick = (e) => { e.stopPropagation(); this.navigate(1); };

        carouselView.appendChild(btnLeft);
        carouselView.appendChild(this.track);
        carouselView.appendChild(btnRight);
        this.container.appendChild(carouselView);

        // 2. Thumbnail Strip
        this.thumbStrip = document.createElement('div');
        this.thumbStrip.className = 'gallery-thumbnail-strip';
        this.container.appendChild(this.thumbStrip);

        this.updateDOM();
    }

    navigate(dir) {
        this.currentIndex += dir;
        if (this.currentIndex < 0) this.currentIndex = this.mediaItems.length - 1;
        if (this.currentIndex >= this.mediaItems.length) this.currentIndex = 0;
        this.updateDOM();
    }

    goToIndex(idx) {
        this.currentIndex = idx;
        this.updateDOM();
    }

    updateDOM() {
        // Render Track
        this.track.innerHTML = '';
        const total = this.mediaItems.length;
        
        // Determine prev and next indices (looping)
        const prevIndex = (this.currentIndex - 1 + total) % total;
        const nextIndex = (this.currentIndex + 1) % total;

        const renderSlide = (idx, posClass) => {
            const item = this.mediaItems[idx];
            const slide = document.createElement('div');
            slide.className = 'gallery-slide ' + posClass;

            if (item.type === 'video') {
                const video = document.createElement('video');
                video.src = item.src;
                video.muted = true;
                video.loop = true;
                if(posClass === 'active') video.play();
                slide.appendChild(video);
            } else {
                const img = document.createElement('img');
                img.src = item.src;
                slide.appendChild(img);
            }

            if (posClass === 'active') {
                const expand = document.createElement('div');
                expand.className = 'slide-expand-overlay';
                expand.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';
                slide.appendChild(expand);
                
                // Open global lightbox with ALL items from this gallery
                slide.onclick = () => {
                    globalGalleryItems = this.mediaItems;
                    currentLightboxIndex = this.currentIndex;
                    openLightbox(item.src, item.type, true);
                };
            } else {
                slide.onclick = () => this.goToIndex(idx);
            }

            this.track.appendChild(slide);
        };

        if (total > 1) renderSlide(prevIndex, 'prev');
        renderSlide(this.currentIndex, 'active');
        if (total > 2) renderSlide(nextIndex, 'next');
        else if (total === 2 && prevIndex !== nextIndex) renderSlide(nextIndex, 'next'); // Edge case 2 items

        // Render Thumbnails
        this.thumbStrip.innerHTML = '';
        this.mediaItems.forEach((item, idx) => {
            const thumb = document.createElement('div');
            thumb.className = 'gallery-thumb' + (idx === this.currentIndex ? ' active' : '');
            
            if (item.type === 'video') {
                // For video thumb, we can use a poster image if provided, else just load the video element
                const video = document.createElement('video');
                video.src = item.src;
                video.muted = true;
                thumb.appendChild(video);
                
                const icon = document.createElement('div');
                icon.className = 'thumb-video-indicator';
                icon.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>';
                thumb.appendChild(icon);
            } else {
                const img = document.createElement('img');
                img.src = item.src;
                thumb.appendChild(img);
            }
            
            thumb.onclick = () => this.goToIndex(idx);
            this.thumbStrip.appendChild(thumb);
        });
    }
}

// --- Enhanced Global Lightbox Navigation --- //
function navigateLightbox(dir) {
    if (globalGalleryItems.length === 0) return;
    
    currentLightboxIndex += dir;
    if (currentLightboxIndex < 0) currentLightboxIndex = globalGalleryItems.length - 1;
    if (currentLightboxIndex >= globalGalleryItems.length) currentLightboxIndex = 0;
    
    const item = globalGalleryItems[currentLightboxIndex];
    openLightbox(item.src, item.type, false);
}

// Override openLightbox
function openLightbox(src, type, isFromGallery = false) {
    const modal = document.getElementById('lightbox-modal');
    const content = document.getElementById('lightbox-content');
    if (!modal || !content) return;
    
    if(!isFromGallery) {
        globalGalleryItems = [];
        currentLightboxIndex = -1;
    }
    
    // Toggle navigation arrows visibility
    const leftArrow = document.getElementById('lightbox-nav-left');
    const rightArrow = document.getElementById('lightbox-nav-right');
    const counter = document.getElementById('lightbox-counter');
    
    if (globalGalleryItems.length > 1) {
        if(leftArrow) leftArrow.classList.remove('hidden');
        if(rightArrow) rightArrow.classList.remove('hidden');
        if(counter) {
            counter.classList.remove('hidden');
            counter.innerText = (currentLightboxIndex + 1) + " / " + globalGalleryItems.length;
        }
    } else {
        if(leftArrow) leftArrow.classList.add('hidden');
        if(rightArrow) rightArrow.classList.add('hidden');
        if(counter) counter.classList.add('hidden');
    }
    
    content.innerHTML = '';
    if (type === 'video') {
        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        video.style.maxWidth = '90vw';
        video.style.maxHeight = '90vh';
        content.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.src = src;
        content.appendChild(img);
    }
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    zoomLightbox(0);
}

// --- Initialize Galleries --- //
document.addEventListener('DOMContentLoaded', () => {
    const aiPracticeMedia = [
        { type: 'image', src: 'Media/Card Images/Card Image 1.jpg' },
        { type: 'image', src: 'Media/Card Images/Card Image 2.jpg' },
        { type: 'image', src: 'Media/Card Images/Card Image 3.jpg' },
        { type: 'video', src: 'https://www.w3schools.com/html/mov_bbb.mp4' }
    ];

    const patientIntakeMedia = [
        { type: 'image', src: 'Media/Healthcare Services/3. Shawroom- Overview.jpg' },
        { type: 'image', src: 'Media/Card Images/Card Image 2.jpg' },
        { type: 'image', src: 'Media/Card Images/Card Image 3.jpg' },
        { type: 'video', src: 'https://www.w3schools.com/html/mov_bbb.mp4' }
    ];

    if(document.getElementById('ai-practice-gallery')) {
        new LightboxGallery('ai-practice-gallery', aiPracticeMedia);
    }
    
    if(document.getElementById('hc-ai-practice-gallery')) {
        new LightboxGallery('hc-ai-practice-gallery', aiPracticeMedia);
    }

    if(document.getElementById('patient-intake-gallery')) {
        new LightboxGallery('patient-intake-gallery', patientIntakeMedia);
    }
});



// Data Models Logic
const dataModels = {
    'model-1': {
        title: 'Patient Journey Analytics',
        desc: 'Comprehensive data architecture mapping the end-to-end patient lifecycle, integrating clinical, financial, and operational touchpoints for holistic predictive modeling.',
        img: 'Media/Healthcare Services/tech_architecture.png'
    },
    'model-2': {
        title: 'Clinical Risk Stratification',
        desc: 'Advanced statistical and machine learning models designed to identify at-risk patient populations early, enabling proactive care interventions and resource allocation.',
        img: 'Media/Healthcare Services/ai_engine_map.png'
    },
    'model-3': {
        title: 'Revenue Cycle Optimization',
        desc: 'Data model predicting claim denials and identifying revenue leakage points by analyzing historical billing patterns, payer rules, and clinical documentation.',
        img: 'Media/Healthcare Services/tech_architecture.png'
    },
    'model-4': {
        title: 'Supply Chain Demand Forecasting',
        desc: 'Predictive models for optimizing inventory levels of critical medical supplies, minimizing stockouts, and reducing holding costs through automated procurement triggers.',
        img: 'Media/Healthcare Services/ai_engine_map.png'
    }
};

function showDataModel(modelId, element) {
    // Update active class on nav
    const navItems = document.querySelectorAll('#data-models-nav li');
    navItems.forEach(item => item.classList.remove('active'));
    if (element) {
        element.classList.add('active');
    }

    // Update content
    const model = dataModels[modelId];
    if (model) {
        document.getElementById('data-model-title').innerText = model.title;
        document.getElementById('data-model-desc').innerText = model.desc;
        document.getElementById('data-model-img').src = model.img;
        
        // Add a small fade animation
        const contentArea = document.querySelector('#screen-data-models .practices-main-content');
        if (contentArea) {
            contentArea.style.opacity = '0.5';
            setTimeout(() => {
                contentArea.style.opacity = '1';
                contentArea.style.transition = 'opacity 0.3s ease';
            }, 50);
        }
    }
}