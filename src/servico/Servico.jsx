import './Servico.css'
import '../App.css';
import React, { useEffect, useState } from 'react';
import {
    calculaMediaMenoresValoresFrete,
    retornaMenorValor,
    retornaSegundoMenorValor,
    calculaDiferencaMenoresValoresFrete,
    retornaQuantidadeCotacoes,
    retornaQuantidadeTransportadorasCotadas
} from '../Utils/Calculos'

import { retornaNomeTransportadoraMaisBarata, retornaNomeSegundaTransportadoraMaisBarata } from '../Utils/Filtros'
import { formatarData, formatarMoeda } from '../Utils/Formatacoes';
import axios from 'axios'

function Servico() {
    const baseURL = 'https://api-transporte.magazord.com.br/api/v1/calculoFrete'
    const [servicos, setServicos] = useState([]);
    const [tokenInput, setTokenInput] = useState('');

    const [totalCotacoes, setTotalCotacoes] = useState();
    const [totalTransportadorasCotadas, setTotalTransportadorasCotadas] = useState();
    const [menorValor, setMenorValor] = useState();
    const [segundoMenorValor, setSegundoMenorValor] = useState();
    const [valorMediaMenorValor, setValorMediaMenorValor] = useState();
    const [valorDiferencaMenoresValores, setValorDiferencaMenoresValores] = useState();
    const [nomeTransportadoraMaisBarata, setNomeTransportadoraMaisBarata] = useState();
    const [nomeSegundaTransportadoraMaisBarata, setNomeSegundaTransportadoraMaisBarata] = useState();

    const [servico, setServico] = useState({
        cepOrigem: '',
        cepDestino: '',
        altura: '',
        largura: '',
        peso: ''
    })

    const servicoPayload = {
        "cliente": "",
        "cepOrigem": servico.cepOrigem,
        "cepDestino": servico.cepDestino,
        "dimensaoCalculo": "altura",
        "valorDeclarado": 50,
        "produtos": [
            {
                "altura": Number(servico.altura),
                "largura": Number(servico.largura),
                "comprimento": Number(servico.comprimento),
                "peso": Number(servico.peso),
                "quantidade": 1,
                "valor": 50,
                "volumes": 1,
                "volumesDetalhes": [
                    {
                        "peso": Number(servico.peso),
                        "altura": Number(servico.altura),
                        "largura": Number(servico.largura),
                        "comprimento": Number(servico.comprimento)
                    }
                ]
            }
        ],
        "gateways": [
            {
                "identificador": "api",
                "servicos": [
                    "EXP",
                    "BAU",
                    "TNT",
                    "NTV"
                ]
            }, {
                "identificador": "melhorEnvio",
                "servicos": [
                    "ME2",
                    "ME1",
                    "ME4",
                    "ME5",
                    "ME17",
                    "ME31",
                    "ME12",
                    "ME27",
                    "ME3",
                    "ME15"
                ]
            },
            {
                "identificador": "flixlog",
                "servicos": [
                    "FLIX"
                ]
            },
            {
                "identificador": "kangu",
                "servicos": [
                    "KNG_120720464_E",
                    "KNG_9900_X",
                    "KNG_112347896_E",
                    "KNG_9900_E",
                    "KNG_9900_M",
                    "KNG_1761837_E",
                    "KNG_28719_E",
                    "KNG_12532_E",
                    "KNG_9964_E",
                    "KNG_112350203_E",
                    "KNG_420053_E",
                    "KNG_21_E"
                ]
            }
        ],
        "servicos": [
            "DAY",
            "JET",
            "S2C",
            "RDN",
            "VIP",
            "DML",
            "BPS",
            "BAU",
            "ACE",
            "ATC",
            "PMC",
            "SAT"
        ]
    }

    const handleChange = (event) => {
        setServico({ ...servico, [event.target.name]: event.target.value })
    }

    const handleTokenChange = (event) => {
        setTokenInput(event.target.value);
      }

    const handleConsultar = async (event) => {
        event.preventDefault()

        try {
            // Limpa o estado antes de fazer novas consultas
            setServicos([]);

            const tokensDoCliente = tokenInput.split(',');

            const requests = tokensDoCliente.map(async (token) => {
                const tokenizedPayload = { ...servicoPayload, cliente: token.trim(), servico };
                const result = await axios.post(baseURL, tokenizedPayload);
                console.log(`Resultados para o token ${token}:`, result.data.servicos);
                return result.data.servicos;
            });

            const results = await Promise.all(requests);
            setServicos(results);

            gerarCalculos(results)
            handleImprimir(results)

            limparCampos();

        } catch (error) {
            console.error('Erro ao consultar:', error);
        }
    }

    const limparCampos = () => {
        setServico({
            cepOrigem: '',
            cepDestino: '',
            altura: '',
            largura: '',
            peso: ''
        });
        setTokenInput('');
    };

    const gerarCalculos = (resultados) => {
        setTotalCotacoes(retornaQuantidadeCotacoes(resultados));
        setTotalTransportadorasCotadas(retornaQuantidadeTransportadorasCotadas(resultados))
        setMenorValor(retornaMenorValor(resultados));
        setSegundoMenorValor(retornaSegundoMenorValor(resultados));
        setValorDiferencaMenoresValores(calculaDiferencaMenoresValoresFrete(resultados));
        setNomeTransportadoraMaisBarata(retornaNomeTransportadoraMaisBarata(resultados));
        setNomeSegundaTransportadoraMaisBarata(retornaNomeSegundaTransportadoraMaisBarata(resultados));
    }

    const handleImprimir = (resultados) => {
        console.log(resultados);
        console.log('Menor Valor: ' + retornaMenorValor(resultados));
        console.log('Segundo Menor Valor: ' + retornaSegundoMenorValor(resultados));
        console.log('Média: ' + calculaMediaMenoresValoresFrete(resultados));
    }

    // ============================================================================================

    return (
        <div className="container">
            <h1 className='titulo'>Cotações em múltiplos clientes</h1>
            <p>Obtenha a cotação em tempo real para múltiplos clientes/transportadoras</p>
            <br />

            <form onSubmit={handleConsultar}>
                <div className='col-12'>

                    <div class="row mb-3">
                        <label htmlFor="tokens" className='col-sm-2 col-form-label'>Tokens</label>
                        <div class="col-sm-10">
                            <textarea onChange={handleTokenChange} value={tokenInput || ''} name='tokens' type="text" className='form-control input-style' id='tokens' placeholder='Informe os tokens separados por vírgula, ex: CASA-EPGI-UTJF-PUQC, DECO-KMWG-XDRI-KNNB,'/>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <label htmlFor="cepOrigem" className='col-sm-2 col-form-label'>Origem</label>
                        <div class="col-sm-4">
                            <input onChange={handleChange} value={servico.cepOrigem || ''} name='cepOrigem' type="text" className='form-control input-style' id='cepOrigem' />
                        </div>

                        <label htmlFor="cepDestino" className='col-sm-1 col-form-label'>Destino</label>
                        <div class="col-sm-5">
                            <input onChange={handleChange} value={servico.cepDestino || ''} name='cepDestino' type="text" className='form-control input-style' id='cepDestino' />
                        </div>
                    </div>

                    <div class="row mb-3">
                        <label htmlFor="altura" className='col-sm-2 col-form-label'>Altura</label>
                        <div class="col-sm-4">
                            <input onChange={handleChange} value={servico.altura || ''} name="altura" type="text" className='form-control input-style' id='altura' />
                        </div>

                        <label htmlFor="largura" className='col-sm-1 col-form-label'>Largura</label>
                        <div class="col-sm-5">
                            <input onChange={handleChange} value={servico.largura || ''} name="largura" type="text" className='form-control input-style' id='largura' />
                        </div>
                    </div>

                    <div class="row mb-3">
                        <label htmlFor="comprimento" className='col-sm-2 col-form-label'>Comprimento</label>
                        <div class="col-sm-4">
                            <input onChange={handleChange} value={servico.comprimento || ''} name="comprimento" type="text" className='form-control input-style' id='comprimento' />
                        </div>

                        <label htmlFor="peso" className='col-sm-1 col-form-label'>Peso</label>
                        <div class="col-sm-5">
                            <input onChange={handleChange} value={servico.peso || ''} name="peso" type="text" className='form-control input-style' id='peso' />
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div className="col-sm-5 text-center"> {/* Utilize ml-auto para a margem à esquerda automática */}
                            <input type="submit" className='btn btn-primary col-sm-4' value="Efetuar Cotação" /> {/* Utilize col-sm-12 para ocupar toda a largura da coluna */}
                        </div>
                        <div className="col-sm-7">
                            Total de Cotações Executadas: {totalCotacoes || 0} - Número de Transportadoras Captadas: {totalTransportadorasCotadas || 0}
                        </div>
                    </div>
                </div>
            </form>

            <hr />

            {/* CARDS */}
            <div className="row mb-3 card-unique">
                <div className="card card-unit text-white bg-primary mb-4">
                    <div className="card-header">Menor valor de frete</div>
                    <div className="card-body">
                        <h5 className="card-title">Transportadora: {nomeTransportadoraMaisBarata}</h5>
                        <p className="card-text fw-bold">{menorValor !== undefined ? formatarMoeda(menorValor) : 'R$ 0,00'}</p>
                    </div>
                </div>
                <div className="card card-unit text-white bg-secondary mb-4 mr-3">
                    <div className="card-header">Segundo menor valor de frete</div>
                    <div className="card-body">
                        <h5 className="card-title">Transportadora: {nomeSegundaTransportadoraMaisBarata}</h5>
                        <p className="card-text fw-bold">{segundoMenorValor !== undefined ? formatarMoeda(segundoMenorValor) : 'R$ 0,00'}</p>
                    </div>
                </div>
                <div className="card card-unit text-white bg-success mb-4">
                    <div className="card-header"><strong>&lt;&gt;</strong> entre menor e segundo menor</div>
                    <div className="card-body">
                        <h5 className="card-title">Success card title</h5>
                        <p className="card-text fw-bold">{valorDiferencaMenoresValores !== undefined ? formatarMoeda(valorDiferencaMenoresValores) : 'R$ 0,00'}</p>
                    </div>
                </div>
            </div>

            <div className="row mb-3 card-unique">
                <div className="card card-unit text-white bg-primary mb-4">
                    <div className="card-header">Menor prazo de entrega </div>
                    <div className="card-body">
                        <h5 className="card-title">Primary card title</h5>
                        <p className="card-text fw-bold">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    </div>
                </div>
                <div className="card card-unit text-white bg-secondary mb-4 mr-3">
                    <div className="card-header">Segundo menor prazo</div>
                    <div className="card-body">
                        <h5 className="card-title">Secondary card title</h5>
                        <p className="card-text fw-bold">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    </div>
                </div>
                <div className="card card-unit text-white bg-success mb-4">
                    <div className="card-header"><strong>&lt;&gt;</strong> menor e segundo menor prazo</div>
                    <div className="card-body">
                        <h5 className="card-title">Success card title</h5>
                        <p className="card-text fw-bold">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    </div>
                </div>
            </div>

            <div className="row mb-3 card-unique">
                <div className="card card-unit text-white bg-primary mb-4">
                    <div className="card-header">Menor prazo de entrega </div>
                    <div className="card-body">
                        <h5 className="card-title">Primary card title</h5>
                        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    </div>
                </div>
                <div className="card card-unit text-white bg-secondary mb-4 mr-3">
                    <div className="card-header">Segundo menor prazo</div>
                    <div className="card-body">
                        <h5 className="card-title">Secondary card title</h5>
                        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    </div>
                </div>
                <div className="card card-unit text-white bg-success mb-4">
                    <div className="card-header">Transportadora + captou</div>
                    <div className="card-body">
                        <h5 className="card-title">Success card title</h5>
                        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Servico;