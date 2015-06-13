# Escalonador de processos utilizando algoritmo de Round-Robin
## Simulador
Veja o simulador funcionando [aqui](http://ericalves.github.io/escalonador-robin-round).


## Objetivo
Este trabalho tem por objetivo implementar o algoritmo de escalonamento de processos de Round-Robin em um simulador de escalonamento de processos, com finalidade de obter maiores conhecimentos sobre escalonamento de processos em estudos para a disciplina de Sistemas Operacionais dos cursos de Ciência da computação e Sistemas de Informação da Universidade Feevale.


##Funcionamento do escalonador

Uma unidade de tempo, denominada Quantum é definida. Esta unidade será o tempo que cada processo ficará em execução na CPU. Caso o tempo de execução do processo que está sendo executado pela CPU atinja valor igual o Quantum, este processo é realocado para o final da fila de processos e a CPU é alocada para a execução do próximo processo da fila.

No funcionamento do escalonador, o processador retira o primeiro processo da fila e inicia a sua execução. Caso a execução não esteja finalizada após o decorrer de um Quantum, ocorre uma interrupção no processamento e o processo é inserido no fim da fila.

Caso a execução do processo finalize antes de um Quantum, a CPU é liberada e inicia a execução do próximo processo.

Na casualidade de ocorrer I/O, a CPU também é liberada para a execução do próximo processo da fila. Caso o processo com I/O chegue na CPU para execução já com a entrada, este entra em rotina de processamento.

O valor de quantum para utilização em um escalonador de Round Robin é recomendado entre *10ms* e *100ms*, por serem valores medianos. Um Quantum muito baixo gerará um custo alto de troca de contexto (processo de troca de processo em execução), enquanto um Quantum muito alto gerará demora na execução dos próximos processos.


##Instruções de utilização

Dados a serem informados para o início da simulação:
* **Quantum**: Informado em ms, é a definição do tempo em que a CPU ficará alocada no processamento de cada processo da fila;
* **Quantidade de Proc. no minuto**: Determina a quantidade de processos que o simulador criará e adicionará na fila de execução no decorrer de um minuto (60000ms);
* **Tempo máx. de vida**: Informado em ms, é o tempo máximo que um processo necessitará da CPU alocada nele para finalizar sua execução. Para uma maior realidade na simulação, visando que nem todos os processos possuem tempo de execução igual, no funcionamento do simulador Escalonador, é gerado um número randômico entre 1 e o tempo máximo de vida informado no início da simulação para cada novo processo gerado;
* **Chance de processo I/O Bound**: Informado em %, determina a chance que o processo tem de necessitar uma interrupção de espera de I/O;
* **Tempo de espera de I/O**: Informado em ms, determina a quantidade de tempo que o processo esperará pela entrada ou saída de dados até ser retomada sua execução.

*ms: Milissegundos, unidade de tempo, onde 1 Minuto = 60000 Milissegundos.


##Execução

Durante a execução do simulador Escalonador, os resultados da simulação são exibidos em tempo real ao usuário. São eles:

* **Status do simulador**: Indica se o simulador está em funcionamento (Status Executando) ou se está parado aguardando ação de informação dos dados para início da simulação (Status Parado);
* **Ciclos realizados**: Informa o número de vezes em que a CPU passou por todos os processos da fila e executou cada processo durante um Quantum;
* **Processos criados**: Informa o número total de processos criados pelo simulador desde o início da simulação;
* **Processos concluídos**: Informa o número de processos que já entraram em execução o número de vezes necessárias para completar seu ciclo de vida;
* **Processos I/O gerados**: Informa o número de processos com interrupção de I/O gerados. Este número é gerado com base no item Chance de processo I/O Bound, informado no início da simulação, juntamente com uma função randômica que determina dentro da porcentagem informada, qual processo sofrerá a interrupção de aguardar I/O;

Também durante a execução do simulador, dados do funcionamento do escalonador são exibidos em tempo real ao usuário na tabela de execução. São eles:

* **ID do Processo**: Gerado randomicamente pela aplicação, este número é a chave de identificação do processo. É única para aquele processo e não se repete entre a lista de processos;
* **Tempo de vida do processo**: Indica o tempo que o processo necessitará ficar em execução na CPU até ser finalizado. Para uma maior realidade do funcionamento do escalonador, visando que nem todos os processos possuem tempos de execução iguais, para cada processo a aplicação gera um tempo de vida randômico entre o número 1 e o Tempo de vida máximo informado pelo usuário no início da simulação;
* **Em processamento**: Indica a quantidade de tempo o processo ficou em execução na CPU;
* **Tempo de espera (restante)**: Em processos que não possuam I/O Bound, é gerado zerado pela aplicação. Nos processos que possuem interrupção de I/O Bound, este número indica a quantidade de tempo que este processo ainda necessita de processamento na CPU para que seja finalizada a etapa do I/O Bound e, então, iniciar seu processamento de fato. Esta informação é apresentada de forma decrescente.
* **Status do processo**: Indica o que está ocorrendo com o processo naquele instante. O status do processo pode ser indicado nos seguintes termos:
    * **Aguardando**: Indica que o processo está aguardando a alocação da CPU em sí para que seja executado;
    * **Concluído**: Indica que o processo já esteve em execução por um tempo necessário para que esgote seu tempo de vida. Em casos de processos que possuam I/O Bound, esta interrupção também já foi finalizada. Indica que a execução do processo foi finalizada;
    * **Esperando IO**: Indica que o processo está aguardando I/O Bound. Na coluna Tempo de espera (restante), é possível visualizar por quanto tempo este processo ainda ficará aguardando I/O para que, ao finalizar este tempo, entre em execução;
    * **Processando**: Indica que a CPU está alocada para este processo durante um Quantum.


##Integrantes

[Eric Alves da Rocha](https://github.com/ericalves)

Gabriel Eduardo Martini

Renan Correia da Silva