import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  FiHome, 
  FiPlus, 
  FiGlobe, 
  FiBarChart2, 
  FiPlay, 
  FiUsers, 
  FiMail, 
  FiFileText, 
  FiTrendingUp, 
  FiBookOpen, 
  FiHelpCircle,
  FiSettings,
  FiEye,
  FiEdit3,
  FiX
} from 'react-icons/fi';

// Datos de plantillas
const templateCategories = {
  webinar: {
    name: 'Webinar',
    icon: <FiPlay className="w-5 h-5" />,
    color: 'bg-blue-500',
    templates: [
      { id: 1, name: 'Webinar Clásico', preview: '/images/templates/webinar-1.jpg', description: 'Plantilla profesional para webinars con registro y countdown.' },
      { id: 2, name: 'Webinar Minimalista', preview: '/images/templates/webinar-2.jpg', description: 'Diseño limpio y moderno para webinars educativos.' }
    ]
  },
  landing: {
    name: 'Landing Pages',
    icon: <FiGlobe className="w-5 h-5" />,
    color: 'bg-green-500',
    templates: [
      { id: 3, name: 'Landing Corporativa', preview: '/images/templates/landing-1.jpg', description: 'Perfecta para empresas y servicios profesionales.' },
      { id: 4, name: 'Landing Producto', preview: '/images/templates/landing-2.jpg', description: 'Ideal para lanzamiento de productos digitales.' },
      { id: 5, name: 'Landing App', preview: '/images/templates/landing-3.jpg', description: 'Diseñada especialmente para aplicaciones móviles.' }
    ]
  },
  vsl: {
    name: 'VSL',
    icon: <FiPlay className="w-5 h-5" />,
    color: 'bg-red-500',
    templates: [
      { id: 6, name: 'VSL Clásico', preview: '/images/templates/vsl-1.jpg', description: 'Video Sales Letter con diseño enfocado en conversión.' }
    ]
  },
  captura: {
    name: 'Captura',
    icon: <FiMail className="w-5 h-5" />,
    color: 'bg-yellow-500',
    templates: [
      { id: 7, name: 'Lead Magnet', preview: '/images/templates/capture-1.jpg', description: 'Captura de leads con imán de prospectos.' },
      { id: 8, name: 'Newsletter', preview: '/images/templates/capture-2.jpg', description: 'Suscripción a newsletter con incentivo.' }
    ]
  },
  presell: {
    name: 'Presell',
    icon: <FiTrendingUp className="w-5 h-5" />,
    color: 'bg-purple-500',
    templates: [
      { id: 9, name: 'Presell Educativo', preview: '/images/templates/presell-1.jpg', description: 'Página de precalentamiento antes de la venta.' }
    ]
  },
  upsell: {
    name: 'Upsell',
    icon: <FiTrendingUp className="w-5 h-5" />,
    color: 'bg-indigo-500',
    templates: [
      { id: 10, name: 'Upsell Clásico', preview: '/images/templates/upsell-1.jpg', description: 'Oferta complementaria después de la compra principal.' }
    ]
  },
  agradecimiento: {
    name: 'Agradecimiento',
    icon: <FiHelpCircle className="w-5 h-5" />,
    color: 'bg-pink-500',
    templates: [
      { id: 11, name: 'Thank You Page', preview: '/images/templates/thanks-1.jpg', description: 'Página de agradecimiento con siguientes pasos.' }
    ]
  },
  quiz: {
    name: 'Quiz',
    icon: <FiHelpCircle className="w-5 h-5" />,
    color: 'bg-teal-500',
    templates: [
      { id: 12, name: 'Quiz Interactivo', preview: '/images/templates/quiz-1.jpg', description: 'Cuestionario interactivo para generar leads.' }
    ]
  },
  ebook: {
    name: 'E-book',
    icon: <FiBookOpen className="w-5 h-5" />,
    color: 'bg-orange-500',
    templates: [
      { id: 13, name: 'Descarga E-book', preview: '/images/templates/ebook-1.jpg', description: 'Página de descarga para libros digitales.' }
    ]
  }
};

