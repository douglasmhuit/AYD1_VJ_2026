import UserManagement from './pages/UserManagement';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1> Gestor de Usuarios</h1>
        <span className="header-badge"> Panel de Administración</span>
      </header>
      <main>
        <UserManagement />
      </main>
    </div>
  );
}

export default App;