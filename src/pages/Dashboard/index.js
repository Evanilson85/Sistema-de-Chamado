import './dashboard.css'

import { useState, useEffect } from "react";

import Header from "../../components/Header"
import Title from "../../components/Title"
import Modal from "../../components/Modal"
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi'

import { Link } from 'react-router-dom'
import firebase from '../../services/firebaseConfig'
import { format } from 'date-fns' 

const listRef = firebase.firestore().collection('chamados').orderBy('created', 'desc')

export default function Dashboard() {

    const [chamados, setChamados] = useState([])
    const [load, setLoad] = useState(true)
    const [loadingMore, setloadingMore] = useState(false)
    const [isEmpty, setIsEmpty] = useState(false)
    const [lastDocs, setLastDocs] = useState()

    const [showPostModal, setShowPostModal] = useState(false)
    const [detail, setDetail] = useState()

    useEffect(() => {

        const loadChamados = async () => {
    
            await listRef.limit(5).get()
            .then((snapshot) => {
                updateState(snapshot)
            })
            .catch((error) => {
                console.error(error)
                setloadingMore(false)
            })
    
            setLoad(false)
    
        }
        loadChamados()
        
        return () => {}

    }, [])


    const updateState = async (snapshot) => {

        const state = snapshot.size === 0

        if(!state) {
            let list = []

            snapshot.forEach((doc) => {
                list.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().clientes,
                    clienteID: doc.data().clienteID,
                    created: doc.data().created,
                    createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complemento: doc.data().complemento,
                })
            })

            const lastDoc = snapshot.docs[snapshot.docs.length - 1] // pegando o ultimo da lista

            setChamados(chamados => [...chamados, ...list ])
            setLastDocs(lastDoc)
        } else {
            setIsEmpty(true)
        }

        setloadingMore(false)

    }

    const handleMore = async () => {
       
       setloadingMore(true)

       await listRef.startAfter(lastDocs).limit(5).get()
       .then((snapshot) => {
           updateState(snapshot)
       })
       .catch((err) => {
           console.error(err)
       })
    }

    const togglePostModal = (item) => {
       setShowPostModal(!showPostModal)
       setDetail(item)
    }

    if(load) {
        return (
            <div>
                <Header/>
                <div className="content" >

                    <Title name='Atendimento'> 
                        <FiMessageSquare size={25}/>
                    </Title>

                    <div className="container dashboard">
                        <span> Buscando Chamado... </span>
                    </div>
                </div>
            </div>
        )
    }

    return(
        <>
            <Header/>

            <div className="content" >

                <Title name='Atendimento'> 
                    <FiMessageSquare size={25}/>
                </Title>

                {chamados.length === 0 ? (

                    <div className='container dashboard'> 
                        <span> Nenhum Chamado registrado... </span>

                        <Link to='/new' className='new'>
                            <FiPlus size={25} color='#fff'/>
                            Novo Chamado
                        </Link>
                    </div>

                ) : (
                    <>
                        <Link to='/new' className='new'>
                            <FiPlus size={25} color='#fff'/>
                            Novo Chamado
                        </Link>

                        <table> 
                            <thead>
                                <tr>
                                    <th scope='col'>Clientes</th>
                                    <th scope='col'>Assunto</th>
                                    <th scope='col'>Status</th>
                                    <th scope='col'>Cadastrado em</th>
                                    <th scope='col'>#</th>
                                </tr>
                            </thead>
                            <tbody> 
                                {chamados.map((item, index) => {
                                    return(
                                        <tr key={index}> 
                                            <td data-label='clientes'>{item.cliente}</td>
                                            <td data-label='Assunto'>{item.assunto}</td>
                                            <td data-label='Status'> 
                                                <span className='badge' style={{backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999'}}>{item.status}</span>
                                            </td>
                                            <td data-label='Cadastrado'>{item.createdFormat}</td>
                                            <td data-label='#'>
                                                <button className='action' style={{backgroundColor: '#3583f6'}} onClick={() => togglePostModal(item)}> 
                                                    <FiSearch color='#fff' size={17}/>
                                                </button>
                                                <Link to={`/new/${item.id}`} className='action' style={{backgroundColor: '#f6a935'}}> 
                                                    <FiEdit2 color='#fff' size={17}/>
                                                </Link>
                                            </td>
                                        </tr> 
                                    )
                                })}
                            </tbody>
                        </table>
                                 
                        {loadingMore && <h3 style={{textAlign: 'center', marginTop: 15}}>Buscando dados...</h3>}
                        {!loadingMore && !isEmpty && <button className='btn-more' onClick={handleMore} >Buscar mais</button>}
                    </>
                )}

            </div>
            
            {showPostModal && (
                <Modal conteudo={detail} close={togglePostModal} />
            )}

        </>
    )
}