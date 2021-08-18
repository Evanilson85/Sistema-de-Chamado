import { useState, useContext } from "react";
import "./profile.css";
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiSettings, FiUpload } from 'react-icons/fi'
import { AuthContext } from "../../contexts/auth";
import avatar from '../../assets/avatar.png'
import firebase from '../../services/firebaseConfig'


const Profile = () => {

    const { user, signOut, storageUser, setUser } = useContext(AuthContext);

    const [nome, setNome] = useState(user && user.nome)
    const [email, setEmail] = useState(user && user.email)
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)
    const [image, setImage] = useState(null)

    const handleUpload = async () => {

        const currentId = user.id

        const uploadTask = await firebase.storage().ref(`images/${currentId}/${image.name}`)
        .put(image)
        .then(async () => {
            
            await firebase.storage()
                .ref(`images/${currentId}`)
                .child(image.name)
                .getDownloadURL()
                .then( async (url) => {
                    let urlPhoto = url
                    
                    await firebase.firestore()
                        .collection('users')
                        .doc(user.id)
                        .update({
                            avatarUrl: urlPhoto,
                            nome: nome
                        })
                        .then( () => {
                            let data = {
                                ...user,
                                avatarUrl: urlPhoto,
                                nome: nome
                            }
                            setUser(data)
                            storageUser(data)
                        })
                        .catch(err => {console.log(err)})

                })

        })

    }

    const handleSave = async (event) => {
        event.preventDefault()
        
        if(image === null && nome !== '') {
            await firebase.firestore()
                .collection('users')
                .doc(user.id)
                .update({
                    nome: nome
                })
                .then(() => {
                    let data = {
                        ...user,
                        nome: nome
                    }
                    setUser(data)
                    storageUser(data)
                })
        } else if (nome !== '' && image !== null) {

            handleUpload()

        }
    }

    const handleFile = (event) => {

        let { files } = event.target
        
        if(files[0]) {
            const image = files[0]

            if(image.type === 'image/jpeg' || image.type === 'image/png') {
                setImage(image)
                setAvatarUrl(URL.createObjectURL(files[0]))
            } else {
                alert('Envie uma imagem do Tipo PNG ou JPEG')
                setImage(null)
                return null
            }
        }

    }

    return (
        <div>
            <Header/>
            <div className='content'>
                <Title name='Meu perfil'>
                    <FiSettings size={25} ></FiSettings>
                </Title>

                <div className='container'>

                    <form className='form-profile' onSubmit={handleSave}>

                        <label className='label-avatar'>
                            <span>
                                <FiUpload color='#fff' size={25} />
                            </span>
                            <input type='file' onChange={handleFile} accept='image/*'/> <br/>

                            {avatarUrl === null ?
                                <img src={avatar} width='250' height='250' alt='foto de Perfil'/>
                                :
                                <img src={avatarUrl} width='250' height='250' alt='foto de Perfil'/>
                            }
                        </label>
                        
                        <label>Nome</label>
                        <input type='text' value={nome} onChange={(e) => setNome(e.target.value)} />
                        
                        <label>Email</label>
                        <input type='text' value={email} disabled={true} />

                        <button type='submit' >Salvar</button>
                    </form>

                </div>
                
                <div className='container'>
                        <button className='logout-btn' onClick={()=>{signOut()}}> Sair </button>
                </div>
            </div>
        </div>
    )
};

export default Profile;
