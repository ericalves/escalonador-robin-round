(function(window, document) {

	"use strict";

	var Simulador;

	var StatusSimulador = ['Parado', 'Executando', 'Finalizado'];	

	var StatusProcesso = {
		NOVO: 0,
		PROCESSANDO: 1,
		AGUARDANDO: 2,
		CONCLUIDO: 3,
		ESPERANDO_IO: 4
	};

	// Elementos;
	var btnExecutarSimulador = document.querySelector("#btnExecutarSimulador");
	var inputStatusSimulador = document.querySelector("#inputStatusSimulador");

	// Evento para iniciar o simulador;
	btnExecutarSimulador.addEventListener("click", function(){ Simulador.iniciar() });	

	Simulador = {

		Status: null,

		inputQuantum: document.querySelector("#inputQuantum"),
		inputQtdPorMin: document.querySelector("#inputQtdPorMin"),
		inputTempoVida: document.querySelector("#inputTempoVida"),
		inputPercIOBound: document.querySelector("#inputPercIOBound"),
		inputTempoEspera: document.querySelector("#inputTempoEspera"),
		tableProcessos: document.querySelector("#tableProcessos"),
		inputQtdProcessosCriados: document.querySelector("#inputQtdProcessosCriados"),
		inputQtdCiclos: document.querySelector("#inputQtdCiclos"),
		inputQtdProcConclu: document.querySelector("#inputQtdProcConclu"),
		inputQtdProcIO: document.querySelector("#inputQtdProcIO"),

		iniciar: function() {

			this.tableProcessos.innerHTML = '';

			if (this.validaParametros()) {
				this.setStatus(1);				
				Escalonador.iniciar({
					quantum: this.inputQuantum.value.trim(),
					qtdProcPorMin: this.inputQtdPorMin.value.trim(),
					tempoVidaProc: this.inputTempoVida.value.trim(),
					percIOBound: this.inputPercIOBound.value.trim(),
					tempoEspera: this.inputTempoEspera.value.trim()
				});
			}
		},

		validaParametros: function() {

			return this.validaInput(1, this.inputQuantum, this.inputQtdPorMin, this.inputTempoVida, this.inputTempoEspera) &&
        		this.validaInput(0, this.inputPercIOBound);
		},

	    validaInput: function() {
	      	var valorMinimo = arguments[0];
			//Validando somente números;
			var regex = /^\d+$/;
			var valor = null;
			var erro = false;

			for(var i = 1, l = arguments.length; i < l; i++) {

				valor = arguments[i].value.trim();

				if(valor === "" || valor.match(regex) !== null) {
					if (valorMinimo && window.parseInt(valor, 10) < valorMinimo) {
						window.alert("O valor deve ser maior ou igual a " + valorMinimo + ".");
						erro = true;
					} else if (valor === "") {
						window.alert("Valor dos parâmetros deve ser preenchido e deve ser numérico");
						erro = true;
					}

					if (erro === true) {
						arguments[i].select();
						arguments[i].focus();
						return false;
					}
				}
			}
			return true;
	    },

	    setStatus: function(status) {
	    	this.Status = status;
	    	inputStatusSimulador.value = StatusSimulador[status];

	    	return true;
	    },

	    defineValoresPadroes: function() {
	    	this.inputPercIOBound.value = 30;
	    	this.inputQuantum.value = 100;
	    	this.inputTempoVida.value = 4500;
	    	this.inputTempoEspera.value = 1000;
	    	this.inputQtdPorMin.value = 80;
	    },

	    atualizaQtdProcCriados: function(qtd) {
	    	this.inputQtdProcessosCriados.value = qtd;
	    },

	    statusProcesso: function(processo) {
	      	switch(processo.status) {
	        	case StatusProcesso.NOVO:
					return {
						nome: "Novo",
						className: "processo-status-novo"
					};
	        	case StatusProcesso.PROCESSANDO:
					return {
						nome: "Processando",
						className: "processo-status-processando"
					};
	        	case StatusProcesso.AGUARDANDO:
					return {
						nome: "Aguardando",
						className: "processo-status-aguardando"
					};
	        	case StatusProcesso.CONCLUIDO:
					return {
						nome: "Concluído",
						className: "processo-status-concluido"
					};
	        	case StatusProcesso.ESPERANDO_IO:
					return {
						nome: "Esperando IO",
						className: "processo-status-esperando-io"
					};
	      }
	    },

	    atualizaQtdCiclos: function(qtd) {
	    	this.inputQtdCiclos.value = qtd;
	    },

	    atualizaQtdConclu: function(qtd) {
	    	this.inputQtdProcConclu.value = qtd;
	    },

	    atualizaQtdIO: function(qtd) {
	    	this.inputQtdProcIO.value = qtd;
	    },	    

	    adicionaProcesso: function(processo) {
	    	this.tableProcessos.innerHTML += 
		    	'<tr id="processo' + processo.PID + '">'+
					'<td>' + processo.PID + '</td>' +
					'<td class="tempo-de-vida">' + processo.tempoVida + ' ms</td>' +
					'<td class="tempo-em-processo">' + processo.tempoEmProcesso + ' ms</td>' +
					'<td class="tempo-em-espera">' + processo.tempoEmEspera + ' ms</td>' +
					'<td>' + this.statusProcesso(processo).nome + '</td>' +
				'</tr>';
	    },

	    atualizaProcesso: function(processo) {
	   		var rowProcesso = document.querySelector("#processo" + processo.PID);
	        var estado = this.statusProcesso(processo);
	        //var turnaroundTexto = processo.querySelector(".turnaround");
	        var colunaStatus = rowProcesso.querySelector("td:last-child");
	        //turnaroundTexto.innerHTML = turnaround + "ms";
	        colunaStatus.className = estado.className;
	        colunaStatus.innerHTML = estado.nome;
	        rowProcesso.querySelector(".tempo-em-processo").innerHTML = processo.tempoEmProcesso + ' ms';
	        rowProcesso.querySelector(".tempo-em-espera").innerHTML = processo.tempoEmEspera + ' ms';
	        
	    }
	}

	var Escalonador = {
		quantum: 0, 
		qtdProcPorMin: 0,
		tempoVidaProc: 0, 
		percIOBound: 0, 
		tempoEspera: 0,

		indiceProcAtual: 0,

		processos: [],

		atual: {
			index: -1,
			processo: null
		},

		qtdCiclos: 0,
		qtdProcConclu: 0,
		qtdProcIO: 0,

		qtdProcGerNoMin: 0,
		qtdProcPorSeg: 0,

		timerProcSeg: null,
		timerProcMin: null,

		qtdLoopBuscaProc: 0,

		iniciar: function(parametros){

			this.quantum = parametros.quantum;
			this.qtdProcPorMin = parametros.qtdProcPorMin;
			this.tempoVidaProc = parametros.tempoVidaProc;
			this.percIOBound = parametros.percIOBound;
			this.tempoEspera = parametros.tempoEspera;

			this.zeraParametros();

			this.qtdProcPorSeg = Math.ceil(this.qtdProcPorMin/60);

			this.geraProcessos();

	      	this.timerProcMin = window.setInterval(function(){
	        	this.geraProcessos();
	      	}.bind(this), 61000);

			//window.setTimeout(this.geraProcessos.bind(this), 60000);
			this.timerExecProc = window.setInterval(function() {
				this.executaProcesso();
			}.bind(this), this.quantum);

			console.log('final');
		},

		zeraParametros: function() {
			this.processos = [];
			this.atual.index = -1;
			this.atual.processo = null;

			this.qtdProcGerNoMin = 0;
			this.qtdProcPorSeg = 0;
			this.indiceProcesso = 0;
			this.qtdCiclos = 0;
			this.qtdProcConclu = 0;
			this.qtdProcIO = 0;

		    if(this.timerProcSeg) {
		    	window.clearTimeout(this.timerProcSeg);
		    }

		    if(this.timerProcMin) {
		    	window.clearInterval(this.timerProcMin);
		    }

		    Simulador.atualizaQtdCiclos(this.qtdCiclos);
		    Simulador.atualizaQtdConclu(this.qtdProcConclu);
		    Simulador.atualizaQtdIO(this.qtdProcIO);		    
		},

		geraProcessos: function() {
			console.log(this.qtdProcGerNoMin);
			if (this.qtdProcGerNoMin <= this.qtdProcPorMin) {
				for (var i = 0; i < this.qtdProcPorSeg; i++) {
					this.adicionaProcesso();
					this.qtdProcGerNoMin++;
				};
				this.timerProcSeg = window.setTimeout(this.geraProcessos.bind(this), 1000);
			} else {
				if (this.timerProcSeg) 
        			window.clearTimeout(this.timerProcSeg);
        		this.qtdProcGerNoMin = 0;
			}
		},

		adicionaProcesso: function() {
			var processo = new Processo({
				//escalonador: Escalonador,
				tempoMaxVida: this.tempoVidaProc,
				percentualIO: this.percIOBound,
				tempoIO: this.tempoEspera
			});
			this.processos.push(processo);
			Simulador.adicionaProcesso(processo);
			Simulador.atualizaQtdProcCriados(this.processos.length);
		},

		proximoProcesso: function() {

			this.qtdLoopBuscaProc++;

			this.atual.index ++;

			if (this.processos[this.atual.index] === undefined) {
				this.atual.index = 0;
				this.atual.processo = this.processos[0];
				this.qtdCiclos++;
				Simulador.atualizaQtdCiclos(this.qtdCiclos);
			} else {
				this.atual.processo = this.processos[this.atual.index];
				//this.atual.index++;	
			};

			if (this.qtdLoopBuscaProc >= this.processos.length) {
				if (this.atual.processo.status == StatusProcesso.CONCLUIDO) {
					this.atual.processo = null;
					this.atual.index = -1;
				}

				return;
			}

			if (this.atual.processo.status == StatusProcesso.CONCLUIDO) {
				this.proximoProcesso();
			}
		},

		executaProcesso: function() {

			if (this.timerFimProc)
				window.clearTimeout(this.timerFimProc);

			// primeiro;
			if (this.atual.index === -1) {
				this.atual.index = 0;
				this.atual.processo = this.processos[0];
			} else {
				if ((this.atual.processo.status === StatusProcesso.PROCESSANDO) || (this.atual.processo.status === StatusProcesso.ESPERANDO_IO)) {
					this.atual.processo.para();
				}
				this.qtdLoopBuscaProc = 0;
				this.proximoProcesso();
			}

			if ((this.atual.processo !== null) && (this.atual.processo.getTempoRestante() > 0)) {
				if (this.atual.processo.getTempoRestante() <= this.quantum) {
					this.atual.processo.inicia();
					this.timerFimProc = window.setTimeout(function() {
						this.executaProcesso();
					}.bind(this), this.atual.processo.getTempoRestante());
				} else {
					this.atual.processo.inicia();
				}
			}
		}
	};

	function Processo(opcoes) {

		this.defineTempoEspera = function() {
			var random = ((Math.random()*100)+1);

			if(random <= opcoes.percentualIO) {
				Escalonador.qtdProcIO++;
				Simulador.atualizaQtdIO(Escalonador.qtdProcIO);	
				return opcoes.tempoIO;
			} else {
				return 0;
			}
		};

		this.geraPID = function() {
			return Math.floor(Math.random() * 100000 + 1)
		};

		this.emProcesso = function() {

		};

		this.getTempoRestante = function() {
			if ((this.tempoVida - this.tempoEmProcesso) > 0) {
				//console.log((this.tempoVida - this.tempoEmProcesso));
				return (this.tempoVida - this.tempoEmProcesso);
			} else {
				return 0;
			}			 
		};

		this.para = function() {
			if (this.status === StatusProcesso.ESPERANDO_IO) {
				this.tempoEmEspera -= Date.now() - this.inicioProcesso;

				if (this.tempoEmEspera <= 0) {
					if (this.tempoEmEspera < 0) {
						this.tempoEmProcesso += (this.tempoEmEspera * -1);
					}

					this.tempoEmEspera = 0;
					this.status = StatusProcesso.AGUARDANDO;
				} else {
					this.status = StatusProcesso.ESPERANDO_IO;
				}				
			} else {
				this.tempoEmProcesso += Date.now() - this.inicioProcesso;

				if (this.getTempoRestante() > 0) {
					this.status = StatusProcesso.AGUARDANDO;	
				} else {
					this.status = StatusProcesso.CONCLUIDO;

					Escalonador.qtdProcConclu++;
					Simulador.atualizaQtdConclu(Escalonador.qtdProcConclu);
				}
			}
			
			Simulador.atualizaProcesso(this);
		};

		this.inicia = function() {
			this.inicioProcesso = Date.now();

			if (this.tempoEmEspera > 0) {
				this.status = StatusProcesso.ESPERANDO_IO;
			} else {
				this.status = StatusProcesso.PROCESSANDO;
			}			
			Simulador.atualizaProcesso(this);
		};

		this.dtCriacao = Date.now();
		this.tempoVida = Math.trunc(Math.random() * (opcoes.tempoMaxVida - 1) + 1);
		this.status = StatusProcesso.AGUARDANDO;
		this.inicioProcesso = null;
		this.tempoEmProcesso = 0;

		this.PID = this.geraPID();
		this.IO = false;
		this.tempoEmEspera = this.defineTempoEspera();
	};

	// Inicia o simulador com o status "Parado";
	Simulador.setStatus(0);
	Simulador.defineValoresPadroes();
})(window, document);