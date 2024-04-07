import { Outlet, createFileRoute } from '@tanstack/react-router';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import "../styles/auth.styles.scss";

export function Login() {
  const { login, register } = useKindeAuth();

  return (
    <div className='login-container'>
      <h1>Welcome to QuillBot-X</h1>
      <p>Please login to continue</p>
      <div>
        <button onClick={() => { register() }} type="button">Sign up</button>
        <button onClick={() => { login() }} type="button">Sign In</button>
      </div>
    </div>
  )
}

const Component = () => {
  const {user} = useKindeAuth();
  
  if (user) {
    return <Outlet />;
  }
  else{
    return <Login/>
  }
}

export const Route = createFileRoute('/_authenticated')({
  component: Component,
});
