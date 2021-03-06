import { useContext } from 'react'
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../contexts/auth"

const RouterWrapper = ({ component: Component, isPrivate, ...rest }) => {

  const { signed, loading } = useContext(AuthContext) // tenho acesso ao context

  if(loading) {
    return <div></div>
  } 
  
  if(!signed && isPrivate) {
    return <Redirect to='/'/>
  }
  
  if(signed && !isPrivate) {
    return <Redirect to='/dashboard' />
  }
  
  return <Route {...rest} render={(props) => <Component {...props} />} />;

}

export default RouterWrapper