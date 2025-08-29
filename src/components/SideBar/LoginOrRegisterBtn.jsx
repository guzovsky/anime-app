import { UserPlus, CircleUserRound } from 'lucide-react';
import AnimeContext from '../../contexts/AnimeContext';
import { useContext } from 'react';
import "./sideBar.css";

function LoginOrRegisterBtn() {
  const {
    setLoginRegisterModalIsActive,
    setLoginOrRegister,
    user,
    setUser,
  } = useContext(AnimeContext);

  return (
    <div className="login-or-register-btn-container">
      <div className="login-or-register-btn-icon">
        {user ? <CircleUserRound size={30} /> : <UserPlus size={30} />}
      </div>

      {user ? (
        <div>
          <button onClick={() => {
            localStorage.removeItem("token");
            setUser(null);
          }}>
            Log Out
          </button>
        </div>
      ) : (
        <div className='login-or-register-btn-buttons-container'>
          <button onClick={() => {
            setLoginOrRegister("login");
            setLoginRegisterModalIsActive(true);
          }}>
            Login
          </button>
          <button onClick={() => {
            setLoginOrRegister("register");
            setLoginRegisterModalIsActive(true);
          }}>
            Register
          </button>
        </div>
      )}

    </div>
  )
}

export default LoginOrRegisterBtn