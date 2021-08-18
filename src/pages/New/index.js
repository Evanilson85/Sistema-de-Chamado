import './new.css'

import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../contexts/auth'

import Header from "../../components/Header"
import Title from "../../components/Title"
import { FiPlus } from 'react-icons/fi'

import firebase from '../../services/firebaseConfig'
import { toast } from 'react-toastify'

import { useHistory, useParams } from 'react-router-dom'

const New = () => {

    const { id } = useParams()
    const history = useHistory()

    const [assunto, setAssunto] = useState('Suporte')
    const [status, setStatus] = useState('Aberto')
    const [complemento, setComplemento] = useState('')
    
    const [loadCustomers, setLoadCustomers] = useState(true)
    const [customers, setCustomers] = useState([])
    const [customerSelector, setCustomerSelector] = useState(0)

    const [idCustomers, setIdCustomers] = useState(false)

    const { user } = useContext(AuthContext)

    useEffect(() => {
        const loadCustomers = async () => {
            await firebase.firestore().collection('customers').get()
            .then((snapshot) => {

                let list = []

                snapshot.forEach(doc => {
                    list.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia,
                    })
                })

                if(list.length < 1) { 
                    console.log('Nenhuma Empressa Encontrada')
                    setCustomers([{ id: '1', nomeFantasia: 'Freela' }])
                    setLoadCustomers(false)
                    return
                }
                
                // console.log(list)
                setCustomers(list)
                setLoadCustomers(false)

                if(id) {
                    loadId(list)
                }

            })
            .catch((error) => {
                console.error(error)
                setLoadCustomers(false)
                setCustomers([{ id: '1', nomeFantasia: '' }])
            })
        }

        loadCustomers()
      
    }, [])

    const loadId = async (list) => {
        await firebase.firestore().collection('chamados').doc(id).get()
        .then((snapshot) => {
            setComplemento(snapshot.data().complemento)
            setStatus(snapshot.data().status)
            setAssunto(snapshot.data().assunto)

            let index = list.findIndex(item => item.id === snapshot.data().clienteID)
          
            setCustomerSelector(index) // error message
            setIdCustomers(true)
        }).catch(err => {
            console.error(err)
            setIdCustomers(false)
        })
    }


    const handleChangeCustomers = (event) => {

        let { value } = event.target

        setCustomerSelector(value)
      //  console.log(customers[value])
    }

    const handleRegister = async (event) => {
        event.preventDefault()

        if(idCustomers) { // vou altualizar

            let data = { 
                clientes: customers[customerSelector].nomeFantasia,
                clienteID: customers[customerSelector].id,
                assunto: assunto,
                status: status,
                complemento: complemento,
                userID: user.id,
            }

            await firebase.firestore().collection('chamados').doc(id).update(data)
            .then(()=> {
                toast.success('Editado com sucesso')
                setCustomerSelector(0)
                setComplemento('')
                history.push('/dashboard')
            }).catch(err =>{
                console.error(err)
                toast.error('algo deu errado')
            })

            return
       }

        let data = {
            created: new Date(),
            clientes: customers[customerSelector].nomeFantasia,
            clienteID: customers[customerSelector].id,
            assunto: assunto,
            status: status,
            complemento: complemento,
            userID: user.id,
        }

        await firebase.firestore().collection('chamados').add(data)
        .then(() => {
            setComplemento('')
            setCustomerSelector(0)
            toast.success('Chamado criado com sucesso')
        })
        .catch(err =>{
            console.error(err)
            toast.error('Ops erro ao registrar, tente mais tarde.')
        })
    }

    const handleChangeSelect = (event) => { // acho que posso fazer na propria linha

        let { value } = event.target

        setAssunto(value)

    }

    const handleChangeRadio = (event) => { // acho
        
        let { value } = event.target

        setStatus(value)

    }

    return(
        <div>
            <Header/>

            <div className="content" >

                <Title name='Novo chamado'> 
                    <FiPlus size={25}/>
                </Title>

                <div className="container">

                    <form className="form-profile" onSubmit={handleRegister}>

                        <label>Cliente</label>

                        {loadCustomers ? (
                            <input type="text" disabled={true} value='carregando clientes'/>
                        ): (

                        <select value={customerSelector} onChange={handleChangeCustomers} >
                            {customers.map((item, index) => {
                              return (
                                <option key={item.id} value={index}>
                                    {item.nomeFantasia}
                                </option>
                              )
                            })}
                        </select>

                        )}

                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option value='Suporte'>Suporte </option>
                            <option value='Visita Tecnica'>Visita Tecnica </option>
                            <option value='Finaceiro'>Finaceiro </option>
                        </select>

                        <label>Status</label>
                        <div className='status'>
                            <input type='radio' name='radio' value='Aberto' onChange={handleChangeRadio} checked={status === 'Aberto'} />
                            <span>Em Aberto</span>
                          
                            <input type='radio' name='radio' value='Progresso' onChange={handleChangeRadio} checked={status === 'Progresso'} />
                            <span>Em Progresso</span>
                          
                            <input type='radio' name='radio' value='Atendido' onChange={handleChangeRadio} checked={status === 'Atendido'} />
                            <span>Atendido</span>
                        </div>

                        <label>Complemento</label>
                        <textarea value={complemento} onChange={(event) => setComplemento(event.target.value)} type='text' placeholder='Descreva o seu problema'/>

                        <button type='submit'> Registrar </button>
                    </form>

                </div>

            </div>
        </div>
    )
}

export default New