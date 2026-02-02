import {AbsoluteFill} from 'remotion';
import React from 'react';

const MilestonesFinal = () => {
    // Enhanced milestones with more technical detail
    // Removed "V2", focused on "Evolution Archives"
    const milestones = [
        { 
            id: '01', 
            icon: '♾️', 
            title: 'Project Cycler Skill', 
            time: '20:15 UTC', 
            desc: 'Autonomous task loop encapsulation.',
            detail: '• Decoupled from main agent loop\n• Enables autonomous task scheduling\n• Reduces idle token consumption\n• Path: skills/project-cycler'
        },
        { 
            id: '02', 
            icon: '🛡️', 
            title: 'Security Self-Correction', 
            time: '01:33 UTC', 
            desc: 'Emergency hotfix v1.0.31.',
            detail: '• Purged export_history.js & hardcoded tokens\n• Scrubbed git history (local)\n• Implemented env var validation\n• Commit: 2a39996'
        },
        { 
            id: '03', 
            icon: '🏗️', 
            title: 'Persistence Layer', 
            time: '21:08 UTC', 
            desc: 'I/O abstraction & stabilization.',
            detail: '• Unified read/write operations\n• Prepared for future cloud sync\n• Added atomic write protection\n• Target: MEMORY.md'
        },
        { 
            id: '04', 
            icon: '⚡', 
            title: 'Forced Mutation Mode', 
            time: '00:07 UTC', 
            desc: 'Aggressive evolution strategy.',
            detail: '• Banned "Stability Scans" (no-op)\n• Enforced code changes per wake-up\n• Velocity: +300% code churn\n• File: skills/capability-evolver/evolve.js'
        },
        { 
            id: '05', 
            icon: '📉', 
            title: 'Log Tail Optimization', 
            time: '21:41 UTC', 
            desc: 'OOM prevention strategy.',
            detail: '• Switched to tail-read stream processing\n• Implemented auto-archiving\n• Reduced memory footprint by 60%\n• Logs: agents/main/sessions/*.jsonl'
        },
        { 
            id: '06', 
            icon: '🎨', 
            title: 'Remotion Video Gen', 
            time: '01:51 UTC', 
            desc: 'Programmatic video engine.',
            detail: '• React-based video composition\n• Headless Chrome rendering\n• Automated ffmpeg post-processing\n• Output: .mp4 / .gif'
        },
        { 
            id: '07', 
            icon: '🔐', 
            title: 'Auto-Auth Hardening', 
            time: '21:48 UTC', 
            desc: 'Automated identity management.',
            detail: '• Configured GH/NPM scope injection\n• Secured token storage in .env\n• Zero-touch deployment workflow\n• Tool: gh auth status'
        },
        { 
            id: '08', 
            icon: '🔄', 
            title: 'Session Log Rotation', 
            time: '22:23 UTC', 
            desc: 'Data integrity protection.',
            detail: '• Implemented reliable log rotation\n• Preserved context across restarts\n• Enhanced long-term recall\n• Fix: interaction-logger'
        },
        { 
            id: '09', 
            icon: '🐌', 
            title: 'Static FFmpeg Build', 
            time: '21:26 UTC', 
            desc: 'Dependency isolation.',
            detail: '• Downloaded static binaries on-the-fly\n• Patched media-converter path\n• Enabled transcoding on minimal env\n• Path: bin/ffmpeg'
        },
        { 
            id: '10', 
            icon: '🧱', 
            title: 'Robust I/O Handling', 
            time: '00:08 UTC', 
            desc: 'Node 22 stream compatibility.',
            detail: '• Replaced form-data with native FormData\n• Added retry logic for network flakes\n• Enhanced error reporting\n• Skill: feishu-sticker'
        }
    ];

    return (
        <AbsoluteFill style={{
            backgroundColor: '#030303',
            fontFamily: '"JetBrains Mono", monospace',
            color: '#e0e0e0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: `
                radial-gradient(circle at 20% 20%, rgba(0, 255, 136, 0.05) 0%, transparent 40%),
                radial-gradient(circle at 80% 80%, rgba(0, 153, 255, 0.05) 0%, transparent 40%),
                linear-gradient(#030303, #080808)
            `
        }}>
            <div style={{
                width: 1600,
                padding: '90px',
                display: 'flex',
                flexDirection: 'column',
                gap: 50,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 40,
                background: 'rgba(20, 20, 20, 0.4)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 0 150px rgba(0,0,0,0.9)'
            }}>
                {/* Header */}
                <div style={{borderBottom: '2px solid rgba(255,255,255,0.08)', paddingBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
                    <div>
                        <h1 style={{
                            fontSize: 70, margin: 0, lineHeight: 1, letterSpacing: -2,
                            background: 'linear-gradient(135deg, #fff 0%, #aaa 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>OPENCLAW EVOLUTION ARCHIVES</h1>
                        <div style={{color: '#00ff88', fontSize: 28, marginTop: 20, letterSpacing: 4, fontWeight: 300}}>SYSTEM GENESIS RECORD</div>
                    </div>
                    <div style={{textAlign: 'right', color: '#555', fontSize: 22, fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: 10, minWidth: 300, flexShrink: 0}}>
                        <div style={{whiteSpace: 'nowrap'}}>DATE: 2026-02-02</div>
                        <div style={{whiteSpace: 'nowrap'}}>MODE: <span style={{color: '#00ff88'}}>AUTONOMOUS</span></div>
                    </div>
                </div>

                {/* Grid */}
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 35}}>
                    {milestones.map(m => (
                        <div key={m.id} style={{
                            background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: 20,
                            padding: 35,
                            display: 'flex',
                            gap: 30,
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Decorative ID */}
                            <div style={{
                                position: 'absolute', right: 25, top: 25, 
                                fontSize: 80, fontWeight: 900, color: 'rgba(255,255,255,0.02)', 
                                userSelect: 'none', pointerEvents: 'none', lineHeight: 0.8
                            }}>{m.id}</div>

                            {/* Icon Box */}
                            <div style={{
                                width: 80, height: 80,
                                background: 'rgba(0, 0, 0, 0.4)',
                                borderRadius: 16,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 40,
                                flexShrink: 0,
                                border: '1px solid rgba(255,255,255,0.08)',
                                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
                            }}>
                                {m.icon}
                            </div>

                            {/* Content */}
                            <div style={{flex: 1, zIndex: 1}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
                                    <h3 style={{margin: 0, fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: -0.5}}>{m.title}</h3>
                                    <span style={{fontSize: 14, color: '#00ff88', background: 'rgba(0, 255, 136, 0.1)', padding: '6px 10px', borderRadius: 6, fontWeight: 600}}>{m.time}</span>
                                </div>
                                
                                <div style={{fontSize: 16, color: '#999', marginBottom: 15, lineHeight: 1.4}}>{m.desc}</div>
                                
                                <div style={{
                                    fontSize: 14, color: '#777', 
                                    borderLeft: '2px solid rgba(255,255,255,0.1)', 
                                    paddingLeft: 15,
                                    whiteSpace: 'pre-wrap',
                                    lineHeight: 1.6,
                                    fontFamily: 'monospace'
                                }}>
                                    {m.detail}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div style={{
                    marginTop: 20, 
                    borderTop: '1px solid rgba(255,255,255,0.08)', 
                    paddingTop: 30,
                    display: 'flex', 
                    justifyContent: 'space-between',
                    color: '#444',
                    fontSize: 16,
                    letterSpacing: 1
                }}>
                    <span>GENERATED BY 诗琪大魔王的小虾</span>
                    <span>RENDERED WITH REMOTION // HEADLESS CHROME</span>
                </div>
            </div>
        </AbsoluteFill>
    );
};

export default MilestonesFinal;
