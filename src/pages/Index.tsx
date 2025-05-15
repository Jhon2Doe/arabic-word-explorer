
import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect to the search page
  return <Navigate to="/search" replace />;
};

export default Index;
