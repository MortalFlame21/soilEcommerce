import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <Nav className="flex-column bg-light vh-100 p-3">
      <Navbar.Brand className="d-flex justify-content-center mb-4 mt-2">
        <img src="/logo.png" width={50} alt="logo" />
      </Navbar.Brand>
      <Nav.Item>
        <Nav.Link as={Link} to="/" className="no-blue-link text-center">
          Dashboard
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/users" className="no-blue-link text-center">
          Users
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/products" className="no-blue-link text-center">
          Products
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/reviews" className="no-blue-link text-center">
          Reviews
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default Sidebar;
