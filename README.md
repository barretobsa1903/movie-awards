
# 🎬 Golden Raspberry Awards Dashboard (Angular)

Este projeto é uma aplicação Angular que exibe um **dashboard interativo** com dados dos vencedores do prêmio **Golden Raspberry Awards** (Framboesa de Ouro). O foco implementar um frontend onde temos integração com uma api, e trabalhar os dados em duas views: Dashboard e List.

---

## 📌 Funcionalidades

✔️ Listar **anos com múltiplos vencedores**  
✔️ Listar **estúdios com maior número de vitórias**  
✔️ Exibir **produtores com maior e menor intervalo entre prêmios**  
✔️ **Buscar filmes vencedores por ano**  
✔️ **Confete animado** para celebrar a busca  
✔️ Testes unitários com Jasmine + Karma

---

## 🧠 Tecnologias utilizadas

- [Angular 16+](https://angular.io/)
- TypeScript
- RxJS
- SCSS
- Jasmine + Karma (testes)
- canvas-confetti (efeito de celebração)

---

## 🗂️ Estrutura de Diretórios

```
src/
├── app/
│   ├── core/
│   │   └── services/
│   │       └── movie.service.ts       # Serviço que integra com a API
│   ├── dashboard/
│   │   ├── dashboard.component.ts     # Componente principal do dashboard
│   │   ├── dashboard.component.html   # Template com visualizações e busca
│   │   ├── dashboard.component.scss   # Estilos customizados
│   │   └── dashboard.component.spec.ts# Testes unitários
│   └── app.module.ts
```

---

## 🚀 Como rodar o projeto localmente

### 1. Clone o repositório:

```bash
git clone https://github.com/barretobsa1903/movie-awards.git
cd movie-awards
```

### 2. Instale as dependências:

```bash
npm install
```

### 3. Inicie a aplicação:

```bash
ng serve
```

Abra o navegador e acesse `http://localhost:4200`.

---

## 🧪 Rodando os testes

Para executar os testes unitários:

```bash
ng test
```

O Karma abrirá o navegador e exibirá os resultados dos testes automaticamente.

---

## 🧬 Testes implementados

A aplicação possui testes unitários cobrindo:

- Inicialização do componente (`ngOnInit`)
- Chamada dos métodos:
  - `loadYearsWithMultipleWinners`
  - `loadTopStudios`
  - `loadProducerIntervals`
  - `onSearchWinnersByYear`
- Simulação de chamadas ao serviço (`MovieService`) com `spyOn`
- Atribuição correta de dados recebidos do serviço

---

## 🧾 Exemplo de uso (Busca por ano)

No campo de entrada, informe um ano (ex: `1995`) e clique em **"Buscar"**.  
Se houver dados para aquele ano, os vencedores aparecerão em uma lista com um efeito de confete animado.

---

## 📄 Requisitos

- Node.js 18+
- Angular CLI instalado globalmente:

```bash
npm install -g @angular/cli
```


