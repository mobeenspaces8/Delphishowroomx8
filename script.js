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
}

function goBackOneScreen() {
    if (screenDeepDive && !screenDeepDive.classList.contains('hidden')) {
        hideAllScreens();
        if (screenClinical) screenClinical.classList.remove('hidden');
    } else if (screenClinical && !screenClinical.classList.contains('hidden')) {
        showHealthcareDetails(); // goes to landing
    } else {
        // If on landing, go back to main site showcase
        const mainContainer = document.getElementById('main-container');
        if (mainContainer) mainContainer.classList.remove('hidden');
        if (healthcareUiContainer) healthcareUiContainer.classList.add('hidden');
        document.body.style.overflowY = 'hidden'; 
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
    
    // Render capabilities on open
    renderCapabilities();
}

// Backward Flow Navigation
if (btnPrevLanding) {
    btnPrevLanding.addEventListener('click', () => {
        hideAllScreens();
        if (screenLanding) screenLanding.classList.remove('hidden');
    });
}

// Back to Showroom from any screen
backToShowroomBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (healthcareUiContainer) healthcareUiContainer.classList.add('hidden');
        const mainContainer = document.getElementById('main-container');
        if (mainContainer) mainContainer.classList.remove('hidden');
        document.body.style.overflowY = 'hidden'; 
        window.scrollTo(0, 0); // Lock scroll back
    });
});

// Breadcrumbs Navigation
document.querySelectorAll('.bc-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const target = e.target.getAttribute('data-target');
        if (target === 'showroom') {
            if (healthcareUiContainer) healthcareUiContainer.classList.add('hidden');
            const mainContainer = document.getElementById('main-container');
            if (mainContainer) mainContainer.classList.remove('hidden');
            document.body.style.overflowY = 'hidden'; 
            window.scrollTo(0, 0);
        } else if (target === 'landing') {
            hideAllScreens();
            if (screenLanding) screenLanding.classList.remove('hidden');
        }
    });
});

