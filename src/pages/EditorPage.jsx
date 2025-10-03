import { useAuth } from "../context/AuthContext";
import { AurelioBuilderProvider } from "../context/AurelioBuilderContext";
import { Editor } from "../components/Editor";
import { useNavigate } from "react-router-dom";

function EditorPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleExit = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      // Si hay error en logout, al menos redirigir a login
      navigate("/login");
    }
  };

  return (
    <AurelioBuilderProvider>
      <Editor onExit={handleExit} />
    </AurelioBuilderProvider>
  );
}

export default EditorPage;