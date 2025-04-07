import './App.css'

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Talent Calculator</h1>
        <p>Your new React application</p>
      </header>
      
      <main className="app-main">
        <section className="welcome-section">
          <h2>Welcome to Your Application</h2>
          <p>This is your landing page. Start building your features here!</p>
          <button className="primary-button">Get Started</button>
        </section>
      </main>
      
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Talent Calculator</p>
      </footer>
    </div>
  )
}

export default App
