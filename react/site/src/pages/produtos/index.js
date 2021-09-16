import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

import Cabecalho from '../../components/cabecalho'
import Menu from '../../components/menu'

import { Container, Conteudo } from './styled'
import { useState, useEffect, useRef } from 'react';

import LoadingBar from 'react-top-loading-bar'

import Api from '../../service/api';
const api = new Api();

export default function Index() {

    const loading = useRef(null);

    const [produtos, setProdutos] = useState([]);
    const [produto, setProduto] = useState('');
    const [categoria, setCategoria] = useState('');
    const [precode, setPrecode] = useState('');
    const [precopor, setPrecopor] = useState('');
    const [avaliacao, setAvaliacao] = useState('');
    const [descricao, setDescricao] = useState('');
    const [estoque, setEstoque] = useState('');
    const [imagem, setImagem] = useState('');
    const [idAlterando, setIdAlterando] = useState(0);

    async function listar() {
        let r = await api.listar();
        setProdutos(r);
    }

    async function inserir() {
        loading.current.continuousStart();

        if(avaliacao && precode && precopor && estoque) {
            if (idAlterando == 0) {
                let r = await api.inserir(produto, categoria, precode, precopor, avaliacao, descricao, estoque, imagem);
                if (r.erro) 
                    toast.dark(r.erro);
                else 
                    toast.dark('Produto inserido!');
            } else {
                let r = await api.alterar(idAlterando, produto, categoria, precode, precopor, avaliacao, descricao, estoque, imagem);
                if (r.erro) 
                    toast.dark(r.erro);
                else 
                    toast.dark('Produto alterado!');
            }
        } else (
            toast.dark('Só é permitido números nos campos: "Avaliação", "Preço DE", "Preço POR" e "Estoque"')
        );

        limparCampos();
        listar();
    }

    function limparCampos() {
        setProduto('');
        setCategoria('');
        setPrecode('');
        setPrecopor('');
        setAvaliacao('');
        setDescricao('');
        setEstoque('');
        setImagem('');
        setIdAlterando(0);
    }

    function remover(id) {
        confirmAlert({
            title: 'Remover produto',
            message: `Tem certeza que deseja remover o produto ${id} ?`,
            buttons: [
                {
                    label: 'Sim',
                    onClick: async () => {
                        let r = await api.remover(id);
                        if (r.erro)
                            toast.error(`${r.error}`);
                        else {
                            toast.dark('Produto removido');
                            listar();
                        }
                    }
                },
                {
                    label: 'Não'
                }
            ]
        });
    }

    async function editar(item) {
        setProduto(item.nm_produto);
        setCategoria(item.ds_categoria);
        setPrecode(item.vl_preco_de);
        setPrecopor(item.vl_preco_por);
        setAvaliacao(item.vl_avaliacao);
        setDescricao(item.ds_produto);
        setEstoque(item.qtd_estoque);
        setImagem(item.img_produto);
        setIdAlterando(item.id_produto);
    }

    useEffect(() => {
        listar();
    }, [])

    return (
        <Container>
            <ToastContainer />
            <LoadingBar color="#10EAEA" ref={loading} />
            <Menu />
            <Conteudo>
                <Cabecalho />
                <div className="body-right-box">
                    <div className="new-product-box">
                        
                        <div className="text-new-product">
                            <div className="bar-new-product"></div>
                            <div className="text-new-product"> {idAlterando == 0 ? "Novo Produto" : "Alterando Produto " + idAlterando } </div>
                        </div>
                        <div className="sla">
                            <div className="input-new-product1"> 
                                <div className="input-left">
                                    <div className="agp-input"> 
                                        <div className="name-product"> Nome: </div>
                                        <div className="input"> <input type="text" value={produto} onChange={e => setProduto(e.target.value)} /> </div>
                                    </div>
                                    <div className="agp-input">
                                        <div className="category-product"> Categoria: </div>  
                                        <div className="input"> <input type="text" value={categoria} onChange={e => setCategoria(e.target.value)} /> </div> 
                                    </div>
                                    <div className="agp-input">
                                        <div className="evaluation-product"> Avaliação: </div>  
                                        <div className="input"> <input type="text" value={avaliacao} onChange={e => setAvaliacao(e.target.value)} /> </div> 
                                    </div>
                                </div>
                                
                                <div className="input-right">
                                    <div className="agp-input">
                                        <div className="price-product-de"> Preço DE: </div>  
                                        <div className="input"> <input type="text" value={precode} onChange={e => setPrecode(e.target.value)} /> </div>  
                                    </div>
                                    <div className="agp-input">
                                        <div className="price-product-por"> Preço POR: </div>  
                                        <div className="input"> <input type="text" value={precopor} onChange={e => setPrecopor(e.target.value)} /> </div> 
                                    </div>
                                    <div className="agp-input">
                                        <div className="inventory-product"> Estoque: </div>  
                                        <div className="input"> <input type="text" value={estoque} onChange={e => setEstoque(e.target.value)} /> </div> 
                                    </div>
                                </div>
                            </div>
                            
                                <div className="p1">
                                    <div className="agp-input">
                                        <div className="image-product"> Link Imagem: </div>  
                                        <div className="input-link"> <input value={imagem} onChange={e => setImagem(e.target.value)}/> </div>  
                                    </div>
                                    <div className="agp-input-text">
                                        <div className="description-product"> Descrição: </div>  
                                        <div className="text"> <textarea value={descricao} onChange={e => setDescricao(e.target.value)}/> </div>
                                        <div className="button-create"> <button onClick={inserir}> {idAlterando == 0 ? "Cadastrar" : "Alterar"} </button> </div>
                                    </div>
                                </div>
                            
                        </div>
                    </div>

                    <div className="product-registered-box">
                        <div className="row-bar"> 
                            <div className="bar-new-product"> </div>
                            <div className="text-registered-product"> Produtos Cadastrados </div>
                        </div>
                    
                        <table className ="table-user">
                            <thead>
                                <tr>
                                    <th className="coluna-acao"> </th>
                                    <th> ID </th>
                                    <th> Produto </th>
                                    <th> Categooria </th>
                                    <th> Preço </th>
                                    <th> Estoque </th>
                                    <th className="coluna-acao"> </th>
                                    <th className="coluna-acao"> </th>
                                </tr>
                            </thead>
                    
                            <tbody>
                                {produtos.map((item, i) =>
                                    <tr className={i % 2 == 0 ? "linha-alternada" : ""}>
                                        <td> <img src={item.img_produto} alt="" style={{width: '55px', height: '55px'}} /> </td>
                                        <td> {item.id_produto} </td>
                                        <td title={item.nm_produto}> {item.nm_produto != null && item.nm_produto.length >= 25 
                                                ? item.nm_produto.substr(0, 25) + '...' 
                                                : item.nm_produto}  </td>
                                        <td> {item.ds_categoria} </td>
                                        <td> {item.vl_preco_por} </td>
                                        <td> {item.qtd_estoque} </td>
                                        <td className="coluna-acao"> <button onClick={() => editar(item)}> <img src="/assets/images/edit.svg" alt="" /> </button> </td>
                                        <td className="coluna-acao"> <button onClick={() => remover(item.id_produto)}> <img src="/assets/images/trash.svg" alt="" /> </button> </td>
                                    </tr>
                                )}
                                
                            </tbody> 
                        </table>
                    </div>
                </div>
            </Conteudo>
        </Container>
    )
}