// --- Dynamic Data & Flow --- //
const defaultHealthcareData = [
    {
        id: 'cap-1',
        title: 'Clinical Document Intelligence',
        description: 'Extract, validate, and structure patient information from clinical documents to accelerate care decisions.',
        image: 'Media/Card Images/Card Image 1.jpg',
        useCases: [
            { title: 'Automated Patient Intake', desc: 'Extract data from referral forms and IDs.', category: 'operational', workflow: 'patient-intake', section: 'patient-access' },
            { title: 'Medical Coding Automation', desc: 'Suggest billing codes based on unstructured physician notes.', category: 'financial', workflow: 'billing', section: 'revenue-cycle' },
            { title: 'Care Gap Analysis', desc: 'Identify missing documentation to improve patient outcomes.', category: 'clinical', workflow: 'care-delivery', section: 'clinical-ops' },
            { title: 'Audit Trail Generation', desc: 'Maintain compliance by generating automated audit logs.', category: 'operational', workflow: 'all', section: 'quality' }
        ]
    },
    {
        id: 'cap-2',
        title: 'Predictive Care Analytics',
        description: 'Leverage AI models to forecast patient risks and optimize care delivery pathways proactively.',
        image: 'Media/Card Images/Card Image 2.jpg',
        useCases: [
            { title: 'Readmission Prediction', desc: 'Identify high-risk patients before discharge.', category: 'clinical', workflow: 'care-delivery', section: 'clinical-ops' },
            { title: 'Resource Allocation', desc: 'Predict staffing and bed needs based on patient influx.', category: 'operational', workflow: 'all', section: 'clinical-ops' },
            { title: 'Denial Prevention', desc: 'Predict and prevent insurance claim denials.', category: 'financial', workflow: 'billing', section: 'revenue-cycle' }
        ]
    },
    {
        id: 'cap-3',
        title: 'Conversational AI Assistants',
        description: 'Deploy intelligent virtual assistants to handle patient inquiries, scheduling, and triage.',
        image: 'Media/Card Images/Card Image 3.jpg',
        useCases: [
            { title: '24/7 Appointment Scheduling', desc: 'Automated booking and rescheduling for patients.', category: 'operational', workflow: 'patient-intake', section: 'patient-access' },
            { title: 'Symptom Checker', desc: 'AI-driven initial symptom assessment and triage.', category: 'clinical', workflow: 'patient-intake', section: 'patient-access' },
            { title: 'Billing Explanations', desc: 'Help patients understand their bills via chat.', category: 'financial', workflow: 'billing', section: 'revenue-cycle' }
        ]
    },
    {
        id: 'cap-4',
        title: 'Medical Image Analysis',
        description: 'Enhance diagnostic accuracy with AI-powered anomaly detection in radiology and pathology.',
        image: 'Media/Card Images/Card Image 4.jpg',
        useCases: [
            { title: 'Automated Screening', desc: 'Highlight potential anomalies in X-rays and MRIs.', category: 'clinical', workflow: 'care-delivery', section: 'clinical-ops' },
            { title: 'Scan Prioritization', desc: 'Route urgent scans to top of radiologist queue.', category: 'operational', workflow: 'care-delivery', section: 'clinical-ops' }
        ]
    },
    {
        id: 'cap-5',
        title: 'Revenue Cycle Optimization',
        description: 'Streamline the end-to-end billing process using machine learning to minimize revenue leakage.',
        image: 'Media/Card Images/Card Image 5.jpg',
        useCases: [
            { title: 'Claim Scrubbing', desc: 'Automatically validate claims against payer rules before submission.', category: 'financial', workflow: 'billing', section: 'revenue-cycle' },
            { title: 'Prior Authorization', desc: 'Automate prior authorization requests from EHR data.', category: 'operational', workflow: 'patient-intake', section: 'revenue-cycle' }
        ]
    },
    {
        id: 'cap-6',
        title: 'Precision Medicine Insights',
        description: 'Analyze genomic and clinical data to tailor highly specific treatment plans for individual patients.',
        image: 'Media/Card Images/Card Image 1.jpg',
        useCases: [
            { title: 'Genomic Profiling', desc: 'Match patient profiles to targeted therapies.', category: 'clinical', workflow: 'care-delivery', section: 'clinical-ops' },
            { title: 'Clinical Trial Matching', desc: 'Identify eligible patients for ongoing research studies.', category: 'clinical', workflow: 'care-delivery', section: 'clinical-ops' }
        ]
    }
];

// Force refresh local storage to pick up new images
localStorage.removeItem('delphi_healthcareData');

let healthcareData = null;
try {
    healthcareData = JSON.parse(localStorage.getItem('delphi_healthcareData'));
} catch (e) {
    console.warn("localStorage is not available or invalid:", e);
}

if (!healthcareData || !Array.isArray(healthcareData) || healthcareData.length === 0) {
    healthcareData = JSON.parse(JSON.stringify(defaultHealthcareData));
}

function saveHealthcareData() {
    try {
        localStorage.setItem('delphi_healthcareData', JSON.stringify(healthcareData));
    } catch (e) {
        console.warn("Could not save to localStorage:", e);
    }
}

let isAdminMode = false;

let currentCapabilityId = null;
let currentSidebarFilter = 'all'; 

