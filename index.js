// ============================================
// GEOMETRY CONSTRAINT EXPLORER
// Multi-shape support with dynamic sliders
// ============================================

console.log('📄 index.js loading...');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const generateBtn = document.getElementById('generateBtn');
const outputContainer = document.getElementById('outputContainer');
const constraintSummary = document.getElementById('constraintSummary');
const shapeSelector = document.getElementById('shapeSelector');
const shapeControls = document.getElementById('shapeControls');

console.log('✅ DOM elements loaded:', {
    canvas: !!canvas,
    generateBtn: !!generateBtn,
    outputContainer: !!outputContainer,
    constraintSummary: !!constraintSummary,
    shapeSelector: !!shapeSelector,
    shapeControls: !!shapeControls
});

// Shape parameter definitions
const shapeParams = {
    polygon: {
        label: 'Regular Polygon',
        controls: `
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Number of Sides</label>
                <div class="slider-row">
                    <input type="range" id="sides" min="3" max="20" step="1" value="5" class="w-full">
                    <input type="number" id="sidesNum" min="3" max="20" step="1" value="5" class="slider-input">
                </div>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Rotation</label>
                <div class="slider-row">
                    <input type="range" id="rotation" min="0" max="360" step="1" value="0" class="w-full">
                    <input type="number" id="rotationNum" min="0" max="360" step="1" value="0" class="slider-input">
                </div>
            </div>
        `
    },
    rectangle: {
        label: 'Rectangle',
        controls: `
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Width (pixels)</label>
                <div class="slider-row">
                    <input type="range" id="width" min="20" max="300" step="10" value="150" class="w-full">
                    <input type="number" id="widthNum" min="20" max="300" step="10" value="150" class="slider-input">
                </div>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Height (pixels)</label>
                <div class="slider-row">
                    <input type="range" id="height" min="20" max="300" step="10" value="100" class="w-full">
                    <input type="number" id="heightNum" min="20" max="300" step="10" value="100" class="slider-input">
                </div>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Rotation</label>
                <div class="slider-row">
                    <input type="range" id="rotation" min="0" max="360" step="1" value="0" class="w-full">
                    <input type="number" id="rotationNum" min="0" max="360" step="1" value="0" class="slider-input">
                </div>
            </div>
        `
    },
    ellipse: {
        label: 'Ellipse',
        controls: `
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">X-Radius</label>
                <div class="slider-row">
                    <input type="range" id="radiusX" min="10" max="200" step="5" value="100" class="w-full">
                    <input type="number" id="radiusXNum" min="10" max="200" step="5" value="100" class="slider-input">
                </div>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Y-Radius</label>
                <div class="slider-row">
                    <input type="range" id="radiusY" min="10" max="200" step="5" value="60" class="w-full">
                    <input type="number" id="radiusYNum" min="10" max="200" step="5" value="60" class="slider-input">
                </div>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Rotation</label>
                <div class="slider-row">
                    <input type="range" id="rotation" min="0" max="360" step="1" value="0" class="w-full">
                    <input type="number" id="rotationNum" min="0" max="360" step="1" value="0" class="slider-input">
                </div>
            </div>
        `
    },
    star: {
        label: 'Star',
        controls: `
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Points</label>
                <div class="slider-row">
                    <input type="range" id="points" min="3" max="12" step="1" value="5" class="w-full">
                    <input type="number" id="pointsNum" min="3" max="12" step="1" value="5" class="slider-input">
                </div>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Outer Radius</label>
                <div class="slider-row">
                    <input type="range" id="outerRadius" min="30" max="200" step="5" value="100" class="w-full">
                    <input type="number" id="outerRadiusNum" min="30" max="200" step="5" value="100" class="slider-input">
                </div>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Inner Radius</label>
                <div class="slider-row">
                    <input type="range" id="innerRadius" min="10" max="100" step="5" value="40" class="w-full">
                    <input type="number" id="innerRadiusNum" min="10" max="100" step="5" value="40" class="slider-input">
                </div>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Rotation</label>
                <div class="slider-row">
                    <input type="range" id="rotation" min="0" max="360" step="1" value="0" class="w-full">
                    <input type="number" id="rotationNum" min="0" max="360" step="1" value="0" class="slider-input">
                </div>
            </div>
        `
    },
    circle: {
        label: 'Circle',
        controls: `
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Radius</label>
                <div class="slider-row">
                    <input type="range" id="radius" min="20" max="200" step="5" value="80" class="w-full">
                    <input type="number" id="radiusNum" min="20" max="200" step="5" value="80" class="slider-input">
                </div>
            </div>
        `
    },
    spiral: {
        label: 'Spiral',
        controls: `
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Number of Turns</label>
                <div class="slider-row">
                    <input type="range" id="turns" min="1" max="10" step="0.5" value="3" class="w-full">
                    <input type="number" id="turnsNum" min="1" max="10" step="0.5" value="3" class="slider-input">
                </div>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Spacing Between Arms</label>
                <div class="slider-row">
                    <input type="range" id="spacing" min="5" max="50" step="1" value="15" class="w-full">
                    <input type="number" id="spacingNum" min="5" max="50" step="1" value="15" class="slider-input">
                </div>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Starting Radius</label>
                <div class="slider-row">
                    <input type="range" id="startRadius" min="5" max="100" step="5" value="20" class="w-full">
                    <input type="number" id="startRadiusNum" min="5" max="100" step="5" value="20" class="slider-input">
                </div>
            </div>
        `
    }
};

