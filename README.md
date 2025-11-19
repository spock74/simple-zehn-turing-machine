# Máquina de Turing Interativa

Um simulador visual e educativo, construído com tecnologias web modernas, para explorar os fundamentos da computação de forma prática e intuitiva.

![Pré-visualização da Máquina de Turing Interativa](https://i.imgur.com/nJbK6Xq.png)

## A Proposta

Este projeto é uma implementação de uma Máquina de Turing clássica, projetada com um foco principal: ser uma ferramenta de aprendizado acessível. A interface moderna e interativa permite que estudantes, entusiastas e curiosos possam "sentir" como os algoritmos funcionam em seu nível mais fundamental.

### Filosofia: A Genialidade na Simplicidade

É importante ser intelectualmente honesto: esta não é a ferramenta de simulação mais complexa ou academicamente rigorosa que existe. E isso é intencional.

A Máquina de Turing, quando despida dos formalismos matemáticos, é um conceito surpreendentemente simples. Sua genialidade não reside na complexidade, mas sim em como um modelo tão simples — uma fita, uma cabeça de leitura/escrita e um conjunto de regras — pode computar qualquer coisa que seja computável.

Nossa implementação abraça essa simplicidade. O objetivo não é sobrecarregar com funcionalidades esotéricas, mas sim oferecer uma experiência clara e direta que capture a essência da invenção de Alan Turing. A simplicidade aqui não é uma limitação, mas uma virtude que busca honrar a elegância do conceito original.

## Funcionalidades Principais

- **Simulação Visual da Fita:** Observe a fita infinita e a movimentação da cabeça de leitura/escrita em tempo real.
- **Editor de Regras Interativo:** Crie e modifique o conjunto de transições (o "programa") da máquina com validação de conflitos em tempo real.
- **Controles de Execução:** Execute o programa continuamente, avance passo a passo, pause e reinicie a simulação a qualquer momento.
- **Velocidade Ajustável:** Controle o quão rápido a simulação progride, de passos quase instantâneos a intervalos lentos para análise detalhada.
- **Histórico de Execução:** Um log detalhado mostra cada passo tomado pela máquina, qual regra foi aplicada e o estado resultante.
- **Entrada de Fita Personalizada:** Defina facilmente a configuração inicial da fita antes de cada execução.
- **Exemplos Prontos:** Carregue programas pré-definidos para ver a máquina em ação resolvendo problemas clássicos, como incremento binário e verificação de palíndromos.
- **Design Moderno e Responsivo:** Uma interface limpa, agradável e funcional em diferentes tamanhos de tela.

## Como Usar

A aplicação foi projetada para ser usada diretamente no navegador, sem necessidade de instalação.

1.  **Defina as Regras:** Utilize a tabela "Programa (Regras)" para definir as transições de estado. Cada regra especifica:
    - `Estado`: O estado atual da máquina.
    - `Lê`: O símbolo que a cabeça de leitura encontra na fita.
    - `Novo E.`: O novo estado para o qual a máquina deve transicionar.
    - `Escreve`: O novo símbolo a ser escrito na posição atual da fita.
    - `Move`: A direção para mover a cabeça (`D` para Direita, `E` para Esquerda).
2.  **Insira a Entrada:** No campo "Entrada Inicial na Fita", digite a sequência de símbolos que você deseja processar.
3.  **Execute:**
    - **Executar:** Inicia a simulação contínua na velocidade definida no slider.
    - **Passo:** Executa uma única transição.
    - **Pausar:** Interrompe uma execução contínua.
    - **Resetar:** Restaura a máquina ao seu estado inicial com base na entrada e nas regras atuais.

## Tecnologias Utilizadas

- **React:** Biblioteca para a construção da interface de usuário.
- **TypeScript:** Para um código mais robusto, seguro e manutenível.
- **Tailwind CSS:** Para estilização rápida e consistente.
- **Framer Motion:** Para animações fluidas e declarativas que melhoram a experiência visual.

## Para o Futuro

Este projeto é uma base que pode ser expandida. Algumas ideias para futuras versões incluem:

- [ ] Visualizador de diagrama de estados.
- [ ] Suporte a múltiplas fitas.
- [ ] Compartilhamento de programas através de URLs parametrizadas.
- [ ] Tutoriais guiados para os exemplos.
- [ ] Temas de cores adicionais.

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
