# larissabelo.com.br

Site de [Larissa Belo](https://www.instagram.com/larissabelomonteiro/) — autora, mentora e palestrante de autoliderança e posicionamento feminino. Apresenta a **Mentoria Edificar-se**.

## Stack

HTML, CSS e JavaScript puros — sem build, sem dependências. Fontes via Google Fonts (Fraunces + Jost).

```
index.html              página única
assets/css/style.css    design system e efeitos
assets/js/main.js       reveals, parallax, carrossel, scrollspy
assets/img/photos/      fotos otimizadas (1200px + variantes 800px para srcset)
```

## Desenvolvimento local

```bash
python3 -m http.server 8123
# abra http://localhost:8123
```

## Deploy

Hospedado no Cloudflare Pages, conectado a este repositório. Sem etapa de build — output é a raiz do projeto.

## Pendências

- Substituir os depoimentos placeholder (`[ Espaço reservado... ]` em `index.html`) por depoimentos reais.
