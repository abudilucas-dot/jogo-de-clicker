# Zoo Noturno — especificação de produto

## Intenção

Criar um jogo web idle/clicker original, para celular e desktop, com atmosfera de zoológico noturno neon. A pessoa começa cuidando de um panda e transforma um pequeno recinto em um grande zoo luminoso, descobrindo animais e áreas novas. A referência enviada inspira somente o gênero (progressão por cliques e produção automática); não serão reutilizados código, arte, textos, nomes, interface ou identidade de terceiros.

O sucesso é um jogo agradável de abrir por poucos minutos ou deixar evoluindo, com decisões claras de melhoria, metas de médio prazo e progresso que continua salvo entre dispositivos.

## Metas

- Uma experiência completa em navegador, responsiva e acessível.
- Ciclo central: tocar no animal central para ganhar Patas; comprar melhorias; automatizar a geração; desbloquear habitats e animais; repetir o ciclo com prestígio.
- Visual original: noite azul-marinho, brilho roxo/ciano, placas luminosas, jardim e recintos futuristas.
- Conta para manter progresso em diferentes dispositivos, além de modo visitante local.
- Ranking público opt-in, conquistas, coleção e estatísticas.
- Salvamento seguro, sem perda do jogo ao atualizar a página.

## Fora de escopo na primeira versão

- Compra com dinheiro real, anúncios, chat, mensagens diretas ou guildas.
- Jogo multiplayer em tempo real, troca de itens ou mercado entre jogadores.
- Dependência de arte, marcas, texto ou arquivos do jogo de referência.

## Direções avaliadas

1. **Protótipo apenas local**: rápido e barato, mas sem conta, ranking ou sincronização.
2. **Jogo web completo com conta e backend**: comporta o conjunto desejado — a opção escolhida.
3. **Aplicativo nativo**: permitiria notificações e loja de aplicativos, mas aumentaria distribuição, manutenção e custo sem melhorar o núcleo web inicial.

## Experiência e conteúdo

### Moedas e ciclo principal

- **Patas**: moeda principal, recebida por clique/toque e produção por segundo.
- **Luz lunar**: moeda de prestígio, obtida ao reiniciar uma temporada depois de atingir uma meta de Patas. Concede bônus permanentes.
- O painel superior mostra Patas, produção/segundo, multiplicadores ativos e Luz lunar disponível.
- O grande botão central é o animal atualmente em destaque. Cada toque tem animação, som opcional e feedback numérico.

### Progressão

- Primeira área: **Bosque de Bambu**, com panda como mascote.
- As áreas são desbloqueadas por marcos de Patas e contêm animais, cenários e cadeias de melhoria próprias.
- Áreas iniciais: Bosque de Bambu (panda), Savana de Neon (zebra), Jardim da Lua (raposa), Aquário Prismático (axolote) e Selva de Estrelas (tigre).
- Cada animal desbloqueado entra no **Álbum do Zoo**, com arte, curiosidade curta e metas associadas.
- Compras em quantidade (1, 10, 25, máximo) e custo escalonado.

### Melhorias e automação

- Melhorias permanentes por área, por exemplo: bambu bioluminescente, lanternas de recintos, drones de alimentação e observatório lunar.
- Geradores automatizados em níveis, cada um aumentando Patas/segundo com preço crescente.
- Melhorias com escolhas ocasionais: uma opção favorece cliques; outra, automação. Elas devem ser compreensíveis sem punir a escolha.
- Eventos leves de tempo limitado, como “Noite das Lanternas”, aparecem localmente e concedem um multiplicador temporário; nunca exigem pagamento.
- A produção automática continua enquanto a pessoa está ausente; ao retornar, o jogo credita a produção acumulada por até 8 horas.

### Prestígio

- Desbloqueado após um marco de progressão explicável no jogo.
- Reinicia Patas e geradores; preserva áreas já desbloqueadas, melhorias de habitat, coleção, conquistas e bônus de Luz lunar.
- Tela de confirmação resume com precisão o que será reiniciado e o bônus ganho.

