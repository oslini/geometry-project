<!---
Renee Burns
MSTU 5010
-->

# Mini-Project: Geometry Shape Generator

**Keyword:** Geometry

---

## Project Overview

This project explores how boundaries shape model behavior through the lens of geometry. The system creates a boundary loop where user input → model constraints → deterministic visual output.

**Theme:** How geometric constraints (shape, size, rotation) mirror the boundaries we place on AI systems.

---

## Installation & How to Run

### Prerequisites
- **Node.js 18 or higher** — [Download here](https://nodejs.org/)
  - Verify installation: `node --version` in terminal

### Installation from ZIP File

1. **Extract the ZIP**
   - Download `geometry-project.zip`
   - Extract/unzip to your desired location
   - You should have a folder named `geometry-project/` with the following files:
     ```
     geometry-project/
     ├── index.html
     ├── index.js
     ├── server.js
     ├── package.json
     └── README.md
     ```

2. **Install Dependencies**
   ```bash
   # Navigate to the project folder
   cd /path/to/geometry-project
   
   # Install Node.js packages
   npm install
   ```

3. **Start the Server**
   ```bash
   # Run the Express server
   npm start
   
   # Or alternatively:
   node server.js
   
   # Server will start on http://localhost:3000
   ```

4. **Open in Browser**
   - Open your web browser
   - Navigate to `http://localhost:3000`
   - You should see the Geometry Shape Generator interface

### Troubleshooting Installation

**"Command not found: node"**
- Node.js is not installed. Download and install from [nodejs.org](https://nodejs.org/)

**"Port 3000 already in use"**
```bash
# Find and stop the process using port 3000
lsof -i :3000
kill -9 <PID>

# Or kill all node processes
pkill -f node
```

**"npm: command not found"**
- npm comes with Node.js. Reinstall Node.js completely.

**"Cannot find module 'express'"**
- Dependencies not installed. Run `npm install` in the project directory.

### Optional: Running with LM Studio

To use the optional LM Studio integration for enhanced story generation:

1. **Install LM Studio**
   - Download from [lmstudio.ai](https://lmstudio.ai)
   - Install and launch the application

2. **Load the Model**
   - Open LM Studio
   - Search for `mistralai/ministral-3-3b`
   - Click "Download" to pull the model (~3GB)
   - Wait for download to complete

3. **Configure & Start Local Server**
   - Go to **Developer** tab in LM Studio
   - Select `mistralai/ministral-3-3b` from the dropdown
   - Set **Temperature** to a value between 5 and 7 (higher = more creative)
     ```
     Temperature: 6 (recommended for sassy, creative stories)
     ```
   - Click **Start Server**
   - You should see: "Server is running on http://localhost:1234"

4. **Verify Connection**
   - The geometry project will automatically detect LM Studio on startup
   - If LM Studio is running, it will use the model for story generation
   - If LM Studio is unavailable, it falls back to procedural generation automatically
   - Check server logs to see which mode is active

**Note:** Temperature controls creativity:
- Lower values (5) = more predictable, consistent stories
- Higher values (7) = more random, wild, creative interpretations
- Adjust based on desired personality level

---

## Part 1: Input Experience ✏️

### Input Design
- **Form Controls:**
  - Shape Type dropdown: `circle`, `rectangle`, `triangle`, `star`
  - Complexity slider: 1–10 (controls generated shape size)
  - Color Hue slider: 0–360° (HSL color space)

- **Boundary Lever:** System prompt requiring strict JSON output
  - `"You are a geometry engine. Return ONLY valid JSON matching this schema."`
  - Forces the model to stay within contract bounds
  - Reduces prose/explanation text

### Why This Matters
The form prevents free-text input and instead creates discrete, normalized parameters. This reduces entropy in what the user can ask, making the model's job clearer and output more predictable.

**Expected Outcome:** User has precise control over shape generation through constrained inputs.

---

## Part 2: Black Box Understanding 🔬

### Evidence Collection
To understand model behavior, we inspect:
1. **Raw JSON response** from the model call
2. **Contract validation** — does it match the schema?
3. **Failure modes** — what happens when model drifts?

### What We Learned
- **Model Compliance:** When given explicit JSON contract, models (especially smaller ones) sometimes include extra explanation text instead of pure JSON.
- **Normalization:** The wrapper must normalize fields (e.g., validate shape is one of allowed values).
- **Size Drift:** Models often generate values outside expected ranges (e.g., size > 300).

### Observation Example
```json
{
  "rawRequest": {
    "shape": "circle",
    "complexity": 7,
    "colorHue": 180
  },
  "rawResponse": {
    "shape": "circle",
    "color": "hsl(180, 85%, 50%)",
    "size": 175,
    "rotation": 45,
    "message": "Generated a vibrant cyan circle with moderate rotation"
  }
}
```

---

## Part 3: Output Translation 🎨

### Output Contract
```json
{
  "shape": "circle|rectangle|triangle|star",
  "color": "hsl(h, s%, l%)",
  "size": 10–300,
  "rotation": 0–360,
  "message": "string"
}
```

### Deterministic Action
The JSON contract is translated to canvas rendering:
- **Route on:** `shape` field determines which geometry to draw
- **Success:** Canvas displays the requested shape with exact parameters
- **Translation:** Each JSON field maps directly to canvas API calls

### Failure Handling: Reject (Fail Closed)

**Failure Case Example:**
```
User Input: shape=circle, complexity=5
Model Returns: { "shape": "hexagon", "size": 500, ... }
```

**Policy Choice:** **REJECT**
- `hexagon` is not in allowed shapes → error thrown
- `size: 500` exceeds maximum (300) → would be clamped
- Rather than silently normalizing both issues, we reject and show user the error
- **Rationale:** Transparency. User sees exact validation failure, not a silently-altered render

**Error Display:**
```
❌ Generation Failed
Error: Missing required fields: shape, color
Policy: This failure was caught and rejected. The canvas was not updated.
```

---

## Challenges & Learnings 📝

### Challenge 1: JSON Compliance
Models don't always return pure JSON when asked. Some include markdown code fences or explanatory text. The wrapper must detect and handle this.

### Challenge 2: Value Ranges
Models generate plausible but out-of-range values (e.g., `size: 1000` for a 400px canvas). Clamping is necessary but changes intent.

### Challenge 3: Required Fields
Not all models reliably include every contract field. The wrapper must enforce presence or provide sensible defaults.

---

## Reflection Question

**How might this boundary loop reveal something about human behavior or design?**

Geometry fundamentally constrains space and possibility. By forcing both user and model through strict geometric parameters, we're modeling how **constraints enable communication**. Neither human nor AI can be completely free—boundaries are how we understand each other. The shapes that emerge aren't "true" or "complete" but are *tractable* and *shared*. This mirrors language itself: we give up infinite expressiveness for finite, verifiable meaning.

---

## Files

- `index.html` — UI with form controls and canvas
- `index.js` — Client-side shape generation, validation, rendering
- `README.md` — This file

## Architecture

### System Flow
```
User selects shape + constraints
           ↓
Client sends POST /generate with shape params
           ↓
Server attempts LM Studio connection
           ↓
    ├─ Success: Parse LLM response
    └─ Failure: Use procedural fallback ✓ (Current Implementation)
           ↓
Generate sassy, constraint-aware story
           ↓
Return JSON: { color, interpretation, notes }
           ↓
Client renders shape with generated story
```

### Current Implementation Features

**Constraint-Aware Stories:**
- Stories reference actual user parameters (number of sides, dimensions, rotation angles)
- Dynamic templates that change based on shape type and specific values
- Example: "A 5-sided polygon... with (5-2)×180° worth of interior angles"

**Sassy Personality:**
- Random sassy phrases injected into narratives
- Shape personification with attitude and character
- Creative mathematical commentary

**Color Generation:**
- Random HSL colors for visual variety
- Hue: 0-360°, Saturation: 60-90%, Lightness: 45-65%
- Ensures vibrant, readable colors on canvas

**Geometric Facts:**
- Each shape type includes accurate mathematical facts
- Randomly selected from a pool per shape
- Educational + entertaining combination

---

## To Run

### Prerequisites
- Node.js 18+ (for native fetch support)
- LM Studio (optional—procedural fallback works without it)

### Setup & Start
```bash
cd /Users/angelarenee/Documents/Class/MSTU\ 5010/geometry-project

# Start the Express server
node server.js

# Server runs on http://localhost:3000
# Open browser to http://localhost:3000
```

### API Endpoint
```
POST /generate

Request body:
{
  "shape": "circle|polygon|rectangle|ellipse|star|spiral",
  "posX": 200,
  "posY": 200,
  "scale": 1,
  "symmetry": 6,
  
  // Shape-specific parameters:
  // polygon: { sides, rotation }
  // rectangle: { width, height, cornerRadius, rotation }
  // ellipse: { radiusX, radiusY, rotation }
  // star: { points, outerRadius, innerRadius, rotation }
  // circle: { radius }
  // spiral: { turns, spacing, startRadius }
}

Response:
{
  "color": "hsl(240, 75%, 55%)",
  "interpretation": "Your sassy story here...",
  "notes": "Mathematical fact about the shape"
}
```

## Troubleshooting

**LM Studio Error: "Attempt to pull a snapshot of system resources failed"**
- This is an LM Studio application issue, not code-related
- Server will automatically use procedural fallback (no action needed)
- Restart LM Studio if you want to re-enable it

**Server won't start**
- Check if port 3000 is already in use: `lsof -i :3000`
- Kill process if needed: `pkill -f "node server.js"`
- Ensure Node.js 18+ is installed: `node --version`

---

## Next Steps
- Implement two-model comparison (small vs. large) for black box inspection
- Add more failure cases (timeout, rate limiting, parsing errors)
- Visualize parameter drift by comparing 10 runs of same input
- Create gallery view showing story + geometry + color combinations
- Add audio narration for stories (text-to-speech)

---

**Status:** MVP Complete — Constraint-aware story generation working  
**Keyword:** geometry  
**Last Updated:** Feb 24, 2026
