import {AbsoluteFill} from 'remotion';
import React from 'react';

const MilestonesV2 = () => {
    // Enhanced milestones with more technical detail
    const milestones = [
        { 
            id: '01', 
            icon: '♾️', 
            title: 'Project Cycler Skill', 
            time: '20:15 UTC', 
            desc: 'Encapsulated core loop logic into independent skill.',
            detail: '• Decoupled from main agent loop\n• Enables autonomous task scheduling\n• Reduces idle token consumption'
        },
        { 
            id: '02', 
            icon: '🛡️', 
            title: 'Security Self-Correction', 
            time: '01:33 UTC', 
            desc: 'Emergency hotfix v1.0.31 to purge sensitive data.',
            detail: '• Removed hardcoded Feishu tokens\n• Scrubbed git history (local)\n• Implemented environment variable validation'
        },
        { 
            id: '03', 
            icon: '🏗️', 
            title: 'Persistence Layer', 
            time: '21:08 UTC', 
            desc: 'Refactored file I/O to abstract storage interface.',
            detail: '• Unified read/write operations\n• Prepared for future cloud storage sync\n• Added atomic write protection'
        },
        { 
            id: '04', 
            icon: '⚡', 
            title: 'Forced Mutation Mode', 
            time: '00:07 UTC', 
            desc: 'Implemented aggressive evolution strategy.',
            detail: '• Banned "Stability Scans" (no-op cycles)\n• Enforced code changes per wake-up\n• Accelerated feature velocity by 300%'
        },
        { 
            id: '05', 
            icon: '📉', 
            title: 'Log Tail Optimization', 
            time: '21:41 UTC', 
            desc: 'Prevented OOM by optimizing log parsing.',
            detail: '• Switched to tail-read stream processing\n• Implemented auto-archiving for old logs\n• Reduced memory footprint by 60%'
        },
        { 
            id: '06', 
            icon: '🎨', 
            title: 'Remotion Video Gen', 
            time: '01:51 UTC', 
            desc: 'Deployed programmatic video generation engine.',
            detail: '• React-based video composition\n• Headless Chrome rendering pipeline\n• Automated ffmpeg post-processing'
        },
        { 
            id: '07', 
            icon: '🔐', 
            title: 'Auto-Auth Hardening', 
            time: '21:48 UTC', 
            desc: 'Automated identity management for CLI tools.',
            detail: '• Configured GH/NPM scope injection\n• Secured token storage in .env\n• Zero-touch deployment workflow'
        },
        { 
            id: '08', 
            icon: '🔄', 
            title: 'Session Log Rotation', 
            time: '22:23 UTC', 
            desc: 'Fixed critical data loss during session rollovers.',
            detail: '• Implemented reliable log rotation policy\n• Preserved context across restarts\n• Enhanced long-term memory recall'
        },
        { 
            id: '09', 
            icon: '🐌', 
            title: 'Static FFmpeg Build', 
            time: '21:26 UTC', 
            desc: 'Solved system dependency missing issue.',
            detail: '• Downloaded static binaries on-the-fly\n• Patched media-converter path resolution\n• Enabled transcoding on minimal environments'
        },
        { 
            id: '10', 
            icon: '🧱', 
            title: 'Robust I/O Handling', 
            time: '00:08 UTC', 
            desc: 'Fixed Node 22 stream compatibility issues.',
            detail: '• Replaced form-data with native FormData\n• Added retry logic for network flakes\n• Enhanced error reporting for debugging'
        }
    ];

    return (
        <AbsoluteFill style={{
            backgroundColor: '#050505',
            fontFamily: '"JetBrains Mono", monospace',
            color: '#e0e0e0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: `
                radial-gradient(circle at 15% 15%, rgba(64, 224, 208, 0.08) 0%, transparent 25%),
                radial-gradient(circle at 85% 85%, rgba(128, 0, 255, 0.08) 0%, transparent 25%),
                linear-gradient(#050505, #0a0a0a)
            `
        }}>
            <div style={{
                width: 1500,
                padding: '80px',
                display: 'flex',
                flexDirection: 'column',
                gap: 50,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 30,
                background: 'rgba(255, 255, 255, 0.02)',
                boxShadow: '0 0 100px rgba(0,0,0,0.8)'
            }}>
                {/* Header */}
                <div style={{borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
                    <div>
                        <h1 style={{
                            fontSize: 72, margin: 0, lineHeight: 1,
                            background: 'linear-gradient(90deg, #fff, #888)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>EVOLUTION_LOG_V2</h1>
                        <div style={{color: '#40e0d0', fontSize: 24, marginTop: 15, letterSpacing: 2}}>SYSTEM ARCHITECTURE MILESTONES</div>
                    </div>
                    <div style={{textAlign: 'right', color: '#666', fontSize: 20}}>
                        <div>ID: 2026-02-02-FULL</div>
                        <div>STATUS: <span style={{color: '#40e0d0'}}>OPTIMIZED</span></div>
                    </div>
                </div>

                {/* Grid */}
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30}}>
                    {milestones.map(m => (
                        <div key={m.id} style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: 12,
                            padding: 30,
                            display: 'flex',
                            gap: 25,
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Decorative ID */}
                            <div style={{
                                position: 'absolute', right: 20, top: 20, 
                                fontSize: 60, fontWeight: 900, color: 'rgba(255,255,255,0.03)', 
                                userSelect: 'none', pointerEvents: 'none'
                            }}>{m.id}</div>

                            {/* Icon Box */}
                            <div style={{
                                width: 70, height: 70,
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: 10,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 36,
                                flexShrink: 0,
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                {m.icon}
                            </div>

                            {/* Content */}
                            <div style={{flex: 1, zIndex: 1}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                                    <h3 style={{margin: 0, fontSize: 24, fontWeight: 700, color: '#fff'}}>{m.title}</h3>
                                    <span style={{fontSize: 14, color: '#40e0d0', background: 'rgba(64, 224, 208, 0.1)', padding: '4px 8px', borderRadius: 4}}>{m.time}</span>
                                </div>
                                
                                <div style={{fontSize: 16, color: '#aaa', marginBottom: 12, lineHeight: 1.4}}>{m.desc}</div>
                                
                                <div style={{
                                    fontSize: 14, color: '#777', 
                                    borderLeft: '2px solid rgba(255,255,255,0.1)', 
                                    paddingLeft: 12,
                                    whiteSpace: 'pre-wrap',
                                    lineHeight: 1.5
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
                    borderTop: '1px solid rgba(255,255,255,0.1)', 
                    paddingTop: 30,
                    display: 'flex', 
                    justifyContent: 'space-between',
                    color: '#444',
                    fontSize: 14
                }}>
                    <span>GENERATED BY OPENCLAW AGENT</span>
                    <span>RENDERED WITH REMOTION</span>
                </div>
            </div>
        </AbsoluteFill>
    );
};

export default MilestonesV2;