### Conquistas, coleção e ranking

- Conquistas para cliques, produção, marcos de área, coleção e prestígio.
- Álbum apresenta animais já vistos e silhuetas de futuros desbloqueios.
- Ranking semanal e geral por produção total; participação pública é desligada por padrão e exige apelido escolhido.
- Tela de perfil mostra nível do zoo, coleção, prestígio e conquistas, com controle para entrar/sair do ranking.

## Telas e navegação

- **Jogar**: botão do animal, placar, melhorias/geradores e indicadores de evento.
- **Mapa**: áreas do zoo, desbloqueios e requisitos.
- **Álbum**: coleção de animais e curiosidades.
- **Conquistas**: progresso e recompensas cosméticas.
- **Ranking**: semanal/geral, explicação de participação e privacidade.
- **Configurações**: áudio, reduzir animações, exportar/importar save local, sair da conta e privacidade do ranking.

No desktop, os atalhos ficam em uma barra vertical à esquerda e as melhorias à direita. No celular, a barra vira navegação inferior e as melhorias aparecem em painel deslizante, sem prejudicar o botão central.

## Contas, dados e privacidade

- Visitantes jogam imediatamente com save local no navegador.
- Login opcional por e-mail com código seguro ou provedor de identidade suportado pela plataforma, para sincronizar dados.
- Ao criar/vincular a conta, o jogo oferece migrar o save local para a nuvem, explicando a ação.
- A fonte de verdade do progresso autenticado fica no servidor; o cliente mantém cache para carregar rápido e sincroniza de forma idempotente. Quando houver saves concorrentes ou um save local for vinculado a uma conta existente, o sistema conserva automaticamente o estado válido mais avançado, evitando substituir progresso maior por um estado antigo.
- Nenhum dado sensível é exibido no ranking. O apelido é o único identificador público.
- Proteções contra adulteração simples: validação de ritmo de ações, limites de sincronização e cálculos críticos conferidos no backend. Isso reduz fraude casual, sem prometer impedir manipulações avançadas.

## Direção visual e acessibilidade

- Fundo em azul profundo com silhuetas de recintos, estrelas e reflexos d’água; detalhes e ações em roxo elétrico e ciano.
- O panda é a primeira figura central, com poses próprias e detalhes de bambu. Arte, ícones e animações serão originais.
- A interface não depende apenas de cor: ícones, rótulos e números acompanham estados e raridade.
- Controles por teclado, foco visível, contraste adequado, textos escaláveis, leitura compatível com leitores de tela e opção de reduzir movimento/sons.

## Implementação proposta

- Site web responsivo em React/Vinext, publicado como Site privado inicialmente.
- Banco, autenticação e ranking com Supabase (Postgres + Auth), incluindo regras de acesso por usuário.
- Estado do jogo isolado em módulos: economia, catálogo de conteúdo, salvamento/sincronização e interface.
- Testes unitários para fórmulas econômicas e prestígio; testes de integração para save, login e ranking; testes de interação para o ciclo de clique e compras.
- Primeira publicação contém o jogo funcional com cinco áreas e conteúdo inicial; novos animais e eventos podem ser incluídos posteriormente sem alterar o núcleo de salvamento.

## Decisões do usuário

- Tema selecionado: **Zoo Noturno**.
- Escopo desejado: todas as opções combinadas — jogo completo, conta, salvamento entre dispositivos e ranking.
- Produção offline: habilitada, com teto de 8 horas acumuladas.
- Conflitos de save: manter automaticamente o progresso válido mais avançado.
- Prestígio: reinicia Patas e geradores, mantendo áreas e melhorias de habitat.

## Chamadas deixadas ao construtor

- Valores exatos de preço, multiplicadores e marcos, calibrados por testes de progressão.
- Escolha do provedor de login suportado além do e-mail, de acordo com a capacidade disponível.
- Lista exata de conquistas e recompensas cosméticas iniciais.
