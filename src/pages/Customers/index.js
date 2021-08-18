import './customers.css'
import { useState } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiUser } from 'react-icons/fi'
import firebase from '../../services/firebaseConfig'
import { toast } from 'react-toastify'

const Customer = () => {

    const [ nomeFantasia, setNomeFantasia ] = useState('')
    const [ cnpj, setCnpj ] = useState('')
    const [ endereco, setEndereco ] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()

        if(nomeFantasia && cnpj && endereco) {

            let data = {
                nomeFantasia: nomeFantasia,
                cnpj: cnpj,
                endereco: endereco
            }

            await firebase.firestore().collection('customers').add(data)
            .then(() => {
                setNomeFantasia('')
                setEndereco('')
                setCnpj('')

                toast.info('Empressa cadastrada com sucesso!')
            })
            .catch(err => {
                toast.error('Erro ao cadastrar empressa!')
                console.error(err)
            })
        } else {
            toast.error('Preencha todos os campos!')
        }

    }

    return (
        <div>
           <Header/>
           <div className="content">
                <Title name='Clientes'>
                    <FiUser size={25} />
                </Title>
                <div className="container">

                    <form className="form-profile customers" onSubmit={handleSubmit}>

                        <label>Nome Fantasia</label>
                        <input type="text" placeholder="Nome da sua empresa" value={nomeFantasia} onChange={(e) => setNomeFantasia(e.target.value)} />
                    
                        <label>CNPJ</label>
                        <input type="text" placeholder="CNPJ da sua empresa" value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
                    
                        <label>Endereço</label>
                        <input type="text" placeholder='Endereço da sua empresa' value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                        
                        <button type='submit' >Salvar</button>
                    </form>

                </div>
           </div>
        </div>
    )
}

export default Customer