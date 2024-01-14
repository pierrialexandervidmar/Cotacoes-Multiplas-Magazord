import * as Calculos from './Calculos'

export const retornaNomeTransportadoraMaisBarata = (resultados) => {
    const allResults = [].concat(...resultados);
    
    const menorValor = Calculos.retornaMenorValor(resultados);
    const transportadoraMaisBarata = allResults.find(resultado => resultado.valor === menorValor);

    return transportadoraMaisBarata ? transportadoraMaisBarata.codigo : null;
}

export const retornaNomeSegundaTransportadoraMaisBarata = (resultados) => {
    const allResults = [].concat(...resultados);
    
    const segundoMenorValor = Calculos.retornaSegundoMenorValor(resultados);
    const transportadoraMaisBarata = allResults.find(resultado => resultado.valor === segundoMenorValor);

    return transportadoraMaisBarata ? transportadoraMaisBarata.codigo : null;
}