function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { name: 'Todos los Proyectos', icon: <FiHome className="w-5 h-5" />, path: '/dashboard/overview' },
    { name: 'Nueva Página', icon: <FiPlus className="w-5 h-5" />, path: '/dashboard/new-page' },
    { name: 'Sites', icon: <FiGlobe className="w-5 h-5" />, path: '/dashboard/sites' },
    { name: 'Quiz Interactivo', icon: <FiHelpCircle className="w-5 h-5" />, path: '/dashboard/quiz' },
    { name: 'Embudos', icon: <FiTrendingUp className="w-5 h-5" />, path: '/dashboard/funnels' },
    { name: 'Analytics', icon: <FiBarChart2 className="w-5 h-5" />, path: '/dashboard/analytics' },
    { name: 'AurelioPlayer', icon: <FiPlay className="w-5 h-5" />, path: '/dashboard/player' },
    { name: 'Suscripciones', icon: <FiUsers className="w-5 h-5" />, path: '/dashboard/subscriptions' },
    { name: 'Leads', icon: <FiMail className="w-5 h-5" />, path: '/dashboard/leads' },
    { name: 'Formulario', icon: <FiFileText className="w-5 h-5" />, path: '/dashboard/forms' },
    { name: 'Quiz', icon: <FiHelpCircle className="w-5 h-5" />, path: '/dashboard/quiz-builder' },
    { name: 'Concurso', icon: <FiTrendingUp className="w-5 h-5" />, path: '/dashboard/contest' },
    { name: 'Academy', icon: <FiBookOpen className="w-5 h-5" />, path: '/dashboard/academy' },
    { name: 'Tutoriales', icon: <FiHelpCircle className="w-5 h-5" />, path: '/dashboard/tutorials' },
  ];

  return (
    <div className="w-64 bg-[#1a1a1a] border-r border-[#2a2a2a] min-h-screen">
      <nav className="p-4 pt-6">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPath === item.path
                    ? 'bg-[#ff1b6d] text-white'
                    : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function TemplateCard({ template, category, onPreview, onSelect }) {
  return (
    <div className="group bg-[#1e1e1e] rounded-lg overflow-hidden border border-[#2a2a2a] transition-all duration-200 hover:border-[#ff1b6d]/50 hover:shadow-lg hover:shadow-[#ff1b6d]/10">
      <div className="aspect-video bg-[#2a2a2a] relative overflow-hidden">
        {/* Placeholder para preview de la plantilla */}
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]">
          <div className={`${category.color} p-4 rounded-full opacity-50`}>
            {category.icon}
          </div>
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={() => onPreview(template)}
            className="p-1.5 bg-black/60 backdrop-blur-sm rounded text-white hover:bg-black/80 transition-colors"
            title="Vista previa"
          >
            <FiEye className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${category.color}`}>
            {category.icon}
            {category.name}
          </span>
        </div>
        <h3 className="font-semibold text-white mb-2">{template.name}</h3>
        <p className="text-sm text-gray-400 mb-4">{template.description}</p>
        <button
          onClick={() => onSelect(template)}
          className="w-full bg-[#ff1b6d] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#e61060] transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          Usar Plantilla
        </button>
      </div>
    </div>
  );
}

function Templates({ onTemplateSelect, onPreview }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const allTemplates = Object.entries(templateCategories).flatMap(([key, category]) =>
    category.templates.map(template => ({ ...template, categoryKey: key, category }))
  );

  const filteredTemplates = activeCategory === 'all' 
    ? allTemplates 
    : templateCategories[activeCategory]?.templates.map(template => ({ 
        ...template, 
        categoryKey: activeCategory, 
        category: templateCategories[activeCategory] 
      })) || [];

  return (
    <div className="space-y-6">
      {/* Filtros de categoría */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-[#ff1b6d] text-white'
              : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]'
          }`}
        >
          Todas ({allTemplates.length})
        </button>
        {Object.entries(templateCategories).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === key
                ? 'bg-[#ff1b6d] text-white'
                : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]'
            }`}
          >
            {category.icon}
            {category.name} ({category.templates.length})
          </button>
        ))}
      </div>

      {/* Grid de plantillas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            category={template.category}
            onPreview={onPreview}
            onSelect={onTemplateSelect}
          />
        ))}
      </div>
    </div>
  );
}

function NewPage({ onStartEditor }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    // Iniciar editor con la plantilla seleccionada
    onStartEditor(template);
  };

  const handlePreview = (template) => {
    setPreviewTemplate(template);
  };

  const startBlankCanvas = () => {
    // Iniciar editor con lienzo en blanco
    onStartEditor(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Nueva Página</h1>
          <p className="text-gray-400">Selecciona una plantilla o comienza desde cero</p>
        </div>
        <button
          onClick={startBlankCanvas}
          className="flex items-center gap-2 bg-[#ff1b6d] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#e61060] transition-all duration-200 shadow-lg hover:shadow-[#ff1b6d]/25"
        >
          <FiPlus className="w-5 h-5" />
          Lienzo en Blanco
        </button>
      </div>

      {/* Plantillas */}
      <Templates 
        onTemplateSelect={handleTemplateSelect}
        onPreview={handlePreview}
      />

      {/* Modal de preview (simplificado) */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
              <h3 className="text-lg font-semibold text-white">{previewTemplate.name}</h3>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="aspect-video bg-[#2a2a2a] rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Vista previa de {previewTemplate.name}</p>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    handleTemplateSelect(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="flex-1 bg-[#ff1b6d] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#e61060] transition-colors"
                >
                  Usar esta Plantilla
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="px-4 py-2 bg-[#2a2a2a] text-gray-300 rounded-lg hover:bg-[#3a3a3a] transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Overview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Todos los Proyectos</h1>
        <p className="text-gray-400">Gestiona y organiza todos tus proyectos de Aurelio Builder</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta para crear nuevo proyecto */}
        <Link
          to="/dashboard/new-page"
          className="bg-[#1e1e1e] border-2 border-dashed border-[#ff1b6d]/30 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-[#ff1b6d]/60 hover:bg-[#ff1b6d]/5 transition-all duration-200 min-h-[200px]"
        >
          <FiPlus className="w-12 h-12 text-[#ff1b6d] mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Crear Nuevo Proyecto</h3>
          <p className="text-sm text-gray-400">Comienza un nuevo proyecto desde una plantilla o lienzo en blanco</p>
        </Link>
        
        {/* Proyecto de ejemplo */}
        <div className="bg-[#1e1e1e] rounded-lg border border-[#2a2a2a] overflow-hidden hover:border-[#ff1b6d]/50 transition-colors">
          <div className="aspect-video bg-[#2a2a2a] flex items-center justify-center">
            <p className="text-gray-500">Preview del proyecto</p>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-white mb-1">Landing Page - Proyecto Demo</h3>
            <p className="text-sm text-gray-400 mb-3">Última modificación: hace 2 días</p>
            <div className="flex gap-2">
              <button className="flex-1 bg-[#ff1b6d] text-white py-2 px-3 rounded text-sm font-medium hover:bg-[#e61060] transition-colors">
                Editar
              </button>
              <button className="px-3 py-2 bg-[#2a2a2a] text-gray-300 rounded text-sm hover:bg-[#3a3a3a] transition-colors">
                <FiEye className="w-4 h-4" />
              </button>
              <button className="px-3 py-2 bg-[#2a2a2a] text-gray-300 rounded text-sm hover:bg-[#3a3a3a] transition-colors">
                <FiSettings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComingSoon({ title, description }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
        <p className="text-gray-400">{description}</p>
      </div>
      
      <div className="bg-[#1e1e1e] rounded-lg border border-[#2a2a2a] p-12 text-center">
        <div className="w-16 h-16 bg-[#ff1b6d]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiSettings className="w-8 h-8 text-[#ff1b6d]" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Próximamente</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          Esta funcionalidad está en desarrollo y estará disponible pronto.
        </p>
      </div>
    </div>
  );
}

function Dashboard({ onStartEditor }) {
  return (
    <div className="flex min-h-screen bg-[#0f0f0f]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Routes>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="new-page" element={<NewPage onStartEditor={onStartEditor} />} />
            <Route path="sites" element={<ComingSoon title="Sites" description="Gestiona todos tus sitios web publicados" />} />
            <Route path="quiz" element={<ComingSoon title="Quiz Interactivo" description="Crea cuestionarios interactivos para generar leads" />} />
            <Route path="funnels" element={<ComingSoon title="Embudos" description="Construye embudos de conversión completos" />} />
            <Route path="analytics" element={<ComingSoon title="Analytics" description="Analiza el rendimiento de tus páginas" />} />
            <Route path="player" element={<ComingSoon title="AurelioPlayer" description="Reproductor de video personalizado" />} />
            <Route path="subscriptions" element={<ComingSoon title="Suscripciones" description="Gestiona suscripciones y membresías" />} />
            <Route path="leads" element={<ComingSoon title="Leads" description="Administra y segmenta tus leads" />} />
            <Route path="forms" element={<ComingSoon title="Formularios" description="Constructor de formularios avanzado" />} />
            <Route path="quiz-builder" element={<ComingSoon title="Constructor de Quiz" description="Herramienta para crear quiz personalizados" />} />
            <Route path="contest" element={<ComingSoon title="Concursos" description="Crea concursos y sorteos atractivos" />} />
            <Route path="academy" element={<ComingSoon title="Academy" description="Plataforma de cursos online" />} />
            <Route path="tutorials" element={<ComingSoon title="Tutoriales" description="Aprende a usar Aurelio Builder" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;