// Initialize shape controls
function initializeShapeControls() {
    const shape = shapeSelector.value;
    shapeControls.innerHTML = shapeParams[shape].controls;
    attachSliderListeners();
    updateConstraintSummary();
}

// Attach slider/input synchronization listeners
function attachSliderListeners() {
    // Universal sliders
    ['posX', 'posY', 'scale'].forEach(id => {
        const slider = document.getElementById(id);
        const input = document.getElementById(id + 'Num');
        if (slider && input) {
            slider.addEventListener('input', () => {
                input.value = slider.value;
                updateConstraintSummary();
            });
            input.addEventListener('input', () => {
                slider.value = input.value;
                updateConstraintSummary();
            });
        }
    });

    // Shape-specific sliders
    const shape = shapeSelector.value;
    const paramIds = getParamIdsForShape(shape);
    paramIds.forEach(id => {
        const slider = document.getElementById(id);
        const input = document.getElementById(id + 'Num');
        if (slider && input) {
            slider.addEventListener('input', () => {
                input.value = slider.value;
                updateConstraintSummary();
            });
            input.addEventListener('input', () => {
                slider.value = input.value;
                updateConstraintSummary();
            });
        }
    });
}

function getParamIdsForShape(shape) {
    const paramMap = {
        polygon: ['sides', 'rotation'],
        rectangle: ['width', 'height', 'cornerRadius', 'rotation'],
        ellipse: ['radiusX', 'radiusY', 'rotation'],
        star: ['points', 'outerRadius', 'innerRadius', 'rotation'],
        circle: ['radius'],
        spiral: ['turns', 'spacing', 'startRadius']
    };
    return paramMap[shape] || [];
}

// Generate human-readable constraint summary
function updateConstraintSummary() {
    const shape = shapeSelector.value;
    const posX = document.getElementById('posXNum').value;
    const posY = document.getElementById('posYNum').value;
    const scale = document.getElementById('scaleNum').value;
    const symmetry = document.getElementById('symmetryNum').value;

    let shapeSummary = '';

    switch (shape) {
        case 'polygon':
            const sides = document.getElementById('sidesNum')?.value || 5;
            const rotation = document.getElementById('rotationNum')?.value || 0;
            shapeSummary = `A ${sides}-sided regular polygon, rotated ${rotation}°`;
            break;
        case 'rectangle':
            const width = document.getElementById('widthNum')?.value || 150;
            const height = document.getElementById('heightNum')?.value || 100;
            const corner = document.getElementById('cornerRadiusNum')?.value || 0;
            shapeSummary = `A ${width}×${height} rectangle with ${corner}px corner radius`;
            break;
        case 'ellipse':
            const rx = document.getElementById('radiusXNum')?.value || 100;
            const ry = document.getElementById('radiusYNum')?.value || 60;
            shapeSummary = `An ellipse with radii (${rx}, ${ry})`;
            break;
        case 'star':
            const points = document.getElementById('pointsNum')?.value || 5;
            const outer = document.getElementById('outerRadiusNum')?.value || 100;
            const inner = document.getElementById('innerRadiusNum')?.value || 40;
            shapeSummary = `A ${points}-pointed star with outer radius ${outer}, inner radius ${inner}`;
            break;
        case 'circle':
            const radius = document.getElementById('radiusNum')?.value || 80;
            shapeSummary = `A circle with radius ${radius}`;
            break;
        case 'spiral':
            const turns = document.getElementById('turnsNum')?.value || 3;
            const spacing = document.getElementById('spacingNum')?.value || 15;
            shapeSummary = `A spiral with ${turns} turns, ${spacing}px spacing`;
            break;
    }

    const summary = `${shapeSummary}, centered at (${posX}, ${posY}), scaled ${scale}×.`;

    constraintSummary.innerHTML = `<p class="text-sm text-gray-700 font-mono">${summary}</p>`;
}

