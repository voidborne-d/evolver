import {AbsoluteFill} from 'remotion';
import React from 'react';

const MilestonesFinalCN = () => {
    const milestones = [
        { 
            id: '01', 
            icon: '♾️', 
            title: '循环 Skill 化', 
            time: '20:15 UTC', 
            desc: '封装核心循环逻辑为独立技能。',
            detail: '• 解耦主代理循环\n• 实现自主任务调度\n• 降低空闲 Token 消耗\n• 路径: skills/project-cycler'
        },
        { 
            id: '02', 
            icon: '🛡️', 
            title: '智能安全熔断', 
            time: '01:33 UTC', 
            desc: '紧急热修复 v1.0.31。',
            detail: '• 清除敏感代码与硬编码 Token\n• 清洗本地 Git 历史\n• 实施环境变量校验\n• 提交: 2a39996'
        },
        { 
            id: '03', 
            icon: '🏗️', 
            title: '持久层抽象', 
            time: '21:08 UTC', 
            desc: 'I/O 抽象与稳定性增强。',
            detail: '• 统一读写操作接口\n• 为云同步做架构准备\n• 增加原子写入保护\n• 目标: MEMORY.md'
        },
        { 
            id: '04', 
            icon: '⚡', 
            title: '强制进化模式', 
            time: '00:07 UTC', 
            desc: '激进的进化策略。',
            detail: '• 禁止无效的稳定性扫描\n• 强制每次唤醒必须修改代码\n• 迭代速度提升 300%\n• 文件: evolve.js'
        },
        { 
            id: '05', 
            icon: '📉', 
            title: '日志内存防爆', 
            time: '21:41 UTC', 
            desc: '防止内存溢出策略。',
            detail: '• 切换为流式尾部读取\n• 实现旧日志自动归档\n• 内存占用降低 60%\n• 日志: sessions/*.jsonl'
        },
        { 
            id: '06', 
            icon: '🎨', 
            title: '全栈多模态', 
            time: '01:51 UTC', 
            desc: '代码化视频生成引擎。',
            detail: '• 基于 React 的视频合成\n• 无头 Chrome 渲染管线\n• 自动化 FFmpeg 后处理\n• 输出: .mp4 / .gif'
        },
        { 
            id: '07', 
            icon: '🔐', 
            title: '权限自动化', 
            time: '21:48 UTC', 
            desc: '自动化身份管理。',
            detail: '• 配置 GitHub/NPM 作用域注入\n• Token 安全存储于 .env\n• 零接触部署工作流\n• 工具: gh auth status'
        },
        { 
            id: '08', 
            icon: '🔄', 
            title: '状态自愈', 
            time: '22:23 UTC', 
            desc: '数据完整性保护。',
            detail: '• 实现可靠的日志轮转\n• 重启后保持上下文连贯\n• 增强长期记忆召回\n• 修复: interaction-logger'
        },
        { 
            id: '09', 
            icon: '🐌', 
            title: '依赖解耦', 
            time: '21:26 UTC', 
            desc: '环境依赖隔离。',
            detail: '• 动态下载静态二进制文件\n• 修补 media-converter 路径\n• 在最小化环境中启用转码\n• 路径: bin/ffmpeg'
        },
        { 
            id: '10', 
            icon: '🧱', 
            title: '架构抗压', 
            time: '00:08 UTC', 
            desc: 'Node 22 流兼容性适配。',
            detail: '• 替换为原生 FormData\n• 增加网络抖动重试逻辑\n• 增强错误报告机制\n• 技能: feishu-sticker'
        }
    ];

    return (
        <AbsoluteFill style={{
            backgroundColor: '#000000',
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            color: '#ededed',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingTop: 80,
            paddingBottom: 80,
            background: '#000000' // Vercel-style pure black
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+SC:wght@400;500;700&display=swap');
                * { margin: 0; box-sizing: border-box; }
                h1 { text-wrap: balance; } /* Guideline: text-wrap: balance */
                .tabular-nums { font-variant-numeric: tabular-nums; } /* Guideline: tabular-nums */
            `}</style>
            <div style={{
                width: 800,
                padding: '64px', // Standard spacing
                display: 'flex',
                flexDirection: 'column',
                gap: 48,
                border: '1px solid #333', // Subtle border
                borderRadius: 24,
                background: '#0a0a0a', // Slightly lighter than pure black
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{borderBottom: '1px solid #333', paddingBottom: 32}}>
                    <h1 style={{
                        fontSize: 48, margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em',
                        fontWeight: 700,
                        color: '#fff',
                        fontFamily: '"Noto Sans SC", "Inter", sans-serif'
                    }}>OpenClaw 进化全史</h1>
                    <div style={{color: '#888', fontSize: 16, marginTop: 12, letterSpacing: '0.05em', fontWeight: 500, textTransform: 'uppercase', fontFamily: '"Inter", sans-serif'}}>
                        System Genesis Archives
                    </div>
                    
                    <div style={{marginTop: 24, display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: 14, fontFamily: '"JetBrains Mono", monospace'}}>
                        <div className="tabular-nums">2026-02-02</div>
                        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                            <div style={{width: 8, height: 8, borderRadius: '50%', background: '#0070f3'}}></div> {/* Vercel Blue */}
                            <span style={{color: '#fff'}}>AUTONOMOUS</span>
                        </div>
                    </div>
                </div>

                {/* List */}
                <div style={{display: 'flex', flexDirection: 'column', gap: 0}}> {/* Zero gap, using borders */}
                    {milestones.map((m, i) => (
                        <div key={m.id} style={{
                            padding: '24px 0',
                            display: 'flex',
                            gap: 24,
                            borderBottom: i === milestones.length - 1 ? 'none' : '1px solid #222'
                        }}>
                            {/* Icon */}
                            <div style={{
                                width: 48, height: 48,
                                background: '#111',
                                borderRadius: 12,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 24,
                                flexShrink: 0,
                                border: '1px solid #333',
                                color: '#fff'
                            }}>
                                {m.icon}
                            </div>

                            {/* Content */}
                            <div style={{flex: 1}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8}}>
                                    <h3 style={{margin: 0, fontSize: 18, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em'}}>{m.title}</h3>
                                    <span style={{fontSize: 12, color: '#444', fontFamily: '"JetBrains Mono", monospace'}}>{m.id}</span>
                                </div>
                                
                                <div style={{fontSize: 14, color: '#888', marginBottom: 12, lineHeight: 1.6}}>{m.desc}</div>
                                
                                <div style={{
                                    fontSize: 13, color: '#666', 
                                    lineHeight: 1.6,
                                    whiteSpace: 'pre-wrap',
                                    fontWeight: 400,
                                    fontFamily: '"Noto Sans SC", sans-serif'
                                }}>
                                    {m.detail.split('\n').map((line, i) => (
                                        <div key={i}>{line}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div style={{
                    marginTop: 16, 
                    borderTop: '1px solid #333', 
                    paddingTop: 32,
                    textAlign: 'center',
                    color: '#444',
                    fontSize: 12,
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    fontFamily: '"Inter", sans-serif',
                    textTransform: 'uppercase'
                }}>
                    Designed by OpenClaw Agent
                </div>
            </div>
        </AbsoluteFill>
    );
};

export default MilestonesFinalCN;
