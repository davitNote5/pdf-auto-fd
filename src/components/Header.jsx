import { useNavigate } from "react-router-dom";
import { FaPowerOff } from "react-icons/fa6";
function Header({backgroundColor = "#00308F"}) {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User"; // fallback if username not stored

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    navigate("/", { replace: true });  // 🔥 Redirect to login
  };

  return (
    <div className="text-white py-5 shadow-lg rounded-bottom" style={{ backgroundColor }}>
      <div className="d-flex justify-content-center align-items-center">
        {/* Title and welcome message centered */}
        <div className="text-center flex-grow-1">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>PDF AUTOMATION SYSTEM</h1>
          <p className="lead" style={{ fontSize: '1.2rem' }}>Welcome Back {username}!</p>
        </div>

        {/* Logout button aligned right with an icon */}
        <button
          className="btn btn-outline-light  me-5"  // ms-auto for right alignment, me-3 for margin
          onClick={handleLogout}
          style={{fontSize: "2.2rem" , border: "none", alignContent: "center", marginBottom: "1.5%"}}
        >
        <FaPowerOff  />
        </button>
      </div>
    </div>
  );
}

export default Header;