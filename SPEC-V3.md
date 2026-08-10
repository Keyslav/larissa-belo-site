# SPEC V3 — larissabelo.com.br

**Documento normativo.** É a fonte da verdade para construir a V3. Onde a spec for explícita, seguir à risca; onde for omissa, seguir o princípio da §1. Nada de fato novo pode ser inventado (§2).

Status: aprovada para execução · Substitui: `PROMPT-FABLE5-v3.md` (abordagem cinematográfica, descartada)

---

## 1. Princípios

A V3 é a **evolução da V1** (site editorial), não da V2 (experiência cinematográfica). A V2 errou por transformar um site em um filme: a visitante era obrigada a atravessar uma animação antes de encontrar qualquer informação.

| A V3 é | A V3 não é |
|---|---|
| Um **site**: informação acessível, escaneável, com respiro | Uma experiência que exige travessia antes de informar |
| Editorial e calmo, como uma revista cara | Uma "landing de lançamento" com teatro de urgência |
| Movimento discreto a serviço da leitura | Coreografia que sequestra o scroll na abertura |
| Vanilla, leve, robusto | Dependente de CDN para funcionar |

**Princípio-mestre:** *premium ≠ stack pesada.* A referência mais sofisticada das três (socialmediaexperience.com.br) é HTML/CSS/JS puro — sem GSAP, sem Lenis, sem framework. O acabamento vem de **sistema de cor + tipografia + ritmo de seções + timing consistente**. A V3 segue esse caminho.

**Herança explícita:**
- **Da V1** — estrutura editorial, colagem fotográfica no hero, tipografia Fraunces+Jost, reveals fade-up, marquee, tom íntimo.
- **Das referências** — arquitetura de conversão (filtro "é/não é para você", framing por contraste, escassez honesta, FAQ de objeções, CTA sticky mobile), paleta quente **mais saturada**, redes de segurança de revelação.
- **Da V2** — apenas o momento das palavras se organizando, rebaixado de protagonista a **um momento no meio da página** (§5).

---

## 2. Fatos canônicos (fonte da verdade)

Só estes fatos existem. **Não inventar** números, datas, preços, formato, depoimentos, módulos ou garantias.

