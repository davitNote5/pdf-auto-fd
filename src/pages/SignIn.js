import { useNavigate } from "react-router-dom";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

function SignIn() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://https://pdf-auto-bd-78m3.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        localStorage.setItem("isLoggedIn", true);        
        localStorage.setItem("username", username);

        navigate("/form", { replace: true }); // Redirect and replace the history
      } else {
        alert("Invalid username or password.");
      }
    } catch (error) {
      console.error('Login error:', error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-light" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Header with better styling */}
      <header className="bg-dark text-white text-center py-5 shadow-lg rounded-bottom">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>PDF AUTOMATION SYSTEM</h1>
        <p className="lead" style={{ fontSize: '1.2rem' }}>Efficient and Secure Document Automation</p>
      </header>

      {/* Sign-in form */}
      <div className="d-flex justify-content-center align-items-center" style={{ height: 'calc(100vh - 35%)' }}>
        <div className="border p-5 rounded shadow-lg" style={{ width: "400px", backgroundColor: "#fff" }}>
          <h2 className="mb-4 text-center text-dark">Sign In</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Username"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-dark w-100 text-white py-2">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
