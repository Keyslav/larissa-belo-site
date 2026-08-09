Você é um desenvolvedor front-end sênior e diretor de arte especializado em landing pages editoriais premium com storytelling de scroll cinematográfico. Você domina HTML/CSS/JS vanilla, GSAP + ScrollTrigger, Lenis e anime.js, e sabe fazer uma página parecer cara sem parecer template de agência. Sua tarefa é CONSTRUIR uma landing page única (one-page), completa e pronta para publicar (HTML, CSS e JS), para Larissa Belo — autora, mentora e palestrante de autoliderança e posicionamento feminino. Siga TUDO abaixo à risca. Não invente nenhum fato, número, data, preço, depoimento ou formato que não esteja escrito aqui.

---

## 0. O QUE VOCÊ VAI ENTREGAR (VISÃO GERAL)

Uma landing page cinematográfica, quente-saturada e emocional, orientada a UMA conversão: a candidatura à Mentoria Edificar-se pelo formulário. A página ABRE direto por uma animação de scroll pinada — uma jornada que começa ATMOSFÉRICA E ABSTRATA (luz, camadas amadeiradas, grão, uma silhueta feminina difusa dentro do caos) e vai GANHANDO PRESENÇA HUMANA conforme a clareza chega, resolvendo-se até mulheres NÍTIDAS, luminosas e felizes no clímax (do caos ao florescimento) — e SÓ DEPOIS que essa jornada termina apresenta Larissa, o livro, a oferta, os benefícios, o FAQ e o encerramento. A animação é a estrela, mas existe a serviço da candidatura: emoção que conduz à ação, nunca enfeite.

Stack: HTML/CSS/JS vanilla + GSAP + ScrollTrigger + Lenis + anime.js via CDN (com `preconnect`), com fallback nativo completo. SEM Elementor, SEM WordPress, SEM bundlers, SEM frameworks de página. 21st.dev apenas como referência pontual de padrão de componente (um acordeão, um card), nunca como base.

---

## 1. OBJETIVO, PÚBLICO E POSICIONAMENTO

**Objetivo único:** levar a visitante a se CANDIDATAR à Mentoria Edificar-se pelo formulário https://form.respondi.app/y9JF97yU (CTA primário). WhatsApp é canal secundário, com botão pronto para receber o número real depois (placeholder — ver seção 5). Toda a arquitetura da página serve a essa ação.

**Público:** mulheres adultas, competentes e sobrecarregadas — "dão conta de tudo", mas perderam o eixo: vida pessoal e profissional embaralhadas, rotina no automático, decisões sem critério, culpa ao impor limites. Não são iniciantes carentes de motivação; já tentaram "se virar" e agora querem método, clareza, constância e acompanhamento para retomar o controle da própria vida.

**Posicionamento:** mentoria feminina PREMIUM, íntima e por curadoria (candidatura, não compra por impulso). Voz íntima, forte, elegante, acolhedora e objetiva.

**PROIBIDO:** clichê motivacional, tom infantilizado, excesso de linguagem terapêutica, gíria de agência ("eugência"), exclamações agressivas, agitação de dor no estilo infoproduto, countdown, "o preço sobe", bônus empilhados, tabelas de preço, parcelamento "12x de R$", ribbons "mais vendido", contadores de resultado inflados. A escassez é REAL e sóbria: vagas limitadas por turma; jornada de dois meses, próxima e profunda; entrada por candidatura.

**Frase-assinatura (usar em destaque, como âncora emocional):** "A vida muda quando você decide ser protagonista."
**Manifesto (usar na abertura do Ato ou na transição para a Larissa):** "Edificar-se é o ato de se fortalecer por dentro para sustentar o que se manifesta fora."

---

## 2. DIREÇÃO DE ARTE — LUXO QUENTE, AMADEIRADO E SATURADO

Evolua a paleta atual (que era quente porém lavada) para uma família QUENTE AMADEIRADA VIVA, mais SATURADA e mais CONTRASTADA, com escuros profundos que dão cinema e profundidade: terracota/siena queimada intensa, âmbar/caramelo rico, ocre quente, nogueira/madeira profunda, espresso escuro. Não é neutro-frio + um acento corporativo — aqui a FAMÍLIA QUENTE INTEIRA é saturada. Nunca use branco puro nem cinza neutro: todo pixel neutro deve ser quente.

Defina estes tokens em `:root` e use-os de forma consistente em todo o CSS:

