import { useEffect, useReducer, useState } from 'react'
import { GENERATORS } from './content/zoo'
import { calculateGeneratorCost, calculateProductionPerSecond } from './game/economy'
import { createInitialGameState, reduceGame } from './game/reducer'
import { loadLocalSave, saveLocal } from './storage/local-save'
import './styles/game.css'

export function App() {
  const [state, dispatch] = useReducer(reduceGame, undefined, () => loadLocalSave() ?? createInitialGameState())
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('Jogar')
  const production = calculateProductionPerSecond(state)
  useEffect(() => { saveLocal(state); const timer = window.setInterval(() => dispatch({ type: 'CLAIM_OFFLINE', now: Date.now() }), 1000); return () => window.clearInterval(timer) }, [state])
  return <main className="app-shell"><header><h1 className="brand">☾ Zoo Noturno</h1><div className="score"><strong>{Math.floor(state.paws).toLocaleString('pt-BR')} Patas</strong><small>{production}/s · ✦ {state.moonlight} Luz lunar</small></div></header><nav>{['Jogar', 'Mapa', 'Álbum', 'Conquistas', 'Ranking'].map(tab => <button className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)} key={tab}>{tab}</button>)}</nav>{activeTab === 'Jogar' ? <section className="game-grid"><div className="stage"><p className="eyebrow">BOSQUE DE BAMBU · NÍVEL 1</p><button className="panda" aria-label="Panda: ganhar Patas" onClick={() => dispatch({ type: 'CLICK' })}><span>🐼</span><b>Panda lunar</b><em>toque para cuidar</em></button><p className="hint">✨ Cada toque cuida do seu zoo</p></div><aside><h2>Melhorias</h2><div className="quantities">{[1,10,25].map(value => <button className={quantity === value ? 'active' : ''} onClick={() => setQuantity(value)} key={value}>x{value}</button>)}</div>{GENERATORS.map(generator => { const level = state.generatorLevels[generator.id] ?? 0; const cost = calculateGeneratorCost(generator.id, quantity, level); return <article className="upgrade" key={generator.id}><div><b>{generator.name}</b><small>Nível {level} · +{generator.production}/s</small></div><button aria-label={`Comprar ${generator.name}`} disabled={state.paws < cost} onClick={() => dispatch({ type: 'BUY_GENERATOR', generatorId: generator.id, quantity })}>{cost.toLocaleString('pt-BR')} 🐾</button></article>})}</aside></section> : <section className="panel"><h1>{activeTab}</h1><p>{activeTab === 'Mapa' ? 'Desbloqueie novos habitats com Patas.' : activeTab === 'Ranking' ? 'Entre no ranking quando criar sua conta.' : 'Esta área será desbloqueada conforme seu zoo cresce.'}</p></section>}</main>
}