function renderCapabilities() {
    const grid = document.getElementById('capabilities-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    if (isAdminMode) {
        const createContainer = document.createElement('div');
        createContainer.className = 'create-btn-container';
        createContainer.style.gridColumn = '1 / -1';
        createContainer.innerHTML = '<button class="create-btn">+ Add Capability</button>';
        createContainer.querySelector('button').addEventListener('click', () => openCMSModal('cap', null));
        grid.appendChild(createContainer);
    }

    healthcareData.forEach((cap, index) => {
        // Fallback image handling
        const imgUrl = cap.image ? cap.image : `Media/Card Images/Card Image ${(index % 5) + 1}.jpg`;
        
        const card = document.createElement('div');
        card.className = 'cap-card';
        const impactVal = (Math.floor(Math.random() * 40) + 10) + '%';
        const impactDesc = ['Reduction in Readmissions', 'Increase in Efficiency', 'Cost Savings', 'Faster Diagnosis'][index % 4];
        
        card.innerHTML = `
            <div class="card-img" style="background-image: url('${imgUrl}');">
                <div class="card-glass-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 20V10M18 20V4M6 20v-4"/>
                    </svg>
                </div>
            </div>
            <div class="card-content">
                <h3>${cap.title}</h3>
                <span class="category-label">Healthcare Intelligence</span>
                <p>${cap.description}</p>
                
                <div class="card-footer-impact">
                    <div class="impact-stats">
                        <span class="impact-title">Business Impact</span>
                        <span class="impact-value">${impactVal}</span>
                        <span class="impact-desc">${impactDesc}</span>
                    </div>
                    <div class="arrow-btn-circle">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e94c17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                </div>
            </div>
        `;
        
        if (isAdminMode) {
            const actions = document.createElement('div');
            actions.className = 'admin-actions';
            actions.innerHTML = `
                <button class="edit-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg></button>
                <button class="delete-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
            `;
            actions.querySelector('.edit-btn').addEventListener('click', (e) => { e.stopPropagation(); openCMSModal('cap', cap.id); });
            actions.querySelector('.delete-btn').addEventListener('click', (e) => { e.stopPropagation(); deleteItem('cap', cap.id); });
            card.appendChild(actions);
        }

        card.addEventListener('click', () => openClinicalScreen(cap));
        grid.appendChild(card);
    });
}

function openClinicalScreen(cap) {
    currentCapabilityId = cap.id;
    hideAllScreens();
    if (screenClinical) screenClinical.classList.remove('hidden');
    
    const titleEl = document.getElementById('clinical-hero-title');
    const descEl = document.getElementById('clinical-hero-desc');
    const bcClinicalName = document.getElementById('bc-clinical-name');
    if (titleEl) titleEl.innerText = cap.title;
    if (descEl) descEl.innerText = cap.description;
    if (bcClinicalName) bcClinicalName.innerText = cap.title;
    
    const searchInput = document.getElementById('search-use-case');
    const catFilter = document.getElementById('filter-category');
    const workFilter = document.getElementById('filter-workflow');
    if(searchInput) searchInput.value = '';
    if(catFilter) catFilter.value = 'all';
    if(workFilter) workFilter.value = 'all';
    
    const sideBtns = document.querySelectorAll('.side-btn');
    if(sideBtns.length > 0) {
        sideBtns.forEach(btn => btn.classList.remove('active', 'highlight'));
        sideBtns[0].classList.add('active'); // 'All Use Cases' active by default
        currentSidebarFilter = 'all';
    }

    renderUseCases();
}