// Shape selector change
shapeSelector.addEventListener('change', initializeShapeControls);

// Generate button
generateBtn.addEventListener('click', async () => {
    console.log('🎯 Generate button clicked!');
    console.log('Button element:', generateBtn);
    
    try {
        const shape = shapeSelector.value;
        const posX = parseInt(document.getElementById('posXNum').value);
        const posY = parseInt(document.getElementById('posYNum').value);
        const scale = parseFloat(document.getElementById('scaleNum').value);
        const symmetry = 1;

        console.log('✅ Collected params:', { shape, posX, posY, scale, symmetry });

        // Collect shape-specific params
        const shapeParams_ = {};
        const paramIds = getParamIdsForShape(shape);
        console.log('📍 Param IDs for shape:', paramIds);
        
        paramIds.forEach(id => {
            const input = document.getElementById(id + 'Num');
            if (input) {
                shapeParams_[id] = isNaN(parseFloat(input.value)) ? input.value : parseFloat(input.value);
                console.log(`  ${id}:`, shapeParams_[id]);
            } else {
                console.warn(`  ⚠️ Input ${id}Num not found`);
            }
        });

        const payload = {
            shape,
            posX,
            posY,
            scale,
            symmetry,
            ...shapeParams_
        };
        
        console.log('📤 Sending payload:', JSON.stringify(payload, null, 2));
        outputContainer.innerHTML = '<p class="text-blue-600">🔄 Interpreting geometric constraints...</p>';

        const response = await fetch('http://localhost:3000/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log('📨 Response status:', response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Response data:', data);

        if (!data.success) {
            throw new Error(data.error || 'Unknown error from server');
        }

        console.log('🎨 Rendering shape...');
        displayStory(data.contract);
        const translated = translateOutput(data.contract);
        renderShape(translated);
        displaySuccess(translated);
        console.log('✨ Success!');

    } catch (error) {
        console.error('❌ Error caught:', error);
        console.error('Stack:', error.stack);
        handleFailure(error);
    }
});

// Translate and validate output
function translateOutput(contractData) {
    // Basic validation
    if (!contractData.color) {
        contractData.color = 'hsl(200, 80%, 50%)';
    }
    return contractData;
}

// Draw grid and axes
function drawGrid() {
    const margin = 40;
    const dataWidth = 500;
    const dataHeight = 500;
    const startX = margin;
    const startY = margin;
    const centerX = startX + dataWidth / 2;
    const centerY = startY + dataHeight / 2;
    const gridSize = dataWidth / 20; // Each unit = 25 pixels (500/20)
    
    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    for (let i = -10; i <= 10; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(centerX + i * gridSize, startY);
        ctx.lineTo(centerX + i * gridSize, startY + dataHeight);
        ctx.stroke();
        
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(startX, centerY - i * gridSize);
        ctx.lineTo(startX + dataWidth, centerY - i * gridSize);
        ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    
    // X axis
    ctx.beginPath();
    ctx.moveTo(startX, centerY);
    ctx.lineTo(startX + dataWidth, centerY);
    ctx.stroke();
    
    // Y axis
    ctx.beginPath();
    ctx.moveTo(centerX, startY);
    ctx.lineTo(centerX, startY + dataHeight);
    ctx.stroke();
    
    // Draw axis labels outside the canvas
    ctx.fillStyle = '#333333';
    ctx.font = '12px Arial';
    
    // X axis labels (bottom, outside)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = -10; i <= 10; i += 2) {
        const x = centerX + i * gridSize;
        ctx.fillText(i.toString(), x, startY + dataHeight + 8);
    }
    
    // Y axis labels (left, outside)
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = -10; i <= 10; i += 2) {
        const y = centerY - i * gridSize;
        ctx.fillText(i.toString(), startX - 8, y);
    }
}