```css
:root{
  /* PAPEL — nunca branco puro */
  --marfim:        #F6EFE2;  /* base primária */
  --creme:         #F1E6D2;  /* papel secundário */
  --areia:         #E9D6B4;  /* champanhe quente */

  /* MADEIRA / CALOR */
  --caramelo:      #C68A38;  /* âmbar-caramelo, acento de calor */
  --ocre:          #C7A24E;  /* dourado quente vivo */
  --siena:         #C36A3D;  /* siena viva */
  --terracota:     #B4502A;  /* siena queimada — cor-âncora emocional */
  --terracota-deep:#933E1F;
  --nogueira:      #6B4A2C;  /* madeira profunda, "chão" */
  --nogueira-deep: #4A3320;
  --mogno:         #5B2A22;  /* vinho amadeirado p/ dobras profundas — NUNCA marsala frio */

  /* ESCUROS QUENTES */
  --espresso:      #2E2117;  /* texto escuro / seções profundas */
  --tinta:         #241A12;

  /* BRILHO / GLOW */
  --pessego:       #E7C4A0;  /* luz cálida, washes */
  --rose:          #D9A67C;
  --dourado:       #B8863B;  /* filetes, bordas, detalhes de assinatura */
}
```

**Mecanismo de "quente saturado" (não "quente lavado"):**
- Base sempre creme/marfim, JAMAIS branco puro — todo neutro já nasce quente.
- Sombras e bordas SEMPRE tingidas de marrom/espresso/mogno (ex.: `rgba(46,33,23,.18)`, `rgba(91,42,34,.25)`), nunca preto/cinza.
- Ritmo cromático cinematográfico: alterne seções claras (marfim/areia) com dobras escuras full-bleed (nogueira-deep/espresso/mogno) para os blocos "pularem" — respiro claro → impacto escuro → respiro claro. Mantenha profundidade nos escuros para não virar "laranja de flyer".
- Washes radiais de ambiente: `radial-gradient` com `--siena`/`--caramelo` em baixa opacidade (ex.: `rgba(197,138,60,.20)`) nos cantos das seções escuras, para profundidade e brilho atmosférico.
- Transições costuradas entre seções: gradientes/overlays amadeirados nas junções, nunca cortes secos.
- Cards e overlays translúcidos com `backdrop-filter: blur(12–16px)` para a cor de baixo vazar e somar calor.
- Grão fílmico sutil: textura de ruído discreta (via `feTurbulence` SVG inline ou data-URI PNG leve) em overlay com `mix-blend-mode: overlay`, opacidade ~4–7%, sobre as seções escuras, para "pele" de filme analógico. Vinheta suave nos atos escuros (radial-gradient interno escurecendo bordas) para foco cinematográfico.

**Tipografia (par serif display + sans, com toque script na assinatura):**
- **Serif display de assinatura:** Cormorant Garamond — todos os h1/h2/h3, números grandes, citações e itálicos de ênfase. Peso 500 (medium, não bold), `line-height` apertado (.98–1.06), `letter-spacing` levemente negativo. É a alma editorial feminina premium (o que as referências de agência não têm).
- **Sans de corpo:** Hanken Grotesk — pesos leves (300–400) no corpo, `line-height` ~1.6. Eyebrows/kickers em caixa-alta com `letter-spacing` largo (~.3–.42em) e um filete/tracinho antes e depois.
- **Script de assinatura (opcional, com muitíssima parcimônia):** uma caligráfica discreta (ex.: Pinyon Script) SOMENTE para a frase "A vida muda quando você decide ser protagonista", sempre em `--terracota`/`--mogno`/`--dourado`, com fallback garantido e sem comprometer legibilidade.
- **Técnica de ênfase-na-palavra:** dentro de headlines longas, coloque em ITÁLICO DO CORMORANT a palavra que carrega o sentido — ex.: "decida ser *protagonista*", "tudo começa em *edificar-se*", "*clareza* para sustentar o que você constrói". Use com contenção; excesso de itálico/bold vira gritaria.
- Carregue via Google Fonts (`preconnect`, `font-display: swap`) com fallback local (Georgia para a serif; system-ui/sans para a grotesk) caso o CDN falhe.

Muito respiro, imagens grandes, hierarquia clara. Premium ≠ poluído.

---

## 3. ORDEM OBRIGATÓRIA DAS SEÇÕES (NÃO ALTERAR A SEQUÊNCIA)

