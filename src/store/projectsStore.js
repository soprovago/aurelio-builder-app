import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ProjectsState, Project } from '@/types';

interface ProjectsStore extends ProjectsState {
  // Actions
  fetchProjects: () => Promise<void>;
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  selectProject: (id: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

// Simulación de API de proyectos
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Landing Page Modern',
    description: 'Una landing page moderna para startup tecnológica',
    thumbnail: 'https://picsum.photos/seed/landing/300/200',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-20T14:30:00.000Z',
    userId: '1',
  },
  {
    id: '2',
    name: 'E-commerce Dashboard',
    description: 'Dashboard administrativo para tienda online',
    thumbnail: 'https://picsum.photos/seed/dashboard/300/200',
    createdAt: '2024-01-10T08:00:00.000Z',
    updatedAt: '2024-01-18T16:45:00.000Z',
    userId: '1',
  },
  {
    id: '3',
    name: 'Portfolio Personal',
    description: 'Sitio web personal para mostrar proyectos',
    thumbnail: 'https://picsum.photos/seed/portfolio/300/200',
    createdAt: '2024-01-05T12:00:00.000Z',
    updatedAt: '2024-01-15T09:20:00.000Z',
    userId: '1',
  },
];

const mockApi = {
  fetchProjects: async (): Promise<Project[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [...mockProjects];
  },

  createProject: async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newProject: Project = {
      ...projectData,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockProjects.push(newProject);
    return newProject;
  },

  updateProject: async (id: string, updates: Partial<Project>): Promise<Project> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const projectIndex = mockProjects.findIndex(p => p.id === id);
    if (projectIndex === -1) throw new Error('Project not found');
    
    const updatedProject = {
      ...mockProjects[projectIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    mockProjects[projectIndex] = updatedProject;
    return updatedProject;
  },

  deleteProject: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const projectIndex = mockProjects.findIndex(p => p.id === id);
    if (projectIndex === -1) throw new Error('Project not found');
    mockProjects.splice(projectIndex, 1);
  },
};

export const useProjectsStore = create<ProjectsStore>()(
  immer((set, get) => ({
    // Estado inicial normalizado
    projects: {},
    projectIds: [],
    selectedProjectId: null,
    isLoading: false,
    error: null,

    // Actions
    fetchProjects: async () => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const projects = await mockApi.fetchProjects();
        
        set((state) => {
          // Normalizar los datos: convertir array a objeto con IDs como keys
          state.projects = projects.reduce((acc, project) => {
            acc[project.id] = project;
            return acc;
          }, {} as Record<string, Project>);
          
          state.projectIds = projects.map(p => p.id);
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to fetch projects';
          state.isLoading = false;
        });
      }
    },

    createProject: async (projectData) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const newProject = await mockApi.createProject(projectData);
        
        set((state) => {
          state.projects[newProject.id] = newProject;
          state.projectIds.unshift(newProject.id); // Agregar al inicio
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to create project';
          state.isLoading = false;
        });
      }
    },

    updateProject: async (id, updates) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const updatedProject = await mockApi.updateProject(id, updates);
        
        set((state) => {
          state.projects[id] = updatedProject;
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to update project';
          state.isLoading = false;
        });
      }
    },

    deleteProject: async (id) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        await mockApi.deleteProject(id);
        
        set((state) => {
          delete state.projects[id];
          state.projectIds = state.projectIds.filter(projectId => projectId !== id);
          if (state.selectedProjectId === id) {
            state.selectedProjectId = null;
          }
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to delete project';
          state.isLoading = false;
        });
      }
    },

    selectProject: (id) => {
      set((state) => {
        state.selectedProjectId = id;
      });
    },

    setLoading: (isLoading) => {
      set((state) => {
        state.isLoading = isLoading;
      });
    },

    setError: (error) => {
      set((state) => {
        state.error = error;
      });
    },
  }))
);