// Render shape on canvas
function renderShape(params) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    const margin = 40;
    const dataWidth = 500;
    const centerX = margin + dataWidth / 2;
    const centerY = margin + dataWidth / 2;

    renderShapeInstance(params, centerX, centerY, 0);
}

function renderShapeInstance(params, centerX, centerY, rotationOffset) {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotationOffset);

    ctx.fillStyle = params.color || 'hsl(200, 80%, 50%)';
    ctx.strokeStyle = params.color || 'hsl(200, 80%, 50%)';
    ctx.lineWidth = 2;

    const shape = shapeSelector.value;
    const gridSize = 25; // pixels per grid unit (500/20)
    const posXUnits = parseInt(document.getElementById('posXNum').value);
    const posYUnits = parseInt(document.getElementById('posYNum').value);
    const scale = parseFloat(document.getElementById('scaleNum').value);

    // Convert grid units to pixel coordinates
    const posX = posXUnits * gridSize;
    const posY = -posYUnits * gridSize; // negate Y because canvas Y increases downward

    ctx.translate(posX, posY);
    ctx.scale(scale, scale);

    switch (shape) {
        case 'polygon':
            const sides = parseInt(document.getElementById('sidesNum')?.value || 5);
            const rot = parseInt(document.getElementById('rotationNum')?.value || 0);
            drawPolygon(0, 0, 80, sides, rot);
            break;
        case 'rectangle':
            const w = parseInt(document.getElementById('widthNum')?.value || 150);
            const h = parseInt(document.getElementById('heightNum')?.value || 100);
            const corner = parseInt(document.getElementById('cornerRadiusNum')?.value || 0);
            drawRoundedRect(-w / 2, -h / 2, w, h, corner);
            break;
        case 'ellipse':
            const rx = parseInt(document.getElementById('radiusXNum')?.value || 100);
            const ry = parseInt(document.getElementById('radiusYNum')?.value || 60);
            ctx.beginPath();
            ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'star':
            const points = parseInt(document.getElementById('pointsNum')?.value || 5);
            const outer = parseInt(document.getElementById('outerRadiusNum')?.value || 100);
            const inner = parseInt(document.getElementById('innerRadiusNum')?.value || 40);
            drawStar(0, 0, points, outer, inner);
            break;
        case 'circle':
            const radius = parseInt(document.getElementById('radiusNum')?.value || 80);
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'spiral':
            const turns = parseFloat(document.getElementById('turnsNum')?.value || 3);
            const spacing = parseInt(document.getElementById('spacingNum')?.value || 15);
            const startRad = parseInt(document.getElementById('startRadiusNum')?.value || 20);
            drawSpiral(0, 0, startRad, spacing, turns);
            break;
    }

    ctx.restore();
}

function drawPolygon(cx, cy, radius, sides, rotation) {
    const angleStep = (Math.PI * 2) / sides;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        const angle = i * angleStep + (rotation * Math.PI / 180);
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
}

function drawRoundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    
    // If radius is 0 or very small, draw a sharp-cornered rectangle
    if (radius <= 0) {
        ctx.rect(x, y, width, height);
    } else {
        // Draw rounded corners
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
    }
    
    ctx.closePath();
    ctx.fill();
}

function drawStar(cx, cy, points, outer, inner) {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
        const angle = (i * Math.PI) / points;
        const radius = i % 2 === 0 ? outer : inner;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
}

