// ==UserScript==
/* eslint-disable */
// @name         Comprar e vende recurso premium de acordo com % definida
// @namespace    https://br114.tribalwars.com.br
// @version      1.0
// @description  Por conta e risco, o script irá comprar recursos e vender recurso de acordo com cotação
// @author       Vodkazera
// @include https://br*.tribalwars.com.br/*mode=exchange*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_listValues
// @grant GM_deleteValue
// @grant GM_addStyle
// @grant GM_xmlhttpRequest
// ==/UserScript==

(function () {
    var vodkazeraTW = TribalWars.getGameData();
    var tag = vodkazeraTW.world + '' + vodkazeraTW.player.name + '' + vodkazeraTW.screen + '_' + vodkazeraTW.mode;
    var porcentagemDefinicaoDoArmazem = 80;
    var valorDefinidoSobreCotacaoFerro = 800;
    var valorDefinidoSobreCotacaoMadeira = 700;
    var valorDefinidoSobreCotacaoAgila = 700;
    var valorParaVenderRecurso = 200;
    var valoresIniciais = pegarValoresCapacitativo();
    unsafeWindow.window.name = tag;


    if (unsafeWindow.window.name === tag) {
        pegaValoresPorTempo(1200);
        iniciar(5);
    }
    function iniciar(tempoSegundos) {
        setInterval(function () {

            var valorComprado = 0;

            console.log('Valor do pp atual: ' + valorDePp())

            if(valorDePp() > 1000){
                if (calcularPercent(valoresIniciais.madeira, valoresIniciais.armazem) < porcentagemDefinicaoDoArmazem && pegarValoresDosRecursos().madeira >= valorDefinidoSobreCotacaoMadeira) {
                valorComprado = ajustaValorParaCompra(pegarValoresDosRecursos().madeira, 'madeira')
                calculaOfertaEConfirma();
                valoresIniciais.madeira = parseInt(valoresIniciais.madeira) + parseInt(valorComprado);
                console.log('Valores capacitativos: - Madeira: ' + calcularPercent(valoresIniciais.madeira, valoresIniciais.armazem) + '%');
                console.log('Valores dos recursos: - Madeira: ' + pegarValoresDosRecursos().madeira);


            } else if (calcularPercent(valoresIniciais.argila, valoresIniciais.armazem) < porcentagemDefinicaoDoArmazem && pegarValoresDosRecursos().argila >= valorDefinidoSobreCotacaoAgila) {
                valorComprado = ajustaValorParaCompra(pegarValoresDosRecursos().argila, 'argila')
                calculaOfertaEConfirma();
                valoresIniciais.argila = parseInt(valoresIniciais.argila) + parseInt(valorComprado);
                console.log('Valores capacitativos: - Argila: ' + calcularPercent(valoresIniciais.argila, valoresIniciais.armazem) + '%');
                console.log('Valores dos recursos:  - Argila: ' + pegarValoresDosRecursos().argila);

            } else if (calcularPercent(valoresIniciais.ferro, valoresIniciais.armazem) < porcentagemDefinicaoDoArmazem && pegarValoresDosRecursos().ferro >= valorDefinidoSobreCotacaoFerro) {
                valorComprado = ajustaValorParaCompra(pegarValoresDosRecursos().ferro, 'ferro')
                calculaOfertaEConfirma();
                valoresIniciais.ferro = parseInt(valoresIniciais.ferro) + parseInt(valorComprado);
                console.log('Valores capacitativos: - Ferro: ' + calcularPercent(valoresIniciais.ferro, valoresIniciais.armazem) + '%');
                console.log('Valores dos recursos:  - Ferro: ' + pegarValoresDosRecursos().ferro);

            } else {
                console.log('Valores capacitativos: - Madeira: ' + calcularPercent(valoresIniciais.madeira, valoresIniciais.armazem) + '%' + ' - Argila: ' + calcularPercent(valoresIniciais.argila, valoresIniciais.armazem) + '%' + ' - Ferro: ' + calcularPercent(valoresIniciais.ferro, valoresIniciais.armazem) + '%');
                console.log('Valores dos recursos: - Madeira: ' + pegarValoresDosRecursos().madeira + ' - Argila: ' + pegarValoresDosRecursos().argila + ' - Ferro: ' + pegarValoresDosRecursos().ferro);
                setTimeout(cancelar, 1000);
                ajustaValorParaCompra('', 'madeira')
                ajustaValorParaCompra('', 'ferro')
                ajustaValorParaCompra('', 'argila')
            }

            if (pegarValoresDosRecursos().madeira <= valorParaVenderRecurso && pegarValorDisponivelDeMercador() > 0 && pegarValoresCapacitativo().madeira >= valorParaVenderRecurso) {
                valorComprado = ajustaValorParaVenda(pegarValoresDosRecursos().madeira, 'madeira');
                calculaOfertaEConfirma();
                valoresIniciais.madeira = parseInt(valoresIniciais.madeira) - parseInt(valorComprado);
                console.log('Valores capacitativos: - Madeira: ' + calcularPercent(valoresIniciais.madeira, valoresIniciais.armazem) + '%');
                console.log('Valores dos recursos: - Madeira: ' + pegarValoresDosRecursos().madeira);
            } else if (pegarValoresDosRecursos().argila <= valorParaVenderRecurso && pegarValorDisponivelDeMercador() > 0 && pegarValoresCapacitativo().argila >= valorParaVenderRecurso) {
                valorComprado = ajustaValorParaVenda(pegarValoresDosRecursos().argila, 'argila');
                calculaOfertaEConfirma();
                valoresIniciais.argila = parseInt(valoresIniciais.argila) - parseInt(valorComprado);
                console.log('Valores capacitativos: - Argila: ' + calcularPercent(valoresIniciais.argila, valoresIniciais.armazem) + '%');
                console.log('Valores dos recursos:  - Argila: ' + pegarValoresDosRecursos().argila);
            } else if (pegarValoresDosRecursos().ferro <= valorParaVenderRecurso && pegarValorDisponivelDeMercador() > 0 && pegarValoresCapacitativo().ferro >= valorParaVenderRecurso) {
                valorComprado = ajustaValorParaVenda(pegarValoresDosRecursos().ferro, 'ferro');
                calculaOfertaEConfirma();
                valoresIniciais.ferro = parseInt(valoresIniciais.ferro) - parseInt(valorComprado);
                console.log('Valores capacitativos: - Ferro: ' + calcularPercent(valoresIniciais.ferro, valoresIniciais.armazem) + '%');
                console.log('Valores dos recursos:  - Ferro: ' + pegarValoresDosRecursos().ferro);
            }else{
                ajustaValorParaVenda('', 'madeira')
                ajustaValorParaVenda('', 'ferro')
                ajustaValorParaVenda('', 'argila')
            }
            }
            else{

                console.log('pontos premium limitados!')
            }
           


        }, tempoSegundos * 1000);

    }

    function pegarValoresCapacitativo() {

        var capacidade = new Object();

        capacidade.armazem = parseInt($(storage).text());
        capacidade.madeira = parseInt($(wood).text());
        capacidade.argila = parseInt($(stone).text());
        capacidade.ferro = parseInt($(iron).text());

        return capacidade;

    }

    function valorDePp(){

        var valor = document.getElementById('premium_points').innerHTML;


        return parseInt(valor);

    }


    function pegaValoresPorTempo(segundos){
          setInterval(function () {

              console.log('Peguei o valor!!!!');


              pegarValoresCapacitativo();
                 }, segundos * 1000);
    }


    function ultimoRecursoComprado(item){

        if(item == 'wood'){

        }


    }


    function ajustaValorParaCompra(valorParaAdicionar, item) {


        var textBoxItem;

        if (item == 'madeira') {
            textBoxItem = document.getElementsByName("buy_wood")[0];
            textBoxItem.value = valorParaAdicionar;
            textBoxItem.dispatchEvent(new KeyboardEvent('keyup', { 'key': '0' }));
        } else if (item == 'argila') {
            textBoxItem = document.getElementsByName("buy_stone")[0];
            textBoxItem.value = valorParaAdicionar;
            textBoxItem.dispatchEvent(new KeyboardEvent('keyup', { 'key': '0' }));
        } else if (item == 'ferro') {
            textBoxItem = document.getElementsByName("buy_iron")[0];
            textBoxItem.value = valorParaAdicionar;
            textBoxItem.dispatchEvent(new KeyboardEvent('keyup', { 'key': '0' }));
        }
        return textBoxItem.value;

    }

    function ajustaValorParaVenda(valorParaAdicionar, item) {


        var textBoxItem;

        if (item == 'madeira') {
            textBoxItem = document.getElementsByName("sell_wood")[0];
            textBoxItem.value = valorParaAdicionar;
            textBoxItem.dispatchEvent(new KeyboardEvent('keyup', { 'key': '0' }));
        } else if (item == 'argila') {
            textBoxItem = document.getElementsByName("sell_stone")[0];
            textBoxItem.value = valorParaAdicionar;
            textBoxItem.dispatchEvent(new KeyboardEvent('keyup', { 'key': '0' }));
        } else if (item == 'ferro') {
            textBoxItem = document.getElementsByName("sell_iron")[0];
            textBoxItem.value = valorParaAdicionar;
            textBoxItem.dispatchEvent(new KeyboardEvent('keyup', { 'key': '0' }));
        }
        return textBoxItem.value;

    }


    function calculaOfertaEConfirma() {


        setTimeout(exchangeBuy, 8000);

        setTimeout(confirmar, 1000);
    }


    function exchangeBuy() {
        $(".btn-premium-exchange-buy").click(); // eslint-disable-line
    }

    function confirmar() {
        $(".btn-confirm-yes").click(); // eslint-disable-line
    }

    function cancelar() {
        $(".btn-confirm-no").click(); // eslint-disable-line
    }


    function calcularPercent(valorMinimo, valorMaximo) {

        return Math.floor((valorMinimo * 100) / valorMaximo);

    }


    function pegarValoresDosRecursos() {
        var valores = new Object();

        valores.madeira = parseInt($(premium_exchange_rate_wood).text().replace(/\n/g, '').replace('⇄', '').replace(/\s/g, '').substring(0, 3));
        valores.argila = parseInt($(premium_exchange_rate_stone).text().replace(/\n/g, '').replace('⇄', '').replace(/\s/g, '').substring(0, 3));
        valores.ferro = parseInt($(premium_exchange_rate_iron).text().replace(/\n/g, '').replace('⇄', '').replace(/\s/g, '').substring(0, 3));

        return valores;

    }

    function pegarValorDisponivelDeMercador() {

        return parseInt($("#market_merchant_available_count").text());
    }

})();