| Campo | Valor |
|---|---|
| Nome | Larissa Belo |
| Papéis | Autora · Mentora · Palestrante |
| Tema | Autoliderança e posicionamento feminino |
| Programa | **Mentoria Edificar-se** — jornada de **dois meses**, próxima e profunda |
| Entrada | Por **candidatura**, via formulário |
| Vagas | **Limitadas por turma** (escassez real, sem contador) |
| Livro | **Edificar: Tudo Começa em Você** |
| Origem | Mineira, hoje vive no **Rio de Janeiro** |
| Instagram | [@larissabelomonteiro](https://www.instagram.com/larissabelomonteiro/) |
| Formulário (CTA primário) | https://form.respondi.app/y9JF97yU |
| WhatsApp | **Não existe número.** Botão presente, `hidden`, com constante `WHATSAPP_URL = ""` no topo do JS |
| Frase-assinatura | "A vida muda quando você decide ser protagonista." |
| Manifesto | "Edificar-se é o ato de se fortalecer por dentro para sustentar o que se manifesta fora." |

**Proibido:** "4 encontros", "30 dias", qualquer formato (online/presencial), preço, parcelamento, bônus, garantia, contadores de alunas, depoimentos. *(Os "4 encontros/30 dias" pertencem a outra mentoria — a Equalize. Só a linguagem de organização/rotina/equilíbrio é aproveitável, nunca os fatos.)*

**Fotos:** apenas as reais dela, já em `assets/img/` (`larissa-06/09/12/14/25/27/29`, com variantes `-800` para `srcset`). Sem imagens de IA nesta versão — logo, **sem aviso de IA**.

---

## 3. Design system

### 3.1 Tokens de cor

Evolução da V1: mesma família quente, **mais saturada e com mais contraste**. Regra de ouro: **nenhum branco puro, nenhum cinza neutro** — todo neutro é quente; toda sombra e borda é tingida de marrom.

```css
:root{
  /* PAPEL */
  --papel:        #FBF6EF;   /* base clara (V1) */
  --creme:        #F2E9DC;   /* papel secundário (V1) */
  --areia:        #EADCC4;   /* meio-tom quente */

  /* CALOR — âncoras emocionais */
  --terracota:      #B4502A; /* cor-âncora (V1 #B25B38 saturada) */
  --terracota-deep: #8C4325; /* (V1) */
  --siena:          #C36A3D;
  --ambar:          #C68A38;
  --ocre:           #C7A24E;
  --pessego:        #E8C9B4; /* glow cálido (V1 clay-soft) */

  /* MADEIRA / PROFUNDIDADE */
  --nogueira:     #6B4A2C;
  --marsala:      #5B2627;   /* dobra profunda, vinho amadeirado */
  --espresso:     #2B2016;   /* texto e seções escuras (V1) */
  --espresso-soft:#5B4A3B;   /* texto secundário (V1) */

  /* ESTRUTURA — sempre tingidas, nunca cinza */
  --linha:        rgba(43, 32, 22, .14);
  --linha-clara:  rgba(244, 235, 223, .16);
  --sombra:       rgba(43, 32, 22, .18);
  --sombra-forte: rgba(43, 32, 22, .38);
}
```

**Ritmo cromático** (obrigatório): alternar seções claras e escuras para os blocos "pularem" — claro → **dobra escura full-bleed** → claro. Nunca duas dobras escuras seguidas.

Ordem de fundos: `papel` → `creme` → **espresso** (marquee) → `papel` → **espresso/marsala** (reorganização) → `papel` → **marsala** (livro) → `papel` → **espresso** (mentoria) → `creme` → `papel` → **terracota→marsala** (fecho) → `espresso` (rodapé).

**Técnicas de calor:**
- Sombras/bordas tingidas: `rgba(43,32,22,…)`, nunca `rgba(0,0,0,…)`.
- Washes radiais de ambiente nos cantos das dobras escuras: `radial-gradient(…, rgba(198,138,56,.18), transparent 60%)`.
- Transições costuradas entre seções (gradiente de junção), nunca corte seco.
- Grão fílmico global: SVG `feTurbulence` em overlay, `opacity: .045`, `mix-blend-mode: multiply`.

### 3.2 Tipografia

| Papel | Fonte | Uso |
|---|---|---|
| Display | **Fraunces** (Georgia fallback) | h1–h3, números, citações, itálicos de ênfase. Peso 300–500, `line-height` 1.02–1.1, `letter-spacing` levemente negativo |
| Corpo/UI | **Jost** (system-ui fallback) | Corpo peso 300, `line-height` 1.65. Eyebrows caixa-alta, `letter-spacing` .3em, com filete antes/depois |
| Assinatura | **Pinyon Script** | **Exclusivamente** na frase-assinatura, em `--terracota`/`--marsala`. Máximo 2 ocorrências no site |

Carregar via Google Fonts com `preconnect` e `font-display: swap`. Fallback local obrigatório.

**Ênfase-na-palavra** (técnica das três referências): dentro de headlines longas, a palavra que carrega o sentido vai em **itálico do Fraunces** — `ser <em>protagonista</em>`, `rotina com <em>critério</em>`, `<em>clareza</em> para decidir`. Uma ênfase por headline. Excesso de itálico/negrito vira gritaria.

Escala: `h1: clamp(2.5rem, 5vw, 4.1rem)` · `h2: clamp(2rem, 4.2vw, 3.3rem)` · `h3: 1.3rem` · corpo `16px`.

### 3.3 Componentes

- **Botão primário** (`.btn-cheio`): pílula, fundo `--terracota` (gradiente sutil para `--terracota-deep`), texto `--papel`, caixa-alta, `letter-spacing .12em`, sombra tingida, `hover: translateY(-2px)`.
- **Botão secundário** (`.btn-borda`): borda `--linha`, fundo translúcido com `backdrop-filter: blur(10px)`.
- **Cartão**: `border-radius: 18px`, borda quente 1px, fundo translúcido, sombra tingida.
- **Foto**: `border-radius: 18px`, sombra tingida forte; a secundária da colagem leva moldura `6px solid var(--papel)`.
- **Eyebrow**: `<p class="olho"><span></span>Texto<span></span></p>` — filetes dourados laterais.

---

## 4. Arquitetura da página

One-page. **Ordem normativa** — a apresentação da Larissa vem **depois** da dor e da reorganização, mas o site informa desde o primeiro scroll (sem travessia obrigatória).

| # | Seção | id | Fundo | Conteúdo |
|---|---|---|---|---|
| 1 | Barra de anúncio | — | `espresso` | "Candidaturas abertas para a próxima turma" + link "Aplique-se →" |
| 2 | Header sticky | `topo` | transparente → `papel` translúcido ao rolar | Marca "Larissa *Belo*" · nav (Sobre · A Mentoria · Perguntas) · CTA "Quero me candidatar" |
| 3 | **Hero editorial** | `hero` | `papel` | Colagem fotográfica (§4.1) |
| 4 | Marquee | — | `espresso` | Autoliderança ✦ Clareza ✦ Propósito ✦ Presença ✦ Autenticidade — 16 grupos, 90s, bordas mascaradas |
| 5 | A dor silenciosa | `voce` | `creme` | "Isso é *você*?" — 4 itens com índices romanos i–iv, filetes finos |
| 6 | **A reorganização** | `reorganizacao` | `espresso`→`marsala` | Palavras se juntando (§5) — o momento, não a abertura |
| 7 | Sobre a Larissa | `sobre` | `papel` | Colagem de fotos reais + história + callout do livro |
| 8 | O livro | `livro` | `marsala` | Capa + "o livro é o convite; a mentoria é a travessia" |
| 9 | A Mentoria | `mentoria` | `espresso` | 3 pilares numerados + "o que você vive na jornada" + foto sticky |
| 10 | Filtro | `filtro` | `creme` | "É para você se… / Não é para você se…" (2 cartões) |
| 11 | Vagas + CTA | `candidatura` | `papel` | Escassez honesta + CTA principal |
| 12 | FAQ | `faq` | `creme` | 6 perguntas, acordeão, um aberto por vez |
| 13 | Fecho | `contato` | `terracota`→`marsala` | Frase-assinatura em Pinyon + CTA + WhatsApp (oculto) |
| 14 | Rodapé | — | `espresso` | Marca · Instagram · Candidatura · Rio de Janeiro |
| — | CTA sticky mobile | — | — | Aparece após o hero, só ≤640px |

### 4.1 Hero (§3 da tabela) — detalhamento

Grade 2 colunas (texto | colagem), colapsa para 1 coluna com a colagem **acima** do texto no mobile.

- Eyebrow: `Autoliderança & Posicionamento`
- H1 em 3 linhas reveladas em cascata: **"A vida muda quando você *decide* ser protagonista."**
- Lede: "A Mentoria Edificar-se é para mulheres que seguem cumprindo papéis, entregando resultados, mantendo tudo de pé — e estão prontas para aprender a se sustentar por dentro."
- CTAs: primário "Quero me candidatar" · secundário "Conhecer a mentoria" (âncora `#mentoria`)
- Colagem: foto principal (`larissa-17` ou `larissa-12`) em `aspect-ratio 3/4` + foto menor sobreposta no canto inferior esquerdo com moldura de papel + contorno terracota deslocado atrás. Parallax de ±6–8% nas fotos.
- Scroll-cue discreto na base.

### 4.2 Copy essencial das demais seções

**§5 A dor** — "Isso é *você*?" · i. "Você cumpre todos os papéis, entrega resultados, mantém tudo de pé — mas por dentro carrega um cansaço que ninguém vê." · ii. "Vive no limite, como se precisasse provar seu valor todos os dias." · iii. "Tenta manter a constância, mas está sempre cansada demais para sustentar o próprio ritmo." · iv. "A rotina ficou tão automática que, ao se olhar no espelho, você sente falta de si mesma." · fecho: "Se alguma dessas frases te tocou, talvez seja hora de se edificar por dentro."

**§7 Sobre** — "Eu sou a *Larissa*" · "Autora, mentora e palestrante. Ajudo mulheres a desenvolverem autoliderança e clareza para serem protagonistas das próprias vidas — organizando a rotina, as escolhas e a relação consigo mesmas." · "Mineira, hoje vivo no Rio de Janeiro — e carrego comigo a certeza de que tudo começa por dentro." · callout do livro · "Autora · Mentora · Palestrante".

**§9 Mentoria** — "A Mentoria *Edificar-se*" · lede: "Dois meses para transformar a forma como você se relaciona com sua vida, suas escolhas e sua essência." · framing por contraste: "Não é um curso que você assiste e esquece — é uma jornada próxima, por candidatura. Não é sobre fazer mais — é sobre conduzir com critério." · **3 pilares**: 01 Autoliderança e clareza / 02 Organização da vida e da rotina / 03 Decisões, limites e constância · "O que você vive na jornada": acompanhamento próximo; clareza sobre prioridades; rotina reorganizada em torno do que importa; recomeços sem drama e progresso visível.

**§10 Filtro** — *É para você se:* dá conta de tudo mas sente que se perdeu no processo; quer método e acompanhamento, não só motivação; está pronta para olhar para dentro com verdade. *Não é para você se:* procura fórmula mágica sem se comprometer; prefere curso gravado a jornada acompanhada; não está disposta a rever as próprias escolhas.

**§11 Vagas** — "Vagas limitadas por turma. A entrada é por candidatura — cada turma é pequena para o acompanhamento continuar profundo." + filete de vagas que preenche ao entrar na viewport (sem número inventado). CTA "Quero reorganizar minha vida".

**§12 FAQ** — Como funciona a candidatura? · Quanto tempo dura? (dois meses) · É online ou presencial? (*"O formato é apresentado durante o processo de candidatura"* — não inventar) · Para quem é? · E se eu não tiver tempo? · Como sei se fui selecionada?

**§13 Fecho** — Pinyon: "A vida muda quando você decide" + h2 "ser *protagonista*." + CTA "Entrar para a mentoria".

---

## 5. A reorganização (seção 6) — especificação detalhada

O único momento coreografado do site. **Não é a abertura**: a visitante chega aqui já tendo lido hero e dor.

**Conceito:** os fragmentos da rotina — as mesmas frases que sufocam ("reunião às 9h", "buscar na escola", "prazo de entrega", "responder e-mails", "mercado", "relatório", "consulta médica", "aniversário", "treino", "planilha") — começam espalhados e tortos e, conforme a visitante rola, **deslizam para uma coluna alinhada e serena**. Sem figuras humanas, sem canvas, sem imagens de IA: só tipografia em movimento.

**Implementação (vanilla, sem bibliotecas):**
- Pista: `.reorg-run { height: 300vh }` (um momento, não uma jornada — a V2 usava 520vh e cansava).
- Palco: `.reorg-stage { position: sticky; top: 0; height: 100vh }`.
- Progresso `p ∈ [0,1]` calculado por `getBoundingClientRect()` da pista, atualizado em listener de `scroll` com throttle por `requestAnimationFrame`. **Sem Lenis, sem ScrollTrigger.**
- Posições do caos: determinísticas (RNG com semente fixa) para o layout ser idêntico a cada carga.
- Interpolação `caos → ordem` por `transform: translate3d()` + `rotate()`, com `opacity`. Anima **apenas** `transform` e `opacity`.
- Reverso: como `p` é derivado da posição, rolar para cima reverte naturalmente e sem saltos.

**Três estados** (com texto HTML sobreposto, trocando por opacidade):

| p | Estado | Visual | Texto |
|---|---|---|---|
| 0 – .35 | Caos | Fragmentos espalhados, rotações ±25°, opacidade alta, fundo `espresso` | "Tudo ao mesmo tempo.<br>*Todos os dias.*" |
| .35 – .7 | Alinhamento | Deslizam para a coluna, rotação → 0, espaçamento regular | "Até que você começa a *escolher*." |
| .7 – 1 | Ordem | Coluna limpa; 3 fragmentos-prioridade destacados em `terracota`, os demais esmaecem para 25%; fundo transiciona para `marsala` | Manifesto: "Edificar-se é o ato de se fortalecer por dentro para sustentar o que se manifesta fora." |

**Estado sem JS / `prefers-reduced-motion`:** os fragmentos são renderizados **já organizados** em coluna estática por CSS, com os três textos visíveis empilhados. A seção continua fazendo sentido e lendo bem.

**Desempenho:** máximo 12 fragmentos; nenhuma sombra animada; `will-change: transform` apenas enquanto a seção está na viewport.

---

## 6. Sistema de movimento

Herdado da V1, com as redes de segurança das referências.

| Efeito | Parâmetros |
|---|---|
| Curva padrão | `cubic-bezier(.4, 0, .2, 1)` (`--ease-site`) |
| Reveal de texto | `opacity 0→1` + `translateY(25px→0)`, duração `.9s`, delays em cascata via `--d` (`.08s`–`.32s`) |
| Reveal de imagem | `clip-path: inset(100% 0 0 0) → inset(0)`, duração `1.1s` |
| Parallax de foto | imagem 118% da moldura, `top: -9%`, deslocamento ±6–9% conforme posição na viewport |
| Marquee | 16 grupos idênticos, `translateX(0 → -50%)`, 90s linear, bordas mascaradas por gradiente |
| Hover de botão | `translateY(-2px)`, `.4s` |
| FAQ | abertura ~400ms, um item aberto por vez |
| Barra de vagas | `width`/`transform` 1.4s ao entrar na viewport |

**Redes de segurança de revelação (obrigatórias — nada pode ficar invisível):**
1. `IntersectionObserver` como mecanismo principal.
2. Varredura por viewport no `scroll`, com throttle por `requestAnimationFrame`.
3. Varredura inicial após 80ms (conteúdo acima da dobra).
4. Timeouts escalonados: 400ms, 1200ms, 2600ms.
5. `visibilitychange` → se a página perder o foco, revela tudo.
6. Guarda no-JS: os estados iniciais invisíveis só se aplicam sob `html.js` (classe adicionada inline no `<head>`).

Com `prefers-reduced-motion: reduce`: sem parallax, sem marquee animado, sem coreografia; tudo visível de imediato; `scroll-behavior: auto`.

---

## 7. Requisitos técnicos

**Stack: HTML + CSS + JavaScript vanilla. Zero dependências de runtime.** Sem GSAP, sem Lenis, sem anime.js, sem framework, sem build. Única requisição externa: Google Fonts (com fallback local). Justificativa: é o que a melhor referência faz, é o que a V1 fazia, roda leve em hardware modesto e elimina o risco de CDN.

```
index.html              página única
assets/css/style.css    design system + seções
assets/js/main.js       reveals, parallax, reorganização, marquee, FAQ, header
assets/img/             fotos reais (1200px + variantes -800 para srcset)
.assetsignore           *.md, wrangler.jsonc — docs não vão para o deploy
```

- **Responsivo**: pontos de corte 900px e 640px. Mobile: colagem acima do texto, pilares em coluna, CTA sticky, tipografia recalibrada.
- **Performance**: imagens com `srcset`/`sizes` e `loading="lazy"` (exceto a do hero, com `fetchpriority="high"`); animar só `transform`/`opacity`.
- **Acessibilidade**: HTML semântico, headings em ordem, contraste AA (overlays quentes atrás de texto sobre imagem), foco visível, `aria-expanded`/`aria-controls` no acordeão e no menu, `alt` descritivo, skip-link.
- **SEO/social**: `<title>`, `description`, Open Graph completo com `og:image` apontando para foto real.
- **Depuração**: parâmetro `?p=0..1` congela o progresso da seção de reorganização para verificação headless determinística.

---

## 8. Guardrails

1. Nenhum depoimento — nem fictício, nem placeholder que pareça real. A seção não existe até haver depoimentos verdadeiros.
2. Nenhuma imagem de IA nesta versão; apenas fotos reais da Larissa.
3. Nenhum fato fora da §2. Onde o dado não existe, o texto reconhece isso com elegância (ex.: formato "é apresentado durante a candidatura").
4. Sem teatro de urgência: nada de countdown, "o preço sobe", bônus empilhados, ribbons, tabela de preços, contadores inflados. A escassez é a real: vagas limitadas por turma.
5. Sem tom de infoproduto, sem gíria de agência, sem exclamações, sem clichê motivacional.
6. Todo texto em HTML real e selecionável — nunca dentro de imagem.
7. WhatsApp permanece `hidden` até existir número real.
8. A V1 e a V2 permanecem intactas em suas branches/tags e subdomínios.

---

## 9. Critérios de aceite

A execução só está completa quando **todos** forem verificados no navegador (não por inspeção de código):

- [ ] **A1** — A página abre no hero editorial com informação legível; nenhuma animação bloqueia o acesso ao conteúdo.
- [ ] **A2** — Ordem das seções conforme a tabela da §4.
- [ ] **A3** — A reorganização (§5) roda com scrub suave nos dois sentidos, sem saltos, e ocupa 300vh.
- [ ] **A4** — Com JavaScript desativado, a página inteira é legível: fragmentos organizados em coluna estática, todo o conteúdo visível.
- [ ] **A5** — Com `prefers-reduced-motion`, nada anima e todo o conteúdo aparece.
- [ ] **A6** — Zero erros no console. Zero requisições de JS a CDNs.
- [ ] **A7** — Mobile 390px: sem scroll horizontal, colagem acima do texto, CTA sticky aparecendo após o hero, pilares empilhados.
- [ ] **A8** — Todos os links funcionam: formulário (nova aba), Instagram (nova aba), âncoras internas. WhatsApp permanece oculto.
- [ ] **A9** — Nenhum termo proibido no DOM: "4 encontros", "30 dias", preço, depoimento, garantia.
- [ ] **A10** — Contraste AA no texto sobre fundos escuros e sobre imagens.
- [ ] **A11** — Marquee em loop contínuo, sem salto perceptível.
- [ ] **A12** — Nenhum branco puro (`#fff`) nem cinza neutro no CSS de superfícies.

**Verificação:** Chrome headless para as fases (`?p=`) e para os estados sem-JS/reduced-motion; CDP com scroll real para o comportamento em desktop e mobile.

---

## 10. Fora de escopo

Não fazem parte desta entrega (podem virar etapas futuras): imagens conceituais de IA; depoimentos; vídeo; blog; página do livro; integração de checkout; número de WhatsApp; multi-idioma.

---

## 11. Publicação

Construir na branch `v3`. Após aprovação: `v3` → `main`, e `larissabelo.com.br` passa a servir a V3 automaticamente (o Worker do apex constrói a partir da `main`). `v2.larissabelo.com.br` e `v1.larissabelo.com.br` permanecem intocados.