function drawSpiral(cx, cy, startRad, spacing, turns) {
    ctx.beginPath();
    const totalPoints = turns * 50;
    for (let i = 0; i < totalPoints; i++) {
        const angle = (i / totalPoints) * turns * Math.PI * 2;
        const radius = startRad + (i / totalPoints) * spacing * turns;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
}

function displayRawResponse(rawData) {
    const section = document.createElement('div');
    section.className = 'bg-blue-50 border-l-4 border-blue-600 p-4 rounded mt-4';
    section.innerHTML = `
        <h3 class="font-bold text-blue-900 mb-2">📊 Model Response</h3>
        <pre class="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-auto">${JSON.stringify(rawData, null, 2)}</pre>
    `;
    outputContainer.appendChild(section);
}

function displayStory(contract) {
    const section = document.createElement('div');
    section.className = 'mt-4';
    
    // Story card with enhanced styling
    const storyCard = document.createElement('div');
    storyCard.className = 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow';
    
    // Title with emoji
    const title = document.createElement('h3');
    title.className = 'text-2xl font-bold text-blue-900 mb-1 flex items-center gap-2';
    title.innerHTML = '📖 <span>The Shape\'s Tale</span>';
    storyCard.appendChild(title);
    
    // Decorative line
    const divider = document.createElement('div');
    divider.className = 'h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mb-4';
    storyCard.appendChild(divider);
    
    // Story text with enhanced typography
    const storyText = document.createElement('p');
    storyText.className = 'text-blue-900 text-lg leading-relaxed mb-4 font-medium';
    storyText.style.lineHeight = '1.8';
    
    // Format the story text with *bold* and _italic_ markers
    let formattedText = contract.interpretation || 'No story generated';
    formattedText = formattedText
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-blue-950">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic text-blue-800">$1</em>')
        .replace(/___(.*?)___/g, '<u class="underline decoration-wavy decoration-blue-400">$1</u>')
        .replace(/__(.*?)__/g, '<u class="underline">$1</u>');
    
    storyText.innerHTML = formattedText;
    storyCard.appendChild(storyText);
    
    // Fun fact section
    const factSection = document.createElement('div');
    factSection.className = 'bg-white rounded-lg border-l-4 border-indigo-500 p-4 mt-4';
    
    const factTitle = document.createElement('p');
    factTitle.className = 'text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-1';
    factTitle.textContent = '💡 Mathematical Fun Fact';
    factSection.appendChild(factTitle);
    
    const factText = document.createElement('div');
    factText.className = 'text-indigo-900 text-sm leading-relaxed font-medium';
    
    // Format the fact text with markdown-style markers
    let formattedFact = contract.notes || 'Discover geometric insights...';
    formattedFact = formattedFact
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-indigo-950">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic text-indigo-800">$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-indigo-100 px-1.5 py-0.5 rounded font-mono text-xs text-indigo-950">$1</code>')
        .replace(/_(.*?)_/g, '<u class="underline decoration-indigo-400">$1</u>')
        .replace(/√/g, '<span class="font-serif">√</span>')
        .replace(/°/g, '<span class="font-serif">°</span>')
        .replace(/π/g, '<span class="font-serif italic">π</span>')
        .replace(/∑/g, '<span class="font-serif text-lg">∑</span>');
    
    factText.innerHTML = formattedFact;
    factSection.appendChild(factText);
    
    storyCard.appendChild(factSection);
    
    // Color preview badge
    if (contract.color) {
        const colorSection = document.createElement('div');
        colorSection.className = 'flex items-center gap-2 mt-4 p-3 bg-gray-50 rounded';
        
        const colorBox = document.createElement('div');
        colorBox.style.backgroundColor = contract.color;
        colorBox.className = 'w-8 h-8 rounded-lg border-2 border-gray-300 shadow';
        colorSection.appendChild(colorBox);
        
        const colorLabel = document.createElement('span');
        colorLabel.className = 'text-xs font-semibold text-gray-600 uppercase';
        colorLabel.textContent = `Color: ${contract.color}`;
        colorSection.appendChild(colorLabel);
        
        storyCard.appendChild(colorSection);
    }
    
    section.appendChild(storyCard);
    outputContainer.appendChild(section);
}

function displaySuccess(translated) {
    const section = document.createElement('div');
    section.className = 'bg-green-50 border-l-4 border-green-600 p-4 rounded mt-4';
    section.innerHTML = `
        <h3 class="font-bold text-green-900 mb-2">✅ Constraints Applied</h3>
        <pre class="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-auto">${JSON.stringify(translated, null, 2)}</pre>
    `;
    outputContainer.appendChild(section);
}

function handleFailure(error) {
    const section = document.createElement('div');
    section.className = 'bg-red-50 border-l-4 border-red-600 p-4 rounded mt-4';
    section.innerHTML = `
        <h3 class="font-bold text-red-900 mb-2">❌ Generation Failed</h3>
        <p class="text-red-800">${error.message}</p>
    `;
    outputContainer.innerHTML = section.outerHTML;
}

// Initialize
initializeShapeControls();
console.log('✨ Geometry Constraint Explorer initialized and ready!');
