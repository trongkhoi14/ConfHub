import { Link, Navigate, Outlet, useOutlet } from "react-router-dom";
import { useAppContext } from "../context/authContext";
import { Container, Row } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
// ...

export const AuthLayout = () => {
  const {state} = useAppContext()

  if (!state.user) {
    return <Navigate to="/home" />;
  }

  return (
    <Container className="d-flex w-100 h-100 mw-100">
          <Sidebar/>
          <Outlet/>
    </Container>
  )
};