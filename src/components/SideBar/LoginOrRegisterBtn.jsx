import { UserPlus, CircleUserRound } from 'lucide-react';
import AnimeContext from '../../contexts/AnimeContext';
import { useContext } from 'react';
import "./sideBar.css";
import { Link } from "react-router-dom";

function LoginOrRegisterBtn() {
  const {
    setLoginRegisterModalIsActive,
    setLoginOrRegister,
    user,
    setUser,
  } = useContext(AnimeContext);

  return (
    <div className="login-or-register-btn-container">

      {user ? (
        <>
          <Link
            className="login-or-register-btn-icon"
            to="/myprofile"
          >
            <CircleUserRound size={30} />
          </Link>
          <div className='logout-btn-container'>
            <button onClick={() => {
              localStorage.removeItem("token");
              setUser(null);
            }}>
              Log Out
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="login-or-register-btn-icon" ><UserPlus size={30} /></div>
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
        </>
      )}

    </div>
  )
}

export default LoginOrRegisterBtn