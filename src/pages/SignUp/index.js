
import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/auth"
import { Link } from 'react-router-dom'


import logo from '../../assets/logo.png'

function SignUp() {
  
  const { signUp, loadingAuth } = useContext(AuthContext) 
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if(name && email && password) {
      signUp(name, email, password)
    }
  }

  return (
    <div className='container-center'>
      <div className='login'>
        <div className='login-area'>
          <img src={logo} alt='Sistema logo'/>
        </div>
        <form onSubmit={handleSubmit} >
          <h1>Criar uma Conta</h1>
          
          <input type='text' placeholder='seu nome' value={name} onChange={(e) => setName(e.target.value)} />
          <input type='text' placeholder='email@.com.br' value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type='password' placeholder='**********' value={password} onChange={(e) => setPassword(e.target.value)}/>
          <button type='submit' >{loadingAuth ? 'Carregando...' : 'Cadastrar'}</button>
        </form>

      <Link to='/'>Já tem uma conta | Login</Link>

      </div>
    </div>
  );
}

export default SignUp;
