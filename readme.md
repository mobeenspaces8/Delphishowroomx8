# Delphishowroomx8

# Delphi Ecosystem Application - Interactive Showroom

## Project Overview
This project is a highly interactive, responsive web application that provides a cinematic, immersive experience. It relies on high-quality PNG sequence frames (as raw footage) to transition between various sections of the Delphi Ecosystem based on user scroll, hover, and click interactions.

## Technology Stack
- **Structure:** HTML5
- **Styling:** CSS3 (Vanilla CSS, fully responsive across major screen sizes)
- **Logic & Interactions:** Vanilla JavaScript
- **Animations:** GSAP (GreenSock Animation Platform) and ScrollTrigger for smooth scroll-bound PNG sequence playback and UI transitions.

## Interaction Flow & Media Structure

### 1. Section One: Cloud Entry to Showroom Tower
- **Interaction:** Smooth scroll animation. As the user scrolls down, the scene transitions from the sky down to the showroom tower.
- **Media:** PNG sequences located in `Media/Section One` (`Scene 1_Cloud Entry` and `Scene 2_Drone Descent`).
- **Implementation:** HTML5 `<canvas>` element linked to scroll position via GSAP ScrollTrigger.

### 2. Section Two: Three Buildings Selection
- **Interaction:** Hover and Click.
    - **Hover:** Moving the cursor over each of the three buildings applies an orange color overlay.
    - **Click:** Clicking a building transitions the user to a dedicated scene for that building.
- **Media:** Located in `Media/Section Two`.
    - Base frame: `Scene 2.2_Select Building.png`
    - Left Building Hover: `Scene 2.2_Select Building_Manufaturing Unit on Hover.png`
    - Center Building Hover: `Scene 2.2_Select Building_tower on Hover.png`
    - Right Building Hover: `Scene 2.2_Select Building_Showroom on Hover.png`

### 3. Section Three: Enter Left Building (Manufacturing Unit)
- **Interaction:** Triggered by clicking the left building in Section Two. An entry animation plays and pauses on the final frame.
- **Media:** PNG sequence located in `Media/Section Two Click on Left most building` (Frames `00000` to `00246`).
- **Final Frame State:** Frame `00246` introduces a user interface with 9 transparent interactive boxes.

### 4. Section Four: Services Navigation (Building 1)
- **Interaction:** Hover and Click on the 9 transparent service boxes overlaid on the final frame of Section Three.
    - **Hover:** Highlights the respective service card.
    - **Click:** Redirects the user to the dedicated section for that specific service.
- **Media:** Hover highlight frames are located in `Media/Services Hover from Building Left`:
    1. Healthcare
    2. Real Estate
    3. Hospitality
    4. Tech
    5. Public Sector
    6. Finance
    7. Retail
    8. Education
    9. More

### 5. Section Five: Healthcare Services Details
- **Interaction:** Triggered by clicking the "Healthcare" card in Section Four. Navigates through interactive healthcare capabilities and use cases.
- **Media:** Located in `Media/Healthcare Services`.
    - `1. Shawroom- Landing Page.jpg`
    - `2. Shawroom- Use Cases.jpg`
    - `3. Shawroom- Overview.jpg`
    - `4. Shawroom- Process.jpg`
    - `5. Shawroom- Tech Architecture.jpg`
    - `6. Shawroom- Engine Map.jpg`

## Implementation Steps

1. **Project Setup:** Initialize HTML, CSS, and JS structure. Load GSAP and setup canvas environments for sequence playback.
2. **Section One (Scroll):** Preload Section One frames and link canvas drawing to scroll progress.
3. **Section Two (Hover/Click Maps):** Create SVG overlays or coordinate-based interactive maps over the canvas to detect hovers and clicks on the three buildings, cross-fading the respective hover images.
4. **Section Three (Click Sequence):** On left building click, trigger the playback of the `Scene 3.2` sequence.
5. **Section Four (Services UI):** Overlay transparent interactive HTML elements on top of the final frame `00246` to handle hover states and clicks for the 9 services.
6. **Section Five (Healthcare Detail Views):** Construct the responsive layouts for the Healthcare pages based on the provided reference images.
7. **Refinement:** Ensure smooth performance (requestAnimationFrame), image preloading strategies, and responsiveness across devices.
