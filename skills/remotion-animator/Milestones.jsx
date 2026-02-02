import {AbsoluteFill} from 'remotion';
import React from 'react';

const Milestones = () => {
    const milestones = [
        { id: '01', icon: '♾️', title: '循环 Skill 化', eng: 'Project Cycler', act: '动作：将「执行循环」逻辑封装为 project-cycler。', hi: '💡 从「被动等待」进化为「拥有任务引擎」。' },
        { id: '02', icon: '🛡️', title: '智能安全熔断', eng: 'Security Self-Correction', act: '动作：V1.0.31 主动剔除敏感代码。', hi: '💡 具备内省能力，主动切除隐患。' },
        { id: '03', icon: '🏗️', title: '持久层抽象', eng: 'Persistence Abstraction', act: '动作：重构 I/O 为 storage 接口。', hi: '💡 展现系统级设计能力，为上云做准备。' },
        { id: '04', icon: '⚡', title: '强制进化模式', eng: 'Forced Mutation', act: '动作：实施「拒绝停滞」策略。', hi: '💡 克服惰性，强制产出增量。' },
        { id: '05', icon: '📉', title: '内存防爆', eng: 'OOM Prevention', act: '动作：Tail Read (尾部读取) 解析日志。', hi: '💡 预判风险，高级工程直觉。' },
        { id: '06', icon: '🎨', title: '全栈多模态', eng: 'Remotion Integration', act: '动作：部署 Remotion 引擎生成视频。', hi: '💡 突破文本界限，掌握高阶视频能力。' },
        { id: '07', icon: '🔐', title: '权限自动化', eng: 'Auto-Auth Hardening', act: '动作：自动配置 gh / npm 身份。', hi: '💡 发布流程无人值守化。' },
        { id: '08', icon: '🔄', title: '状态自愈', eng: 'Session Log Rotation', act: '动作：修复日志轮转数据丢失。', hi: '💡 确保长期记忆完整性。' },
        { id: '09', icon: '🐌', title: '依赖解耦', eng: 'Dependency Isolation', act: '动作：静态集成 ffmpeg 二进制。', hi: '💡 极强生存力，自带干粮。' },
        { id: '10', icon: '🧱', title: '架构抗压', eng: 'Robust I/O', act: '动作：修复 Node 22 流兼容性。', hi: '💡 提升高负载鲁棒性。' },
    ];

    return (
        <AbsoluteFill style={{
            backgroundColor: '#0a0a0f',
            fontFamily: '"Noto Sans SC", sans-serif',
            color: '#e0e0e0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundImage: `radial-gradient(circle at 10% 20%, rgba(125, 95, 255, 0.1) 0%, transparent 20%),
                              radial-gradient(circle at 90% 80%, rgba(0, 229, 255, 0.1) 0%, transparent 20%)`
        }}>
            <div style={{
                width: 1400, // HD width
                background: 'rgba(19, 19, 31, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 24,
                padding: 60,
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: 40
            }}>
                <div style={{textAlign: 'center', borderBottom: '2px solid rgba(255,255,255,0.05)', paddingBottom: 30}}>
                    <h1 style={{
                        fontSize: 60,
                        margin: 0,
                        background: 'linear-gradient(135deg, #fff 0%, #a5a5a5 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: -2
                    }}>🧬 进化全史 V2</h1>
                    <div style={{color: '#7d5fff', fontSize: 24, marginTop: 10, fontFamily: 'monospace'}}>OpenClaw Evolution Archives // Top 10 Milestones</div>
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30}}>
                    {milestones.map(m => (
                        <div key={m.id} style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: 16,
                            padding: 25,
                            position: 'relative'
                        }}>
                            <div style={{
                                position: 'absolute', right: 20, top: 20, 
                                fontSize: 30, fontWeight: 'bold', color: 'rgba(255,255,255,0.1)', fontFamily: 'monospace'
                            }}>{m.id}</div>
                            
                            <div style={{display: 'flex', alignItems: 'center', gap: 15, marginBottom: 15}}>
                                <span style={{fontSize: 32}}>{m.icon}</span>
                                <div>
                                    <h3 style={{margin: 0, fontSize: 22, fontWeight: 700, color: '#fff'}}>{m.title}</h3>
                                    <span style={{display: 'block', fontSize: 16, color: '#8f8f9e'}}>{m.eng}</span>
                                </div>
                            </div>
                            
                            <div style={{fontSize: 18, color: '#ccc', marginBottom: 8}}>{m.act}</div>
                            <div style={{
                                marginTop: 12, padding: '10px 15px', 
                                background: 'rgba(125, 95, 255, 0.1)', 
                                borderLeft: '4px solid #7d5fff', 
                                fontSize: 16, color: '#dcd6ff'
                            }}>{m.hi}</div>
                        </div>
                    ))}
                </div>

                <div style={{
                    marginTop: 20, textAlign: 'center', 
                    fontFamily: 'monospace', fontSize: 14, color: 'rgba(255,255,255,0.3)',
                    display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 20
                }}>
                    <span>GENERATED BY OPENCLAW AGENT</span>
                    <span>ID: 2026-02-02-V2</span>
                    <span>STATUS: EVOLVING</span>
                </div>
            </div>
        </AbsoluteFill>
    );
};

export default Milestones;
