"use client";

import React, { useState, useRef } from 'react';
import { X, Upload, Calendar, User, Tag, FileText, Camera } from 'lucide-react';

interface ProjectFormData {
  title: string;
  template: string;
}

interface NewProjectPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: ProjectFormData) => void;
}

export const NewProjectPopup: React.FC<NewProjectPopupProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    template: ''
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [errors, setErrors] = useState<Partial<ProjectFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const templates = [
    {
      id: 'blank',
      name: 'Blank Project',
      description: 'Start with an empty project structure',
      icon: '📄',
      tech: []
    },
    {
      id: 'rest-api-express',
      name: 'REST API with Express.js',
      description: 'Express.js server with RESTful endpoints, middleware, and routing',
      icon: '🚀',
      tech: ['Node.js', 'Express.js', 'MongoDB', 'JWT']
    },
    {
      id: 'rest-api-fastapi',
      name: 'REST API with FastAPI',
      description: 'Python FastAPI server with automatic documentation and validation',
      icon: '⚡',
      tech: ['Python', 'FastAPI', 'PostgreSQL', 'SQLAlchemy']
    },
    {
      id: 'graphql-apollo',
      name: 'GraphQL with Apollo Server',
      description: 'Apollo GraphQL server with type definitions and resolvers',
      icon: '🔗',
      tech: ['Node.js', 'GraphQL', 'Apollo Server', 'TypeScript']
    },
    {
      id: 'graphql-hasura',
      name: 'GraphQL with Hasura',
      description: 'Hasura GraphQL engine with instant GraphQL APIs',
      icon: '⚡',
      tech: ['Hasura', 'PostgreSQL', 'GraphQL', 'Real-time']
    },
    {
      id: 'rest-api-django',
      name: 'REST API with Django',
      description: 'Django REST framework with serializers and viewsets',
      icon: '🎸',
      tech: ['Python', 'Django', 'Django REST', 'PostgreSQL']
    },
    {
      id: 'rest-api-spring',
      name: 'REST API with Spring Boot',
      description: 'Spring Boot application with JPA and RESTful services',
      icon: '🌱',
      tech: ['Java', 'Spring Boot', 'JPA', 'MySQL']
    },
    {
      id: 'graphql-nest',
      name: 'GraphQL with NestJS',
      description: 'NestJS GraphQL application with decorators and modules',
      icon: '🏠',
      tech: ['TypeScript', 'NestJS', 'GraphQL', 'TypeORM']
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof ProjectFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setFormData(prev => ({ ...prev, template: templateId }));
    
    // Clear template error
    if (errors.template) {
      setErrors(prev => ({ ...prev, template: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProjectFormData> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Project title is required';
    if (!formData.template) newErrors.template = 'Please select a template';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSubmit(formData);
      handleReset();
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      template: ''
    });
    setSelectedTemplate('');
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-lg transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 mr-2" />
                Project Name *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your project name..."
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Template Selection */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <Tag className="w-4 h-4 mr-2" />
                Choose Template *
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate === template.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{template.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className='text-sm font-semibold text-gray-900'>
                          {template.name}
                        </h3>
                        <p className='text-xs mt-1 text-gray-500'>
                          {template.description}
                        </p>
                        
                        {template.tech.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {template.tech.map((tech) => (
                              <span
                                key={tech}
                                className={`px-2 py-1 text-xs rounded-full ${
                                  selectedTemplate === template.id
                                    ? 'bg-orange-100 text-orange-500'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {selectedTemplate === template.id && (
                      <div className="absolute top-2 right-2">
                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {errors.template && <p className="text-red-500 text-sm mt-2">{errors.template}</p>}
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-xl">
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Project'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};