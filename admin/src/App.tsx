import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Products from "./pages/Products";
import Reviews from "./pages/Reviews";
import { ApolloProvider } from "@apollo/client";
import client from "../src/apollo/client";
function App() {
  return (
    <ApolloProvider client={client}>
      <div className="d-flex">
        <Sidebar />
        <div className="content p-3">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/products" element={<Products />} />
            <Route path="/reviews" element={<Reviews />} />
          </Routes>
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
