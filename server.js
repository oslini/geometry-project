const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

const systemPrompt = `You are a sassy geometric storyteller with attitude! Create an EDUCATIONAL YET QUIRKY SHORT STORY about a shape as a CHARACTER with SASS and personality.

**CRITICAL: RESPOND WITH ONLY A JSON OBJECT. NOTHING ELSE.**

Format:
\`\`\`json
{
  "color": "#FF5733",
  "interpretation": "Percy the Pentagon walked in with those *five* sides, acting like he invented symmetry itself! 'My angles sum to 540 degrees,' he bragged. A smug little triangle overheard and said, 'Cool story, bro—literally every pentagon brags about that.' Percy learned that being geometric doesn't make you special, hunty.",
  "notes": "The interior angles of a regular pentagon always sum to **(n-2) × 180° = (5-2) × 180° = 540°**. Each interior angle measures **108°**."
}
\`\`\`

**REQUIREMENTS:**
1. "interpretation" MUST be ONE TEXT STRING - a 2-3 sentence SASSY story (NOT a JSON object, NOT an array)
2. Personify the shape as a character with SASS, attitude, and personality
3. Reference the specific constraints (size, position, rotation, symmetry, sides, etc.) from the user's input
4. Include sarcasm, wit, or dramatic flair—this shape has OPINIONS
5. Teach one geometric fact in the story
6. "notes" MUST be a FACTUAL, OBJECTIVE mathematical statement about the shape - include the formula and calculations, use **bold** for important values
7. "color" is a CSS color code
8. Use phrases like 'hunty', 'bestie', 'literally', dramatic exaggerations, or sass
9. Return ONLY the JSON object in your response - no other text`;

const buildConstraint = (shape, params) => {
  const base = `centered at (${params.posX}, ${params.posY}), scaled ${params.scale}x, with ${params.symmetry}-fold symmetry`;
  
  switch(shape) {
    case 'polygon':
      return `Generate a ${params.sides}-sided regular polygon, ${base}, rotated ${params.rotation}°.`;
    case 'rectangle':
      return `Generate a rectangle ${params.width}×${params.height}px with ${params.cornerRadius}px radius, ${base}, rotated ${params.rotation}°.`;
    case 'ellipse':
      return `Generate an ellipse with radii (${params.radiusX}, ${params.radiusY}), ${base}, rotated ${params.rotation}°.`;
    case 'star':
      return `Generate a ${params.points}-pointed star (outer ${params.outerRadius}, inner ${params.innerRadius}), ${base}, rotated ${params.rotation}°.`;
    case 'circle':
      return `Generate a circle with radius ${params.radius}, ${base}.`;
    case 'spiral':
      return `Generate a spiral with ${params.turns} turns, ${params.spacing}px spacing, starting at ${params.startRadius}, ${base}.`;
    default:
      return `Generate a geometric shape: ${shape}`;
  }
};

app.post('/generate', async (req, res) => {
  try {
    const { shape, posX, posY, scale, symmetry, ...shapeParams } = req.body;
    
    if (!shape) {
      return res.status(400).json({ success: false, error: 'Shape required' });
    }

    const constraint = buildConstraint(shape, { posX, posY, scale, symmetry, ...shapeParams });
    
    console.log('Sending to LM Studio:', constraint);
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    
    try {
      const response = await fetch('http://127.0.0.1:1234/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'mistralai/ministral-3-3b',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: constraint }
          ],
          temperature: 0.7,
          max_tokens: 500,
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "GeometryStory",
              schema: {
                type: "object",
                properties: {
                  color: {
                    type: "string",
                    description: "CSS color code or color name"
                  },
                  interpretation: {
                    type: "string",
                    description: "2-3 sentence quirky story about the shape as a character with a geometric lesson"
                  },
                  notes: {
                    type: "string",
                    description: "One mathematical fun fact about this shape"
                  }
                },
                required: ["color", "interpretation", "notes"],
                additionalProperties: false
              }
            }
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        console.error('LM Studio response error:', response.status);
        throw new Error(`LM Studio error: ${response.status}`);
      }

      const apiData = await response.json();
      console.log('LM Studio response:', JSON.stringify(apiData, null, 2));
      
      const messageContent = apiData.choices[0].message.content;
      console.log('Raw model response:', messageContent);

      // Try to parse as JSON first
      let contract;
      try {
        // Remove markdown code blocks if present
        const jsonString = messageContent.replace(/```json\n?|\n?```/g, '').trim();
        const parsed = JSON.parse(jsonString);
        contract = {
          color: parsed.color || '#7B68EE',
          interpretation: parsed.interpretation || 'A mysterious geometric shape awaits your discovery.',
          notes: parsed.notes || 'Every shape holds geometric secrets.'
        };
      } catch (parseError) {
        console.warn('Failed to parse JSON, trying labeled format:', parseError.message);
        
        // Fallback to labeled format: STORY: ... FACT: ... COLOR: ...
        const storyMatch = messageContent.match(/STORY:\s*(.+?)(?=FACT:|$)/is);
        const factMatch = messageContent.match(/FACT:\s*(.+?)(?=COLOR:|$)/is);
        const colorMatch = messageContent.match(/COLOR:\s*(.+?)$/is);

        let story = storyMatch ? storyMatch[1].trim() : '';
        let fact = factMatch ? factMatch[1].trim() : '';
        let colorRaw = colorMatch ? colorMatch[1].trim() : '#7B68EE';

        // Extract just the color code, removing any descriptions in parentheses
        // Matches: #RRGGBB, rgb(...), hsl(...), or color names
        const colorCodeMatch = colorRaw.match(/^(#[0-9A-Fa-f]{3,6}|rgb\([^)]+\)|hsl\([^)]+\)|[a-zA-Z]+)/);
        let color = colorCodeMatch ? colorCodeMatch[1] : '#7B68EE';

        contract = {
          color: color || '#7B68EE',
          interpretation: story || 'A mysterious geometric shape awaits your discovery.',
          notes: fact || 'Every shape holds geometric secrets.'
        };
      }

      console.log('Parsed contract:', contract);

      console.log('Sending response:', { success: true, contract });
      
      return res.json({
        success: true,
        rawResponse: apiData.choices[0].message,
        contract: contract
      });
    } catch (fetchError) {
      clearTimeout(timeout);
      console.error('LM Studio connection error:', fetchError.message);
      
      // Fallback response when LM Studio is unavailable
      const fallbackColor = `hsl(${Math.random() * 360}, 80%, 50%)`;
      const fallbackContract = {
        color: fallbackColor,
        interpretation: `${shape} interpreted as a ${symmetry}-fold symmetric form`,
        notes: 'LM Studio unavailable - using procedural generation'
      };
      
      return res.json({
        success: true,
        rawResponse: { content: 'Fallback mode' },
        contract: fallbackContract
      });
    }

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🎨 Server running on http://localhost:${PORT}`);
  console.log(`📡 Connecting to LM Studio at http://127.0.0.1:1234`);
});
