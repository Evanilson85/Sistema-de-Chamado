import { useState, createContext, useEffect } from "react";
import firebase from "../services/firebaseConfig";
import { toast } from 'react-toastify';


export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorage = () => {
      const storageUser = localStorage.getItem("sistemaUser");

      if (storageUser) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      }

      setLoading(false);
    };

    loadStorage();
  }, []);

  const signIn = async (email, password) => {

    setLoadingAuth(true);
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then( async ({ user }) => {
        let id = user.uid;

        const userProfile = await firebase.firestore().collection('users').doc(id).get() // informações do Usuario
        
        console.log(userProfile.data().nome)

        let data = {
            id: id,
            nome: userProfile.data().nome,
            avatarUrl: userProfile.data().avatarUrl,
            email: user.email,
        }

        setUser(data);
        storageUser(data)
        setLoadingAuth(false);
        toast.success(`Bem vindo de volta ${userProfile.data().nome}!`)
      })
      .catch(err => {
          console.log(err);
          toast.error('Ops algo deu errado!')
          setLoadingAuth(false)
      })

  }
  

  const signUp = async (name, email, password) => {

    setLoadingAuth(true);
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async ({ user }) => {
        let id = user.uid;

        await firebase.firestore().collection("users").doc(id).set({
            nome: name,
            avatarUrl: null,
        })
        .then(()=> {
            let data = {
                id: id,
                nome: name,
                email: user.email,
                avatarUrl: null,
            }

            setUser(data);
            storageUser(data)
            setLoadingAuth(false);
            toast.success(`Bem vindo a plataforma ${name.split(' ')[0]}!`)
        })

      })
      .catch(err => {
          console.error(err)
          toast.error('Ops algo deu errado!')
          setLoadingAuth(false)
      })
  };

  const storageUser = (data) => {
      localStorage.setItem('sistemaUser', JSON.stringify(data))
  } 

  const signOut = async () => {
      await firebase.auth().signOut()
      localStorage.removeItem('sistemaUser')
      setUser(null)
  }

  return (
    <AuthContext.Provider 
    value={{ 
        signed: !!user, 
        user, 
        loading, 
        signUp,
        signOut,
        signIn,
        loadingAuth,
        setUser,
        storageUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
