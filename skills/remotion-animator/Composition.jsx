import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence} from 'remotion';
import React from 'react';

const TerminalLine = ({text, color = '#39ff14'}) => {
    const frame = useCurrentFrame();
    
    // Typewriter effect: 30 frames duration
    // Best Practice: Use substring slicing
    const chars = Math.floor(interpolate(frame, [0, 30], [0, text.length], {
        extrapolateRight: 'clamp', 
        extrapolateLeft: 'clamp'
    }));
    
    // Cursor blinking effect (only active for first 45 frames of life)
    const showCursor = frame < 45 || (frame % 20 < 10 && frame < 60);
    
    return (
        <div style={{
            fontFamily: 'Courier New, monospace',
            fontSize: 32,
            color: color,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            textShadow: `0 0 5px ${color}80`
        }}>
            <span style={{marginRight: 10, opacity: 0.5}}>{'>'}</span>
            {text.substring(0, chars)}
            {showCursor && <span style={{opacity: 0.8, marginLeft: 5}}>_</span>}
        </div>
    );
};

export const MyComposition = () => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    const lines = [
        { text: "SYSTEM EVOLUTION REPORT [2026-02-02]", color: "#ffffff" },
        { text: "------------------------------------", color: "#555555" },
        { text: "🛡️ SECURITY: HARDENED", color: "#00ffff" },
        { text: "   - Fixed permission denied errors" },
        { text: "   - Patched sync.js race condition" },
        { text: "   - Safe Publishing enabled" },
        { text: "" },
        { text: "⚡ PERFORMANCE: BOOSTED", color: "#ff00ff" },
        { text: "   - Log parser: 1-pass (Fast!)" },
        { text: "   - IO: Tail-read optimization" },
        { text: "   - Auto-archived 246 logs" },
        { text: "" },
        { text: "🛠️ TOOLING: UPGRADED", color: "#ffff00" },
        { text: "   - Feishu Card: JSON/Dry-Run" },
        { text: "   - Git Sync: --force flag" },
        { text: "   - Cursor Agent: TTY Wrapper" },
        { text: "" },
        { text: "✅ SYSTEM STATUS: NOMINAL", color: "#00ff00" },
        { text: ">> END OF REPORT <<" },
    ];

    const LINE_HEIGHT = 60;
    const MAX_VISIBLE_LINES = 9;
    const LINE_DURATION = 15; // Fast typing per line
    
    // Calculate scroll position based on global frame
    const activeIndex = Math.floor(frame / LINE_DURATION);
    const targetScroll = Math.max(0, (activeIndex - MAX_VISIBLE_LINES + 2) * LINE_HEIGHT);

    const scrollSpring = spring({
        frame: frame,
        from: 0,
        to: targetScroll,
        fps,
        config: { damping: 200 } // Smooth no-bounce
    });

    return (
        <AbsoluteFill style={{backgroundColor: '#0a0a0a', padding: 50, justifyContent: 'center', alignItems: 'center'}}>
             <div style={{
                 backgroundColor: '#000000', 
                 borderRadius: 20, 
                 padding: '60px 40px',
                 boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
                 border: '1px solid #333',
                 height: '90%',
                 width: '90%',
                 display: 'flex',
                 flexDirection: 'column',
                 justifyContent: 'flex-start',
                 overflow: 'hidden', 
                 position: 'relative'
             }}>
                {/* Mac-style Header */}
                <div style={{
                    display: 'flex', gap: 12, marginBottom: 20, paddingBottom: 20, 
                    borderBottom: '1px solid #333', zIndex: 10, backgroundColor: '#000',
                    width: '100%', position: 'relative'
                }}>
                    <div style={{width: 16, height: 16, borderRadius: '50%', backgroundColor: '#ff5f56'}}></div>
                    <div style={{width: 16, height: 16, borderRadius: '50%', backgroundColor: '#ffbd2e'}}></div>
                    <div style={{width: 16, height: 16, borderRadius: '50%', backgroundColor: '#27c93f'}}></div>
                    <div style={{
                        color: '#888', position: 'absolute', left: '50%', transform: 'translateX(-50%)', 
                        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', fontSize: 14, fontWeight: 600
                    }}>
                        evolution_log.sh — 80x24
                    </div>
                </div>

                {/* Content Container */}
                <div style={{
                    display: 'flex', 
                    flexDirection: 'column',
                    transform: `translateY(-${scrollSpring}px)`,
                    position: 'relative'
                }}>
                    {lines.map((line, i) => (
                        <Sequence 
                            key={i} 
                            from={i * LINE_DURATION}
                            durationInFrames={durationInFrames} // Persist until end
                            layout="none" // Important: Don't wrap in AbsoluteFill, let flexbox handle layout
                        >
                            <TerminalLine 
                                text={line.text} 
                                color={line.color} 
                            />
                        </Sequence>
                    ))}
                </div>
                
                {/* Scanline overlay */}
                <AbsoluteFill style={{
                    pointerEvents: 'none',
                    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                    backgroundSize: '100% 2px, 3px 100%',
                    opacity: 0.15
                }}/>
             </div>
        </AbsoluteFill>
    );
};
