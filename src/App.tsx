import { useEffect, useReducer, useState } from 'react'
import { GENERATORS, HABITATS } from './content/zoo'
import { calculateGeneratorCost, calculateProductionPerSecond } from './game/economy'
import { formatNumber } from './game/format'
import { createInitialGameState, reduceGame } from './game/reducer'
import { loadLocalSave, saveLocal } from './storage/local-save'
import { supabase } from './storage/supabase-client'
import './styles/game.css'

export function App() {
  const [state, dispatch] = useReducer(reduceGame, undefined, () => loadLocalSave() ?? createInitialGameState())
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('Jogar')
  const [email, setEmail] = useState('')
  const [notice, setNotice] = useState('')
  const production = calculateProductionPerSecond(state)
  const sendMagicLink = async () => { if (!supabase || !email) return setNotice('Informe seu e-mail para sincronizar.'); const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } }); setNotice(error ? error.message : 'Link de acesso enviado. Abra seu e-mail para sincronizar o zoo.') }
  useEffect(() => { saveLocal(state); const timer = window.setInterval(() => dispatch({ type: 'CLAIM_OFFLINE', now: Date.now() }), 1000); return () => window.clearInterval(timer) }, [state])
  return <main className="app-shell"><header><h1 className="brand">☾ Zoo Noturno</h1><div className="score"><strong>{formatNumber(state.paws)} Patas</strong><small>{formatNumber(production)}/s · ✦ {formatNumber(state.moonlight)} Luz lunar</small></div></header><nav>{['Jogar', 'Mapa', 'Álbum', 'Conquistas', 'Ranking'].map(tab => <button className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)} key={tab}>{tab}</button>)}</nav>{activeTab === 'Jogar' ? <section className="game-grid"><div className="stage"><p className="eyebrow">BOSQUE DE BAMBU · NÍVEL 1</p><button className="panda" aria-label="Panda: ganhar Patas" onClick={() => dispatch({ type: 'CLICK' })}><span>🐼</span><b>Panda lunar</b><em>toque para cuidar</em></button><p className="hint">✨ Cada toque cuida do seu zoo</p></div><aside><h2>Melhorias</h2><div className="quantities">{[1,10,25].map(value => <button className={quantity === value ? 'active' : ''} onClick={() => setQuantity(value)} key={value}>x{value}</button>)}</div>{GENERATORS.map(generator => { const level = state.generatorLevels[generator.id] ?? 0; const cost = calculateGeneratorCost(generator.id, quantity, level); return <article className="upgrade" key={generator.id}><div><b>{generator.name}</b><small>Nível {level} · +{formatNumber(generator.production)}/s</small></div><button aria-label={`Comprar ${generator.name}`} disabled={state.paws < cost} onClick={() => dispatch({ type: 'BUY_GENERATOR', generatorId: generator.id, quantity })}>{formatNumber(cost)} 🐾</button></article>})}</aside></section> : <section className="panel"><h1>{activeTab}</h1>{activeTab === 'Mapa' && <div>{HABITATS.map(habitat => { const unlocked = state.unlockedHabitatIds.includes(habitat.id); return <p key={habitat.id}>{unlocked ? '✓' : '🔒'} {habitat.animal} · {habitat.name} {!unlocked && <button disabled={state.paws < habitat.unlockCost} onClick={() => dispatch({ type: 'UNLOCK_HABITAT', habitatId: habitat.id, cost: habitat.unlockCost })}>Desbloquear {formatNumber(habitat.unlockCost)} 🐾</button>}</p> })}</div>}{activeTab === 'Álbum' && <p>🐼 Panda desbloqueado · descubra os próximos quatro animais no mapa.</p>}{activeTab === 'Conquistas' && <p>Primeiro cuidado: toque no panda. Colecionador: desbloqueie habitats. Luar: faça prestígio.</p>}{activeTab === 'Ranking' && <div><p>Sincronize seu zoo e entre no ranking somente se quiser.</p><input aria-label="E-mail" value={email} onChange={event => setEmail(event.target.value)} placeholder="seu@email.com"/><button onClick={sendMagicLink}>Enviar link de acesso</button><p>{notice}</p></div>}</section>}</main>
}
