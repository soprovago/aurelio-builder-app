# 🎨 Aurelio Builder

> El constructor visual de páginas web más avanzado - **by WEMax Agency**

![Aurelio Builder](https://img.shields.io/badge/Aurelio_Builder-v1.0.0-ff1b6d?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9ImN1cnJlbnRDb2xvciI+PHBhdGggZD0iTTEyIDJMMiA3TDEyIDEyTDIyIDdMMTIgMloiLz48cGF0aCBkPSJNMiAxN0wxMiAyMkwyMiAxNyIvPjxwYXRoIGQ9Ik0yIDEyTDEyIDE3TDIyIDEyIi8+PC9zdmc+)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=flat-square)
![Status](https://img.shields.io/badge/status-development-orange?style=flat-square)

## ✨ Características

- 🎯 **Editor Visual Drag & Drop** - Interfaz intuitiva de construcción
- 📱 **Responsive Design** - Modos Desktop, Tablet y Mobile
- 🎨 **Sistema de Diseño WEMax** - Mantiene la identidad visual
- 🔐 **Autenticación Segura** - Firebase Auth + Google OAuth
- ⚡ **React + Vite** - Desarrollo moderno y rápido
- 🎭 **Dark Theme** - Diseño elegante y profesional

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Firebase
- Google OAuth configurado

### Instalación

1. **Clonar el repositorio**
```bash
git clone [repo-url]
cd aurelio-builder-app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Edita .env con tus credenciales de Firebase y Google
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

## 🛠️ Tecnologías

- **Frontend**: React 19, Vite, TailwindCSS
- **Autenticación**: Firebase Auth, Google OAuth
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Yup
- **Icons**: React Icons
- **Build**: Vite con optimizaciones

## 🏗️ Estructura del Proyecto

```
aurelio-builder-app/
├── 📁 src/
│   ├── 📁 components/          # Componentes reutilizables
│   ├── 📁 context/            # Contextos de React
│   │   └── AuthContext.jsx    # Manejo de autenticación
│   ├── 📁 config/             # Configuraciones
│   │   └── firebase.js        # Setup Firebase
│   ├── 📁 pages/              # Páginas principales
│   │   ├── Login.jsx          # Página de login
│   │   └── Editor.jsx         # Editor principal
│   ├── 📁 hooks/              # Custom hooks
│   ├── 📁 utils/              # Utilidades
│   ├── App.jsx                # Componente raíz
│   ├── main.jsx               # Entry point
│   └── index.css              # Estilos globales
├── 📄 package.json            # Dependencias
└── 📄 README.md               # Este archivo
```

## 🎨 Sistema de Diseño

Aurelio Builder utiliza el sistema de diseño de **WEMax Agency**:

- **Color Principal**: `#ff1b6d` (Rosa WEMax)
- **Colores de Soporte**: `#8b5cf6` (Púrpura), `#000000` (Negro)
- **Tipografía**: Inter, system-ui
- **Dark Theme**: Por defecto para profesionales

## 🔐 Autenticación

El sistema soporta múltiples métodos de autenticación:

- ✅ **Email/Password** - Autenticación tradicional
- ✅ **Google OAuth** - Inicio rápido con Google
- 🔄 **Recuperar contraseña** - Próximamente
- 🔄 **Registro de usuarios** - Próximamente

## 🚧 Desarrollo

### Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
npm run lint     # Linting del código
```

### Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```env
# Firebase
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
# ... más configuraciones

# Google OAuth
VITE_GOOGLE_CLIENT_ID=tu_google_client_id
```

## 📱 Funcionalidades Principales

### 🎯 Editor Visual (Próximamente)
- Drag & Drop de elementos
- Panel de propiedades en tiempo real
- Sistema responsive integrado
- Biblioteca de componentes

### 🔑 Sistema de Autenticación
- Login con email/password ✅
- Login con Google ✅
- Manejo de sesiones ✅
- Redirección automática ✅

### 🎨 Interfaz de Usuario
- Dark theme profesional ✅
- Responsive design ✅
- Animaciones suaves ✅
- Identidad visual WEMax ✅

## 🤝 Contribución

Este es un proyecto independiente de **Aurelio Builder by WEMax**. 

## 📄 Licencia

© 2025 WEMax Agency. Todos los derechos reservados.

## 🔗 Enlaces

- 🌐 [WEMax Agency](https://wemaxagency.com/)
- 📧 Soporte: [contacto@wemaxagency.com]

---

<div align="center">
  
**Construido con ❤️ por el equipo de WEMax Agency**

</div>