import React from "react";

const Home: React.FC = () => {
  return (
    <div className="text-gray-800flex-col flex min-h-screen bg-gray-100">
      {/* Header */}
      <header className="w-full bg-blue-600 py-4 text-white shadow-md">
        <div className="container mx-auto flex items-center justify-between px-4">
          <h1 className="text-xl font-bold">Doutor Agenda</h1>
          <nav>
            <ul className="flex gap-4">
              <li className="cursor-pointer hover:underline">Início</li>
              <li className="cursor-pointer hover:underline">Contato</li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center">
        <h2 className="text-3xl font-semibold">Hello world!</h2>
      </main>

      {/* Footer */}
      <footer className="w-full bg-blue-600 py-2 text-center text-white shadow-inner">
        © 2025 Doutor Agenda. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default Home;
