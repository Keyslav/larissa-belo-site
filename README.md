# larissabelo.com.br

Site de [Larissa Belo](https://www.instagram.com/larissabelomonteiro/) — autora, mentora e palestrante de autoliderança e posicionamento feminino. Landing page da **Mentoria Edificar-se**.

## Versões

| Tag | Descrição |
|---|---|
| `v2.0.0` | Experiência cinematográfica: ato de scroll com cena procedural em canvas (caos→clareza), GSAP + ScrollTrigger + Lenis, direção de arte marfim/champanhe/dourado |
| `v1.0.0` | One-page editorial (Fraunces + Jost, paleta terracota) |

Para rodar uma versão antiga lado a lado: `git worktree add ../site-v1 v1.0.0`

## Stack

HTML, CSS e JS puros. GSAP/ScrollTrigger/Lenis via CDN **com fallback nativo completo** — sem as CDNs o site continua funcional (sticky + scroll listener + IntersectionObserver). Cena de abertura é arte procedural em tempo real ([scene.js](assets/js/scene.js)), determinística, com modo de depuração `?p=0..1` que congela o progresso.

```
index.html            landing completa (ato cinematográfico + seções)
assets/css/style.css  design system "luxo calmo"
assets/js/scene.js    cena canvas caos→clareza (função pura de progresso)
assets/js/main.js     Lenis + ScrollTrigger + capítulos + parallax + FAQ
assets/img/           fotos reais otimizadas (1200px + variantes 800px)
```

## Desenvolvimento local

```bash
python3 -m http.server 8124
# http://localhost:8124  ·  fases da cena: http://localhost:8124/?p=0.7
```

## Deploy

Cloudflare Pages conectado a este repositório (sem build, output `/`). Rollback: painel do Pages (por deploy) ou `git revert` / redeploy de uma tag.

## Pendências

- WhatsApp: preencher `WHATSAPP_URL` em [main.js](assets/js/main.js) para exibir o botão do encerramento.
- Depoimentos reais: seção omitida até existirem (nunca publicar depoimentos fictícios).
