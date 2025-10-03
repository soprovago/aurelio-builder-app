import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
import styles from "./Login.module.css";

const schema = yup.object().shape({
  email: yup.string().email("Email inválido").required("El email es requerido"),
  password: yup.string().required("La contraseña es requerida"),
});

function Login() {
  const { login, loginWithGoogle, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error en inicio de sesión:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      console.error("Error en inicio de sesión con Google:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000] pb-8 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-md w-full space-y-5">
        <div>
          <div className="flex flex-col items-center">
            {/* Logo de Aurelio Builder */}
            <div className="relative mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#ff1b6d] to-[#8b5cf6] rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                  <path d="M2 17L12 22L22 17"/>
                  <path d="M2 12L12 17L22 12"/>
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#ff1b6d] to-[#8b5cf6] bg-clip-text text-transparent">
              Aurelio Builder
            </h1>
            <p className="text-xs text-gray-500 mt-1">by WEMax</p>
          </div>
          
          <h2 className="mt-6 text-center text-3xl font-medium text-white">
            Bienvenido a Aurelio Builder
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            El constructor visual de páginas web más avanzado
          </p>
        </div>
        
        {/* Botón de inicio de sesión con Google */}
        <div className="mt-5">
          <div className={styles.divider}>
            <span className="px-2 bg-[#000000] text-gray-400">Iniciar sesión con</span>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-center">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading || isSubmitting}
                className={`flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-[#1e1e1e] hover:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff1b6d] rounded-full min-h-[48px] ${styles.googleButton}`}
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                Continuar con Google
              </button>
            </div>
          </div>
          
          <div className={styles.divider}>
            <span className="px-2 bg-[#000000] text-gray-400">O continuar con</span>
          </div>
        </div>
        
        {/* Formulario de inicio de sesión tradicional */}
        <form className={`mt-4 space-y-4 ${styles.formContainer} bg-[#000000] border border-[#333333] p-6 rounded-2xl`} onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Correo electrónico
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                autoComplete="email"
                className={`appearance-none relative block w-full px-3 py-3 rounded-full sm:text-sm bg-[#1e1e1e] border border-[#333333] placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#ff1b6d] focus:border-[#ff1b6d] ${styles.input}`}
                placeholder="Ingresa tu correo electrónico"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Contraseña
              </label>
              <input
                {...register("password")}
                id="password"
                type="password"
                autoComplete="current-password"
                className={`appearance-none relative block w-full px-3 py-3 rounded-full sm:text-sm bg-[#1e1e1e] border border-[#333333] placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#ff1b6d] focus:border-[#ff1b6d] ${styles.input}`}
                placeholder="Ingresa tu contraseña"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-400">
                    Error de inicio de sesión
                  </h3>
                  <div className="mt-2 text-sm text-red-300">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#ff1b6d] focus:ring-[#ff1b6d] border-gray-700 rounded bg-[#1e1e1e]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Recordarme
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-[#ff1b6d] hover:text-[#ff1b6d]/90">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-[#ff1b6d] hover:bg-[#ff1b6d]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff1b6d] ${styles.button}`}
            >
              {(isLoading || isSubmitting) ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className={`h-5 w-5 text-white ${styles.spinner}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : (
                "Acceder a Aurelio Builder"
              )}
            </button>
          </div>
        </form>
        
        {/* Enlaces adicionales */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-400">
            ¿No tienes una cuenta?{" "}
            <Link to="/signup" className="font-medium text-[#ff1b6d] hover:text-[#ff1b6d]/90">
              Crear cuenta gratuita
            </Link>
          </p>
          <p className="text-xs text-gray-500">
            <a href="https://wemaxagency.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff1b6d]">
              Powered by WEMax Agency
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;