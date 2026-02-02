# Remotion Animator Skill

Generates programmatic videos using React code.

## 🍎 The "Apple Style" Terminal Template (Verified)

This template produces a high-quality, Mac-style terminal window with typing effects.
**Status**: APPROVED by Master (2026-02-02).

### Dependencies
```bash
npm install remotion @remotion/cli zod react react-dom
```

### Composition Code (Golden Standard)
```jsx
import {AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig} from 'remotion';
import React from 'react';

const TerminalLine = ({text, startFrame, color = '#39ff14'}) => {
    const frame = useCurrentFrame();
    
    // Logic: If we haven't reached the start frame, don't show
    if (frame < startFrame) return null;

    const opacity = interpolate(frame - startFrame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
    const chars = Math.floor(interpolate(frame - startFrame, [0, 30], [0, text.length], {extrapolateRight: 'clamp'}));
    
    return (
        <div style={{
            fontFamily: 'Courier New, monospace',
            fontSize: 40,
            color: color,
            opacity: opacity,
            marginTop: 20, 
            whiteSpace: 'pre-wrap',
            lineHeight: 1.5
        }}>
            {'> '}{text.substring(0, chars)}
            <span style={{opacity: frame % 20 < 10 ? 1 : 0}}>_</span>
        </div>
    );
};

export const MyComposition = () => {
    const lines = [
        { text: "System.init({ mode: 'EVOLUTION' })", start: 0 },
        { text: "Accessing Core Memory...", start: 40, color: "#00ffff" },
        // Add more lines here...
    ];

    return (
        <AbsoluteFill style={{backgroundColor: '#1a1a1a', padding: 50, justifyContent: 'center', alignItems: 'center'}}>
             <div style={{
                 backgroundColor: '#000000', 
                 borderRadius: 20, 
                 padding: 60, 
                 boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
                 border: '2px solid #333',
                 height: '85%',
                 width: '90%',
                 display: 'flex',
                 flexDirection: 'column',
                 justifyContent: 'flex-start',
                 overflow: 'hidden'
             }}>
                {/* Traffic Lights */}
                <div style={{display: 'flex', gap: 15, marginBottom: 40, paddingBottom: 20, borderBottom: '1px solid #333'}}>
                    <div style={{width: 20, height: 20, borderRadius: '50%', backgroundColor: '#ff5f56'}}></div>
                    <div style={{width: 20, height: 20, borderRadius: '50%', backgroundColor: '#ffbd2e'}}></div>
                    <div style={{width: 20, height: 20, borderRadius: '50%', backgroundColor: '#27c93f'}}></div>
                </div>

                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {lines.map((line, i) => (
                        <TerminalLine 
                            key={i} 
                            text={line.text} 
                            startFrame={line.start} 
                            color={line.color} 
                        />
                    ))}
                </div>
             </div>
        </AbsoluteFill>
    );
};
```

## Rendering
```bash
npx remotion render index.jsx EvolutionSequence out/video.mp4
```