function renderUseCases() {
    const grid = document.getElementById('use-cases-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    const cap = healthcareData.find(c => c.id === currentCapabilityId);
    if (!cap) return;
    
    const searchInput = document.getElementById('search-use-case');
    const catFilter = document.getElementById('filter-category');
    const workFilter = document.getElementById('filter-workflow');
    
    const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';
    const categoryValue = catFilter ? catFilter.value : 'all';
    const workflowValue = workFilter ? workFilter.value : 'all';
    
    if (isAdminMode) {
        const createContainer = document.createElement('div');
        createContainer.className = 'create-btn-container';
        createContainer.style.gridColumn = '1 / -1';
        createContainer.innerHTML = '<button class="create-btn">+ Add Use Case</button>';
        createContainer.querySelector('button').addEventListener('click', () => openCMSModal('uc', null));
        grid.appendChild(createContainer);
    }

    let count = 0;
    
    cap.useCases.forEach((uc, index) => {
        if (currentSidebarFilter !== 'all' && uc.section !== currentSidebarFilter) return;
        if (categoryValue !== 'all' && uc.category !== categoryValue) return;
        if (workflowValue !== 'all' && uc.workflow !== workflowValue) return;
        if (searchQuery && !uc.title.toLowerCase().includes(searchQuery) && !uc.desc.toLowerCase().includes(searchQuery)) return;
        
        count++;
        
        const card = document.createElement('div');
        card.className = 'use-case-card highlight-card';
        const impactVal = (Math.floor(Math.random() * 40) + 10) + '%';
        const impactDesc = ['Reduction in Readmissions', 'Increase in Efficiency', 'Cost Savings', 'Faster Diagnosis'][index % 4];
        
        card.innerHTML = `
            <div class="card-img" style="background-image: url('Media/Card Images/Card Image ${(index % 5) + 1}.jpg');">
                <div class="card-glass-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 20V10M18 20V4M6 20v-4"/>
                    </svg>
                </div>
            </div>
            <div class="card-content">
                <h3>${uc.title}</h3>
                <span class="category-label">${uc.category || 'Healthcare Intelligence'}</span>
                <p>${uc.desc}</p>
                
                <div class="card-footer-impact">
                    <div class="impact-stats">
                        <span class="impact-title">Business Impact</span>
                        <span class="impact-value">${impactVal}</span>
                        <span class="impact-desc">${impactDesc}</span>
                    </div>
                    <div class="arrow-btn-circle">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e94c17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                </div>
            </div>
        `;
        
        if (isAdminMode) {
            const actions = document.createElement('div');
            actions.className = 'admin-actions';
            actions.innerHTML = `
                <button class="edit-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg></button>
                <button class="delete-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
            `;
            // Identify uc by title since they lack IDs
            actions.querySelector('.edit-btn').addEventListener('click', (e) => { e.stopPropagation(); openCMSModal('uc', uc.title); });
            actions.querySelector('.delete-btn').addEventListener('click', (e) => { e.stopPropagation(); deleteItem('uc', uc.title); });
            card.appendChild(actions);
        }

        card.addEventListener('click', () => openDeepDiveScreen(uc));
        grid.appendChild(card);
    });
    
    if (count === 0 && !isAdminMode) {
        grid.innerHTML = '<p style="color:#aaa; grid-column:1/-1; text-align:left; padding: 40px 0; font-size:1.1rem;">No use cases found matching your criteria.</p>';
    }
}

// Setup Filters & Navigation logic
const sideBtns = document.querySelectorAll('.side-btn');
const sections = ['all', 'revenue-cycle', 'clinical-ops', 'patient-access', 'quality'];
sideBtns.forEach((btn, index) => {
    btn.dataset.section = sections[index] || 'all';
    btn.addEventListener('click', () => {
        sideBtns.forEach(b => b.classList.remove('active', 'highlight'));
        btn.classList.add('active', 'highlight');
        currentSidebarFilter = btn.dataset.section;
        renderUseCases();
    });
});

const searchInput = document.getElementById('search-use-case');
const catFilter = document.getElementById('filter-category');
const workFilter = document.getElementById('filter-workflow');

if(searchInput) searchInput.addEventListener('input', renderUseCases);
if(catFilter) catFilter.addEventListener('change', renderUseCases);
if(workFilter) workFilter.addEventListener('change', renderUseCases);

function openDeepDiveScreen(uc) {
    hideAllScreens();
    if (screenDeepDive) screenDeepDive.classList.remove('hidden');
    
    const titleEl = document.getElementById('deep-dive-title');
    const subtitleEl = document.getElementById('deep-dive-subtitle');
    if (titleEl) titleEl.innerText = uc.title;
    if (subtitleEl) subtitleEl.innerText = uc.desc;

    // AI Generated Rich Content Injection
    const overviewPane = document.getElementById('tab-overview');
    if (overviewPane) {
        overviewPane.innerHTML = `
            <div class="overview-new-layout">
                <!-- Section 1 -->
                <div class="overview-sec sec-1">
                    <div class="sec-1-left">
                        <h2 class="sec-title">We Balance Business Objectives with Customer needs</h2>
                        <div class="subtitle-buttons">
                            <button class="action-btn">Digital Experiences</button>
                            <button class="action-btn">Innovative Design</button>
                            <button class="action-btn">Cutting-edge Tech</button>
                        </div>
                    </div>
                    <div class="sec-1-right">
                        <div class="kpi-box">
                            <h3 class="kpi-num" data-val="100">0</h3><span class="kpi-suffix">%</span>
                            <p class="kpi-label">Engagement</p>
                        </div>
                        <div class="kpi-box">
                            <h3 class="kpi-num" data-val="10">0</h3><span class="kpi-suffix">x</span>
                            <p class="kpi-label">ROI Boost</p>
                        </div>
                        <div class="kpi-box">
                            <h3 class="kpi-num" data-val="50">0</h3><span class="kpi-suffix">+</span>
                            <p class="kpi-label">Projects</p>
                        </div>
                    </div>
                </div>

                <!-- Section 2 -->
                <div class="overview-sec sec-2">
                    <div class="full-width-img" style="background-image: url('Media/Healthcare\\\\ Services/3.\\\\ Shawroom-\\\\ Overview.jpg');"></div>
                    <div class="sec-2-text">
                        <h3>Strategic Implementation for ${uc.title}</h3>
                        <p>Driving growth through data-driven methodologies and AI-powered capabilities.</p>
                    </div>
                </div>

                <!-- Section 3 -->
                <div class="overview-sec sec-3">
                    <div class="sec-3-grid">
                        <div class="sec-3-item">
                            <h4>01. Executive Summary</h4>
                            <p>Deploying Delphi's AI engine for <strong>${uc.title}</strong> directly addresses bottlenecks in ${uc.category} workflows. By ingesting unstructured data and applying predictive analytics, organizations see immediate ROI while maintaining strict HIPAA compliance.</p>
                        </div>
                        <div class="sec-3-item">
                            <h4>02. Problem</h4>
                            <p>The core challenge or bottleneck faced by the business and the customer in the current landscape.</p>
                        </div>
                        <div class="sec-3-item">
                            <h4>03. Solution</h4>
                            <p>How our AI-powered capabilities and strategic design resolve these critical problems effectively.</p>
                        </div>
                        <div class="sec-3-item">
                            <h4>04. Outcome</h4>
                            <p>Measurable improvements in engagement, operational efficiency, and overall customer satisfaction.</p>
                        </div>
                    </div>
                </div>

                <!-- Section 4 -->
                <div class="overview-sec sec-4">
                    <h3 class="sec-heading">View Image Library</h3>
                    <div class="carousel-nav-wrapper">
                        <button class="carousel-btn prev" onclick="scrollCarousel(-1)">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        </button>
                        <div class="framer-editorial-carousel" id="editorial-carousel">
                            <div class="f-slide" onclick="openLightbox(this)">
                                <img src="Media/Healthcare Services/4. Shawroom- Process.jpg" alt="Process Architecture">
                                <div class="f-caption">Edition No.1<br><span>Process Architecture</span></div>
                            </div>
                            <div class="f-slide" onclick="openLightbox(this)">
                                <img src="Media/Healthcare Services/5. Shawroom- Tech Architecture.jpg" alt="Tech Infrastructure">
                                <div class="f-caption">Edition No.2<br><span>Tech Infrastructure</span></div>
                            </div>
                            <div class="f-slide" onclick="openLightbox(this)">
                                <img src="Media/Healthcare Services/6. Shawroom- Engine Map.jpg" alt="Engine Map">
                                <div class="f-caption">Edition No.3<br><span>Engine Map</span></div>
                            </div>
                        </div>
                        <button class="carousel-btn next" onclick="scrollCarousel(1)">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                        </button>
                    </div>
                </div>

                <!-- Section 5 -->
                <div class="overview-sec sec-5">
                    <h3 class="sec-heading">Stories Shared by Client</h3>
                    <div class="framer-testimonial-reel">
                        <div class="f-test-track">
                            <div class="f-test-card">
                                <p class="f-quote">"This ecosystem transformed our operations overnight."</p>
                                <p class="f-author">- Jane Doe, CTO</p>
                            </div>
                            <div class="f-test-card">
                                <p class="f-quote">"Incredible insights and beautiful design."</p>
                                <p class="f-author">- John Smith, Director</p>
                            </div>
                            <div class="f-test-card">
                                <p class="f-quote">"A truly seamless AI integration process."</p>
                                <p class="f-author">- Sarah Connor, VP of Tech</p>
                            </div>
                            <!-- Duplicate for infinite loop -->
                            <div class="f-test-card">
                                <p class="f-quote">"This ecosystem transformed our operations overnight."</p>
                                <p class="f-author">- Jane Doe, CTO</p>
                            </div>
                            <div class="f-test-card">
                                <p class="f-quote">"Incredible insights and beautiful design."</p>
                                <p class="f-author">- John Smith, Director</p>
                            </div>
                            <div class="f-test-card">
                                <p class="f-quote">"A truly seamless AI integration process."</p>
                                <p class="f-author">- Sarah Connor, VP of Tech</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        setTimeout(() => {
            if (typeof animateKPIs === 'function') animateKPIs();
        }, 100);
    }

    const processPane = document.getElementById('tab-process');
    if (processPane) {
        processPane.innerHTML = `
            <div class="ai-process-flow">
                <div class="step"><span>1</span><h4>Data Ingestion</h4><p>Securely connect EHR and legacy systems via FHIR APIs.</p></div>
                <div class="step"><span>2</span><h4>AI Processing</h4><p>Run <strong>${uc.title}</strong> inference models.</p></div>
                <div class="step"><span>3</span><h4>Human-in-loop</h4><p>Review flagged edge-cases in the validation dashboard.</p></div>
                <div class="step"><span>4</span><h4>Deployment</h4><p>Integrate insights back into clinical workflows instantly.</p></div>
            </div>
        `;
    }

    const techPane = document.getElementById('tab-tech-arch');
    if (techPane) {
        techPane.innerHTML = `
            <div class="ai-tech-arch">
                <h3>Architecture for ${uc.title}</h3>
                <pre class="mermaid-mock">
[ EHR / PACS System ] --> ( Delphi API Gateway )
( Delphi API Gateway ) --> [ Data Anonymization Layer ]
[ Data Anonymization Layer ] --> [ NLP / Vision Pipeline ]
[ NLP / Vision Pipeline ] --> [ Predictive Engine ]
[ Predictive Engine ] --> ( Clinical Dashboard )
                </pre>
            </div>
        `;
    }

    const enginePane = document.getElementById('tab-engine-map');
    if (enginePane) {
        enginePane.innerHTML = `
            <div class="ai-engine-map">
                <h3>Neural Network Mapping</h3>
                <p>Visualizing real-time node activations for ${uc.title} data models.</p>
                <div class="mock-network">
                    <span style="color:rgba(255,122,24,0.5); display:flex;"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"/><path d="M15.7 3.8c-2.04-2.03-7.36-.02-11.9 4.5-4.54 4.52-6.54 9.87-4.5 11.9 2.04 2.03 7.36.02 11.9-4.5 4.54-4.52 6.54-9.87 4.5-11.9Z"/></svg></span>
                </div>
            </div>
        `;
    }
    
    // reset tabs
    document.querySelectorAll('.dd-tab').forEach(t => t.classList.remove('active'));
    const firstTab = document.querySelector('.dd-tab[data-tab="overview"]');
    if (firstTab) firstTab.classList.add('active');
    
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
    const firstPane = document.getElementById('tab-overview');
    if (firstPane) firstPane.classList.remove('hidden');
}

// Deep Dive Tabs
document.querySelectorAll('.dd-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.dd-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
        const pane = document.getElementById(`tab-${tab.dataset.tab}`);
        if (pane) pane.classList.remove('hidden');
    });
});

// Back to Use Cases from Deep Dive
const btnPrevClinical = document.getElementById('btn-prev-clinical');
if (btnPrevClinical) {
    btnPrevClinical.addEventListener('click', () => {
        hideAllScreens();
        if (screenClinical) screenClinical.classList.remove('hidden');
    });
}

// --- CMS Admin Logic --- //
const btnAdminToggle = document.getElementById('btn-admin-toggle');
if (btnAdminToggle) {
    btnAdminToggle.addEventListener('click', () => {
        isAdminMode = !isAdminMode;
        btnAdminToggle.innerText = isAdminMode ? 'Admin: ON' : 'Admin: OFF';
        btnAdminToggle.style.background = isAdminMode ? 'linear-gradient(135deg, #4ade80, #16a34a)' : '';
        renderCapabilities();
        if (currentCapabilityId && screenClinical && !screenClinical.classList.contains('hidden')) {
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

