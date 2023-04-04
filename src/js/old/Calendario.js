class Calendario {
    static diaSelecionado;
    static data = new Date();
    static dia_mes = this.data.getDate();
    static dia_semana = Calendario.data.getDay();
    static mes = this.data.getMonth();
    static mes_string;
    static ano = this.data.getFullYear();
    static pagina;

    static criar() {
        // Apenas cria as 34 casas de dias;
        var dia = `<a class="dia"></a>`
        for (let i = 0; i <= 41; i++) {
            $(".janela-inicio_calendario").append(dia)
        }
        console.log(`Hoje: ${this.dia_mes}/${this.mes + 1}/${this.ano}`)
    }

    static gerar(tipo) {
        switch (tipo) {
            case "atual":
                break;
            case "esquerda":
                if (this.mes > 0) {
                    this.mes--
                } else {
                    this.ano--
                    this.mes = 11
                }
                break;
            case "direita":
                if (this.mes < 11) {
                    this.mes++
                } else {
                    this.ano++
                    this.mes = 0
                }
                break;
        }
        this.data.setFullYear(this.ano)
        // Determina página baseada no mês atual
        this.pagina = this.mes;
        this.formatar()
    }

    static formatar() {
        // Define quantos dias tem no mês (28,29,30,31)
        function diasNoMes(mes, ano) {
            mes++
            if (mes === 2) { // Fevereiro
                // Verifica se o ano é bissexto ou não
                if (ano % 4 === 0 && (ano % 100 !== 0 || ano % 400 === 0)) {
                    return 29;
                } else {
                    return 28;
                }
            } else if (mes === 4 || mes === 6 || mes === 9 || mes === 11) { // Abril, Junho, Setembro, Novembro
                return 30;
            } else { // Janeiro, Março, Maio, Julho, Agosto, Outubro, Dezembro
                return 31;
            }
        }

        // Cria nova data para determinar de qual casa a contagem de dias deve começar
        var formatarData = this.data
        // Define o mês baseado no mês decidido por this.gerar()
        formatarData.setMonth(this.mes)
        // Define o dia como 1
        formatarData.setDate(1)

        // Saída
        var posicaoSemanaDiaUm = formatarData.getDay();
        var diasTotaisMesAtual = diasNoMes(formatarData.getMonth(), formatarData.getFullYear()) + 1
        var diasTotaisMesPassado = diasNoMes(formatarData.getMonth() - 1, formatarData.getFullYear()) + 1
        // chama this.inserir() para atualizar visualmente o calendário
        this.inserir(posicaoSemanaDiaUm, diasTotaisMesAtual, diasTotaisMesPassado)
        this.ativar(posicaoSemanaDiaUm, diasTotaisMesAtual)
        // LOG
        console.log(`Mostrando: ${Inicio.formatar("mes")}/${this.ano}`)
        // return posicaoSemanaDiaUm, diasTotaisMesAtual;
    }

    static inserir(dia_semana_1, dias_totais_mes, dias_totais_mes_anterior) {
        // 1. Insere a quantidade total de dias desse mês, começando pela casa do dia 1[dia da semana]
        // 1. limpa o textcontent de todos os dias
        for (let i = 0; i <= 41; i++) {
            $(".dia")[i].textContent = ""
        }
        // Dia que vai ser impresso, incrementado a cada execução do loop
        var diaImpresso = 0
        // 2. troca o textContent dos elementos começando da casa correta com os dias corretos
        for (let i = dia_semana_1; i <= 41; i++) {
            diaImpresso < dias_totais_mes - 1 ? diaImpresso++ : diaImpresso = 1
            $(".dia")[i].textContent = diaImpresso
        }
        // 3. Pega os ultimos dias do ultimo mes e encaixa nas casas vazias
        if (Calendario.data.getDay() > 0) {
            for (let i = dia_semana_1 - 1; i >= 0; i--) {
                dias_totais_mes_anterior--
                $(".dia")[i].textContent = dias_totais_mes_anterior;
            }
        }

        //       Dentro do calendário, que é uma tabela de 7x6, existem dias do mês anterior,
        // dias no mês atual e do mês posterior.
        //      Quando a seleção do dia é feita, é necessário verificar a qual mês esse dia pertence.

        for (let i = 0; i <= 41; i++) {
            var dia = $(".dia")[i];
            // Verifica os dias da primeira linha pertencem ao mês atual (sendo menor ou igual a 7)
            if (i < 7 && dia.textContent <= 7) {
                if (dia.classList.contains("mesAnterior")) {
                    dia.classList.remove("mesAnterior")
                }
                dia.classList.add("mesAtual")
            }
            // Verifica os dias a partir da segunda linha que sejam menor que 31, atribui para mês atual
            else if (i >= 7 && dia.textContent <= 31) {
                dia.classList.add("mesAtual")
            }
            // Verifica, a partir da casa 28, se existem números menores que 20, o que significaria 
            // que são do proximo mês.
            if (i >= 28 && dia.textContent < 20) {
                if (dia.classList.contains("mesAtual")) {
                    dia.classList.remove("mesAtual")
                }
                dia.classList.add("mesProximo")
            }
            // Verifica se existem números maiores que 7 na primeira linhj, o que significaria
            // que são do mês passado.
            else if (i < 7 && dia.textContent > 7) {
                if (dia.classList.contains("mesAtual")) {
                    dia.classList.remove("mesAtual")
                }
                dia.classList.add("mesAnterior")
            } else {
                dia.classList.remove("mesProximo")
            }
        }
    }

    // Esse método adiciona elementos visuais quando o usuário interage com o caléndario.
    // (Dia selecionado, dia atual, dia com anotação)
    static ativar(posicaoSemanaDiaUm, diasTotaisMesAtual) {

        var dataAtual = new Date();
        var casa = document.querySelectorAll(".dia");
        desfocar();
        // Marca o dia atual do mês atual de uma cor diferente:
        for (let i = posicaoSemanaDiaUm; i <= diasTotaisMesAtual + posicaoSemanaDiaUm; i++) {
            // Quando o mês do dia atual for igual ao mês sendo mostrado no calendário
            if (dataAtual.getMonth() == this.mes &&
                dataAtual.getFullYear() == this.data.getFullYear()) {
                // Contrasta o dia atual
                if (casa[i].textContent == this.dia_mes.toString()) {
                    casa[i].classList.add("presente")
                }
            }
            // Se o mês for diferente, não coloca nenhum contraste
            else {
                casa[i].classList.remove("presente")
            }
        }

        // Quando o usuário clica em um dia, sua estilização muda e reseta estilização dos demais;
        for (let i = 0; i <= 41; i++) {
            if (casa[i].getAttribute('listener') != 'true') {
                casa[i].addEventListener("click", function (event) {
                    desfocar()
                    focar(casa[i])
                })
                casa[i].setAttribute('listener', 'true')
            }
        }

        // Remove classe de foco de todos os elementos
        function desfocar() {
            for (let i = 0; i <= 41; i++) {
                casa[i].classList.contains("foco") ? casa[i].classList.remove("foco") : null;
            }
            // Define dia selecionado como = ""
            Calendario.diaSelecionado = "";
        }

        // Adiciona classe de foco no elemento clicado
        function focar(target) {
            target.classList.add("foco")
            // define o diaSelecionado
            if (target.classList.contains("mesAtual")) {
                Calendario.diaSelecionado = [`${target.textContent},${Calendario.mes + 1},${Calendario.ano}`]
            } else if (target.classList.contains("mesAnterior")) {
                Calendario.diaSelecionado = [`${target.textContent},${Calendario.mes},${Calendario.ano}`]
            } else {
                Calendario.diaSelecionado = [`${target.textContent},${Calendario.mes + 2},${Calendario.ano}`]
            }
        }

        // TODO | Verifica todas as casas atrás de dias que possuam informações cadastradas e adiciona estilização

    }
}