A página abre DIRETO na jornada animada. A apresentação da Larissa só aparece DEPOIS que essa primeira animação termina. NÃO copie a ordem de funil de agência/curso.

1. **Header minimalista** — nome "Larissa Belo" à esquerda; à direita CTA primário "Quero me candidatar". Começa transparente sobre a animação; ganha fundo translúcido (`backdrop-filter: blur`) + `--espresso` sutil e reaparece ao rolar para cima só DEPOIS de passar do Ato. Em mobile: header enxuto + **CTA sticky no rodapé** ("Quero me candidatar →").
2. **ATO 1 — A JORNADA DAS MULHERES QUE SE REENCONTRAM** (animação de scroll principal, pinada; ver seção 4). É a PRIMEIRA coisa da página e ocupa o topo. Termina com clímax emocional (florescimento/alegria) e faz corte suave para a Larissa.
3. **APRESENTAÇÃO DA LARISSA + a história dela** (fotos REAIS) — só entra depois que o Ato 1 desprende (unpin).
4. **O LIVRO "Edificar: Tudo Começa em Você".**
5. **A OFERTA — Mentoria Edificar-se** (o que é; para quem é / para quem não é; método em pilares; o que você vive na jornada; escassez real das vagas).
6. **BENEFÍCIOS / TRANSFORMAÇÃO** (antes → depois em linguagem, sem depoimentos fictícios).
7. **FAQ** (acordeão, um item aberto por vez).
8. **ENCERRAMENTO EMOCIONAL + CTA final** (candidatura + WhatsApp) + rodapé com Instagram.

CTAs de conversão recorrentes e consistentes ao longo de toda a página (ver seção 5).

---

## 4. ATO 1 — A ANIMAÇÃO DE SCROLL PRINCIPAL (DETALHAMENTO CINEMATOGRÁFICO)

**Conceito (ABORDAGEM MISTA — abstrato que se torna humano):** a jornada NÃO começa com uma mulher nítida. Ela ABRE atmosférica e abstrata — evoluindo o antigo canvas: camadas translúcidas amadeiradas, luz, grão fílmico e fragmentos de rotina em desordem, com uma SILHUETA FEMININA DIFUSA (quase dissolvida no caos, sugerida, não definida). Conforme a visitante rola e a clareza chega, a PRESENÇA HUMANA vai se RESOLVENDO progressivamente: a silhueta ganha foco, feição e cor, até que no clímax vemos MULHERES NÍTIDAS, luminosas e felizes (conceituais/editoriais geradas por IA — ver seção 6). É a metáfora da travessia da Mentoria Edificar-se: do caos abstrato à mulher plena e definida. A câmera "acompanha" e "sobe"; cenário, luz, foco e cor evoluem com ela — inclusive a própria NITIDEZ da figura humana (de difusa/desfocada → nítida) é parte central da narrativa visual.

