filepath = 'e:/@ AI Learning/Delphi Factory Shworoom/Delphi Ecosystem Application/ABC/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# The diff removed admin-controls, lightbox-modal, and cms-modal wrapper, leaving orphaned form fields
# We need to wrap them back and add the missing elements

replacement = '''    <!-- Admin Controls -->
    <div id="admin-controls" class="floating-admin">
        <button id="btn-admin-toggle" class="admin-btn">Admin: OFF</button>
    </div>

    <!-- Lightbox Modal -->
    <div id="lightbox-modal" class="lightbox-modal hidden">
        <div class="lightbox-overlay" onclick="closeLightbox()"></div>
        <div id="lightbox-counter" class="hidden" style="position:absolute;top:24px;left:50%;transform:translateX(-50%);color:#fff;font-size:0.85rem;font-weight:500;z-index:10005;background:rgba(0,0,0,0.6);padding:5px 16px;border-radius:20px;backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.1);"></div>
        <button class="lightbox-close-btn" onclick="closeLightbox()" title="Close (Esc)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <button id="lightbox-nav-left" class="lightbox-arrow lightbox-arrow-left hidden" onclick="navigateLightbox(-1)" title="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button id="lightbox-nav-right" class="lightbox-arrow lightbox-arrow-right hidden" onclick="navigateLightbox(1)" title="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
        </button>
        <div class="lightbox-zoom-controls">
            <button class="zoom-btn" onclick="zoomLightbox(-1)" title="Zoom out (-)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
            <button class="zoom-btn" onclick="zoomLightbox(0)" title="Reset (0)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button>
            <button class="zoom-btn" onclick="zoomLightbox(1)" title="Zoom in (+)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        </div>
        <div class="lightbox-content" id="lightbox-content"><!-- Media injected via JS --></div>
    </div>

    <!-- CMS Modal -->
    <div id="cms-modal" class="modal hidden">
        <div class="modal-content">
            <h2 id="cms-modal-title">Edit Item</h2>
            <form id="cms-form">
'''

# Replace the orphaned fragment
orphan = '''                <input type="hidden" id="cms-id">
                <input type="hidden" id="cms-type"> <!-- 'cap' or 'uc' -->'''

text = text.replace(orphan, replacement + '                <input type="hidden" id="cms-id">\n                <input type="hidden" id="cms-type"> <!-- \'cap\' or \'uc\' -->', 1)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
print("HTML rebuild done")