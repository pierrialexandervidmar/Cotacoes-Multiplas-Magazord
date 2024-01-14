const valoresPreparados = (resultados) => {
    const allResults = [].concat(...resultados);
    const valoresFrete = allResults.map(resultado => resultado.valor);
    const valoresOrdenados = valoresFrete.sort((a, b) => a - b);

    return valoresOrdenados;
}

const prazosPreparados = (resultados) => {
    const allResults = [].concat(...resultados);
    const valoresFrete = allResults.map(resultado => resultado.prazoFinal);
    const valoresOrdenados = valoresFrete.sort((a, b) => a - b);

    return valoresOrdenados;
}

export const retornaQuantidadeCotacoes = (resultados) => {
    const allResults = [].concat(...resultados);
    return allResults.length;
}

/**
 * Retorna a quantidade de transportadoras captadas
 * @param {*} resultados 
 * @returns 
 */
export const retornaQuantidadeTransportadorasCotadas = (resultados) => {
    const allResults = [].concat(...resultados.flat());

    const result = allResults.reduce((acumulador, item) => {
        const { codigo, quantidade } = item;
        if (acumulador[codigo]) {
            acumulador[codigo] += quantidade;
        } else {
            acumulador[codigo] = quantidade;
        }

        return acumulador;
    }, {});

    // Obtemos o número de chaves (códigos) no objeto acumulador
    const quantidadeUnicaTransportadoras = Object.keys(result).length;

    return quantidadeUnicaTransportadoras;
}

/**
 * Retorna um objeto com todas as siglas captadas na cotação
 * @param {*} resultados 
 * @returns 
 */
export const retornaListaTransportadorasCotadas = (resultados) => {
    const allResults = [].concat(...resultados.flat());

    const result = allResults.reduce((acumulador, item) => {
        const { codigo, quantidade } = item;
        if (acumulador[codigo]) {
            acumulador[codigo] += quantidade;
        } else {
            acumulador[codigo] = quantidade;
        }

        return acumulador;
    }, {});

    return result;
}

export const calculaMediaMenoresValoresFrete = (resultados) => {
    const valoresOrdenados = valoresPreparados(resultados);
    const menor = retornaMenorValor(resultados)
    const segundo = retornaSegundoMenorValor(resultados)
    const media = (menor + segundo) / 2;

    return media;
}

export const calculaDiferencaMenoresValoresFrete = (resultados) => {
    const valoresOrdenados = valoresPreparados(resultados);
    const menor = retornaMenorValor(resultados)
    const segundo = retornaSegundoMenorValor(resultados)
    const diferenca = segundo - menor;

    return diferenca;
}

export const retornaMenorValor = (resultados) => {
    const valoresOrdenados = valoresPreparados(resultados);
    const menor = valoresOrdenados[0];

    return menor;
}


export const retornaSegundoMenorValor = (resultados) => {
    const valoresOrdenados = valoresPreparados(resultados);
    const menor = valoresOrdenados[0];
    const segundo = valoresOrdenados.find(valor => valor !== menor);

    return segundo;
}


export const retornaMenorPrazo = (resultados) => {
    const valoresOrdenados = prazosPreparados(resultados);
    const menor = valoresOrdenados[0];

    return menor;
}

export const retornaSegundoMenorPrazo = (resultados) => {
    const valoresOrdenados = prazosPreparados(resultados);
    const menor = valoresOrdenados[0];
    const segundo = valoresOrdenados.find(prazoFinal => prazoFinal !== menor);

    return segundo;
}