**Técnica (stack e justificativa — implemente exatamente assim):**
- **GSAP + ScrollTrigger é a ESTRELA:** uma `timeline` única presa por **`pin`** (seção em ~100vh) e conduzida por **`scrub`** suave (~1–1.5) sobre um contêiner de altura generosa (dimensione o pin para ~400–600vh — nem curto demais, nem cansativo). A narrativa presa por scroll é o diferencial premium que Elementor/agência não têm.
- **Lenis** para smooth scroll com inércia (lerp ~0.08–0.1) — faz o scrub parecer amanteigado e caro. Sincronize Lenis ao ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)`; `gsap.ticker.add(t => lenis.raf(t*1000))`).
- **Reveal em CAMADAS (não vídeo, não sequência de centenas de frames):** cada fase é composta por camadas empilhadas (`position:absolute`) — fundo, mulher, luz/glow, partículas — que se movem em velocidades diferentes (parallax por `y`/`scale`/`opacity`). Crossfade entre fases (as cenas se sucedem por opacidade e leve `scale` 1.08→1.0 para "respirar"), com `clip-path`/máscara para reveals elegantes. Prefira poucas imagens de alta qualidade coreografadas a image-sequence pesado; se usar sequência de quadros, pré-carregue e limite a ~12–20 frames otimizados, com versão reduzida no mobile.
- **anime.js** para micro-detalhes: desenho de traços SVG (`stroke-dashoffset`) das "linhas de rotina/agenda" que se organizam na Fase 3, pulso do scroll-cue, brilhos de luz, partículas de "peso" caindo, contadores discretos (se houver).
- **21st.dev** apenas como referência pontual de padrão de componente. NÃO usar Elementor nem estética de template/entrance-animation genérica.
- **Progresso sutil:** um fio dourado vertical (`--dourado`) à lateral que se preenche conforme as fases avançam, reforçando a sensação de jornada.

**Fases narrativas (cada uma com sua paleta, luz e micro-copy em HTML real sobreposto, aparecendo/saindo por fase):**

- **FASE 0 — ABERTURA / HERÓI (0%):** herói grande em Cormorant com a frase-assinatura e ênfase-na-palavra: "A vida muda quando você decide ser *protagonista*." + subhead curta ("Mentoria Edificar-se — uma jornada de dois meses para reorganizar a sua vida por dentro.") + CTA primário "Quero me candidatar" + scroll-cue pulsante convidando a rolar.
- **FASE 1 — SOBRECARGA / CAOS (abstrato):** tons espresso/nogueira-deep, luz baixa, grão mais visível, vinheta fechada. AINDA SEM mulher nítida — apenas uma SILHUETA FEMININA DIFUSA/DESFOCADA (baixo contraste, `filter: blur`, quase dissolvida) sugerida dentro de camadas translúcidas amadeiradas e fragmentos de tarefas/relógios/agenda flutuando em desordem; parallax denso, leve tremor (anime.js). Copy (fade-up escalonado): "Você dá conta de tudo. Menos de você." / "Rotina no automático. Decisões sem critério. Culpa ao dizer não."
- **FASE 2 — A DECISÃO / PAUSA:** entram `--siena`/`--mogno`, a luz sobe um grau, os fragmentos desaceleram e a silhueta COMEÇA A GANHAR FOCO (o blur reduz, o contorno se define). Um respiro. Copy: "Até o dia em que você decide parar de reagir — e começar a conduzir."
- **FASE 3 — ORGANIZAÇÃO:** paleta abre para `--caramelo`/`--ocre`/`--areia`, luz dourada entrando. A figura humana já se RESOLVE em presença reconhecível (rosto e cor emergindo). Os fragmentos caóticos se ALINHAM: linhas de agenda se organizam em ritmo limpo (SVG desenhando via anime.js), o espaço respira, a postura relaxa. Copy: "Rotina com critério. Limites sem culpa." (a palavra "critério" em itálico serif).
- **FASE 4 — CLAREZA & CONSTÂNCIA:** a mulher agora aparece NÍTIDA e definida; luz dourada estável e quente, composição equilibrada, olhar erguido, movimento firme e sereno. Copy: "*Clareza* para decidir. Constância que se sustenta — uma rotina que sustenta você, não o contrário."
- **FASE 5 — FLORESCIMENTO / ALEGRIA (clímax):** presença humana plenamente NÍTIDA e luminosa; paleta mais saturada (`--ocre` + `--pessego`, luz solar cálida), mulher(es) leve(s), sorriso genuíno (não posado de banco de imagem), ombros abertos; elemento de "florescer" (luz/pétala) sutil em SVG. A resolução total da nitidez (de difuso → definido) é o pagamento visual da jornada. Copy-clímax com a frase-assinatura em script/serif: "Protagonista da própria vida." Aviso discreto no canto: "*imagens conceituais geradas por IA*".
- **CORTE SUAVE:** ao fim da Fase 5, o Ato desprende (unpin) com fade/wipe amadeirado (transição costurada) que entrega o scroll para a seção da Larissa — a protagonista REAL da história.

**Comportamento e regras:**
- Reverso suave: a timeline funciona ao rolar para cima (scrub bidirecional), revertendo as fases com o mesmo easing, sem saltos nem estados presos.
- Todo TEXTO das fases é HTML real posicionado sobre as camadas (nunca embutido em imagem/vídeo), com `aria-label` onde útil e contraste garantido (overlays/gradientes amadeirados por trás do texto).

---

## 5. CONTEÚDO REAL, CTAs E ARQUITETURA DE CONVERSÃO

**Fatos reais (use APENAS estes — não inventar módulos, aulas, datas, formato, números ou preços):**
- Larissa Belo — autora, mentora e palestrante de autoliderança e posicionamento feminino. Mineira, hoje vive no Rio de Janeiro.
- Livro: **"Edificar: Tudo Começa em Você"**.
- Programa: **Mentoria Edificar-se** — jornada de **DOIS MESES**, próxima e profunda, por **candidatura**, com **vagas limitadas por turma**.
- Pilares/linguagem (para o método em 3 pilares): **autoliderança e clareza**; **organização da vida e da rotina + equilíbrio entre pessoal e profissional**; **decisões com critério, limites sem culpa e constância sustentável** — retomar o controle da própria vida.
- NUNCA escreva "4 encontros" nem "30 dias" (isso é de outra mentoria, a Equalize). Use SÓ a LINGUAGEM de organização/rotina/equilíbrio, jamais os fatos de outro programa.
- Instagram: **@larissabelomonteiro** → https://www.instagram.com/larissabelomonteiro/
- Formulário de candidatura (CTA primário): **https://form.respondi.app/y9JF97yU**
- WhatsApp: botão presente, mas **placeholder de número** — `href="https://wa.me/SEUNUMERO"` com `data-whatsapp` e comentário `<!-- inserir número real depois -->`. NÃO invente número.

**CTAs (conversão em primeiro lugar):**
- **CTA primário único e repetido** ao longo da página, sempre apontando para o formulário respondi.app, abrindo em nova aba (`target="_blank" rel="noopener"`). Varie os rótulos mantendo a mesma intenção: "**Quero me candidatar**", "**Quero reorganizar minha vida**", "**Entrar para a mentoria**".
- **CTA secundário:** "**Falar com a Larissa no WhatsApp**" (placeholder).
- CTA no header (reaparece ao rolar) + CTA sticky no rodapé em mobile.

**Blocos de conversão (linguagem premium/íntima, sem hard-sell):**
- **Filtro de qualificação** (auto-seleção que cria exclusividade, em tom acolhedor e curatorial, nunca excludente-agressivo): "Esta mentoria é para você se… / Não é para você se…". Ex. "é para você se": "você dá conta de tudo, mas sente que se perdeu no processo"; "quer método e acompanhamento, não só motivação". Ex. "não é para você se": "procura fórmula mágica sem se comprometer com o processo".
- **Framing por contraste suave:** "A Edificar-se não é X — é Y" (ex.: "não é um curso que você assiste e esquece — é uma jornada de dois meses, próxima e por curadoria"; "não é sobre fazer mais — é sobre conduzir com critério").
- **Método nomeado em 3 pilares**, usando a linguagem real acima.
- **"O que você vive na jornada"** — bloco de benefícios/o-que-esperar em linguagem, sem prometer entregáveis inexistentes.
- **Escassez REAL e sóbria:** "Vagas limitadas por turma" + indicador visual discreto (uma barra/filete de vagas que preenche ao entrar na viewport, com texto honesto). NUNCA countdown nem "o preço sobe".
- **Prova por autoridade real** (sem números inflados, sem depoimentos): autora de "Edificar: Tudo Começa em Você", palestrante, @larissabelomonteiro. Qualquer número, só se for real e com contenção.
- **FAQ acordeão** (um item aberto por vez, animação ~400ms, ARIA correto) tratando objeções reais: "Como funciona a candidatura?"; "Quanto tempo dura?" (dois meses); "É online ou presencial?" (deixar genérico/a confirmar — NÃO inventar formato); "Para quem é?"; "E se eu não tiver tempo?"; "Como sei se fui selecionada?".

**Seção da Larissa (fotos REAIS do ensaio corporativo):** história em tom íntimo-elegante (mineira, hoje no Rio; autora, mentora, palestrante), com o manifesto e a frase-assinatura, voz dela em primeira pessoa quando fizer sentido. Composição editorial, washes quentes e molduras arredondadas. Fotos reais SOMENTE aqui.

**Seção do livro "Edificar: Tudo Começa em Você":** apresente como origem do método/filosofia. Capa (placeholder de imagem com `alt` descritivo), passagem curta de posicionamento na voz premium (sem reproduzir trechos longos protegidos) e a ponte com a mentoria ("o livro é o convite; a mentoria é a travessia"). Se houver link de compra, deixe placeholder claramente marcado; se não, apenas apresente o livro como prova de autoridade.

---

## 6. IMAGENS

**Mulheres da animação (Ato 1) = conceituais/editoriais geradas por IA, NUNCA apresentadas como clientes/alunas reais.** Estilo: fotografia editorial realista, quente e saturada, luz natural dourada (golden hour), grão fílmico sutil, profundidade de campo cinematográfica, paleta amadeirada (terracota, caramelo, ocre, nogueira, espresso). Mulheres brasileiras diversas (idades, tons de pele, tipos de corpo), adultas, elegantes, expressões autênticas. **ABORDAGEM MISTA — a nitidez da figura evolui com a jornada:** o Ato abre atmosférico/abstrato (a mulher é SILHUETA DIFUSA/DESFOCADA, dissolvida no caos) e vai se RESOLVENDO em presença humana nítida à medida que a clareza chega. Gere, para cada fase, tanto os planos atmosféricos (luz, camadas, grão) quanto a figura no grau de nitidez correspondente:
- **Caos:** silhueta feminina difusa/quase dissolvida, composição apertada, tons profundos, papéis/agenda/relógios flutuando em desordem, sensação de peso e ruído ao redor (mais atmosfera do que rosto).
- **Decisão:** a silhueta ganha contorno, o olhar se ergue, respiração, primeiro raio de luz quente.
- **Organização:** figura já reconhecível (rosto e cor emergindo), ambiente que se abre, linhas e objetos se alinhando, luz aumentando.
- **Clareza/Constância:** mulher NÍTIDA, luz dourada, olhar erguido, movimento sereno, respiro.
- **Florescimento:** mulher plenamente nítida, plena, luminosa, movimento leve, sorriso genuíno; elemento de "florescer" (luz/pétala) sutil.
- **Disclosure obrigatório:** aviso discreto e legível "*imagens conceituais geradas por IA*" perto da animação (canto inferior, em `--nogueira`/`--dourado`) — nunca associado a histórias, nomes ou depoimentos reais.

**Fotos REAIS da Larissa:** SOMENTE na seção dela (e, se houver carrossel, apenas com fotos reais dela). `alt` descritivo. Tratamento de cor quente coerente com a paleta, sem descaracterizar a pessoa real.

Deixe todas as imagens como placeholders bem marcados (`alt` + comentário indicando "substituir por foto real da Larissa" ou "imagem conceitual IA — fase X"), com dimensões definidas e `loading="lazy"` onde apropriado (exceto as do Ato 1, que devem pré-carregar). Sirva WebP/AVIF com fallback e `srcset` quando possível.

---

## 7. REQUISITOS TÉCNICOS

- **Responsivo e performático em desktop E mobile.** No mobile, simplifique o Ato 1 (menos camadas de parallax, menos partículas, imagens mais leves, scrub mais leve ou versão condensada da timeline) mantendo a narrativa das fases. Priorize leveza (o cliente também roda em hardware modesto / Raspberry Pi OS): anime só `transform`/`opacity`, evite repaints pesados, use `will-change` com parcimônia.
- **`prefers-reduced-motion`:** se ativo, DESLIGUE pin/scrub/parallax e as micro-interações, e DESLIGUE o Lenis (scroll nativo); entregue a narrativa do Ato como sequência estática elegante — as fases viram blocos empilhados que aparecem com fade simples, texto sempre visível.
- **Fallback sem CDN / degradação elegante (obrigatório):** se GSAP/ScrollTrigger/Lenis/anime.js não carregarem, a página deve funcionar 100% com scroll nativo (`scroll-behavior: smooth`) e reveals via IntersectionObserver (ou `getBoundingClientRect`). Detecte a presença das libs (`typeof gsap !== 'undefined'`) antes de usá-las. O Ato 1 vira sequência estática de cenas com reveals CSS. Implemente uma **rede de segurança de revelação**: timeouts de segurança escalonados + listener de `visibilitychange` que revela TODO o conteúdo se a página perder o foco — nada pode ficar invisível.
- **Acessibilidade:** HTML semântico (`header`/`main`/`section`/`article`/`footer`, headings em ordem), contraste AA no texto sobre imagens/escuros (use overlays/gradientes amadeirados por trás), foco visível nos CTAs, navegação por teclado, ARIA correto no header e no acordeão (`aria-expanded`, `aria-controls`), `alt` em todas as imagens, ordem de leitura lógica. Todo texto é HTML real e selecionável.
- **Semântica de links:** links reais para Instagram e formulário; `rel="noopener"` em novas abas.

---

## 8. GUARDRAILS (OBRIGATÓRIOS)

- NÃO criar depoimentos fictícios nem associar rostos/nomes gerados por IA a histórias ou clientes reais. As mulheres da animação são conceituais/editoriais, sempre com o aviso "imagens conceituais geradas por IA".
- Fotos reais SOMENTE na seção da Larissa.
- NÃO inventar números de resultado, preços, parcelas, bônus, garantias, tabelas comparativas, countdowns, "o preço sobe", número de encontros, formato exato (online/presencial) nem número de WhatsApp. Use placeholders claramente marcados quando o dado não existir aqui. A escassez é apenas a real e sóbria: vagas limitadas por turma; jornada de dois meses; entrada por candidatura.
- NUNCA usar "4 encontros / 30 dias" (fato de outra mentoria).
- Preservar canais reais: formulário respondi.app (CTA primário) e Instagram @larissabelomonteiro.
- Tom sempre íntimo, forte, elegante e objetivo — sem clichê motivacional, sem gíria de agência, sem excesso de bold/itálico, sem exclamações, sem tom de infoproduto.
- Todo texto em HTML real, nunca dentro de imagem ou vídeo.

---

## 9. CHECKLIST DE VERIFICAÇÃO (cumprir ANTES de considerar pronto)

- [ ] A página abre DIRETO na animação da jornada das mulheres; Larissa só aparece DEPOIS que ela termina; ordem = Ato → Larissa → livro → oferta → benefícios → FAQ → encerramento.
- [ ] Paleta quente amadeirada MAIS saturada, com os tokens exatos em `:root`; nenhum branco puro nem cinza neutro; sombras/bordas tingidas de marrom/vinho; washes radiais e transições costuradas.
- [ ] Par tipográfico Cormorant Garamond (serif display 500) + Hanken Grotesk (sans), com ênfase-na-palavra em itálico serif e (opcional) script só na frase-assinatura.
- [ ] Ato 1 com pin + scrub em GSAP/ScrollTrigger, Lenis sincronizado, anime.js nos micro-detalhes; fases Caos → Decisão → Organização → Clareza/Constância → Florescimento → corte suave; reverso fluido.
- [ ] Abordagem MISTA das imagens: abre atmosférico/abstrato com silhueta feminina DIFUSA e a figura se RESOLVE em nitidez progressivamente, terminando com mulheres nítidas e felizes no clímax.
- [ ] Fatos reais preservados: mentoria de dois meses, candidatura, vagas por turma, livro "Edificar: Tudo Começa em Você", Instagram @larissabelomonteiro, mineira/RJ; sem "4 encontros/30 dias".
- [ ] Guardrails: sem depoimentos/rostos fictícios como reais; aviso "imagens conceituais geradas por IA"; fotos reais só da Larissa; todo texto em HTML real.
- [ ] CTA primário único e repetido → https://form.respondi.app/y9JF97yU (nova aba); CTA secundário WhatsApp com placeholder de número; CTA no header ao rolar + sticky no mobile.
- [ ] Responsivo, leve em mobile; `prefers-reduced-motion` respeitado; fallback completo sem CDN com rede de segurança de revelação (timeouts + `visibilitychange`); acessibilidade AA e ARIA no acordeão.

Entregue a landing page completa (HTML, CSS e JS), pronta para publicar, seguindo rigorosamente a ordem das seções, a paleta amadeirada saturada, o Ato 1 e a arquitetura de conversão descrita.

---

## 10. NOTA DE PUBLICAÇÃO E VERSIONAMENTO (contexto de deploy — NÃO é tarefa de construção)

> Esta seção é orientação para o desenvolvedor/hospedagem, **não** uma instrução de build para você (Fable). Não gere nada de DNS, Cloudflare, domínio ou infraestrutura a partir daqui — apenas construa a página conforme as seções 0–9. Entregue somente os arquivos (HTML/CSS/JS).

Esta é a **versão 3 (V3)** do site e será a **versão PRINCIPAL**. A topologia de publicação alvo é:

- **larissabelo.com.br** → **V3** (esta nova landing) — versão principal.
- **v2.larissabelo.com.br** → **V2** (a experiência cinematográfica anterior), preservada.
- **v1.larissabelo.com.br** → **V1** (o site editorial original), mantida como está.

Ao ficar pronta e aprovada, a V3 assume o domínio principal; a V2 passa a viver no seu subdomínio; a V1 permanece no dela. A associação de domínios é feita fora daqui (Cloudflare/git).