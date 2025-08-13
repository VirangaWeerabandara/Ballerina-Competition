"use client";

import React from 'react';
import { ExternalLink, Calendar, User } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  image: string;
  description: string;
  route: string;
  category: string;
  date: string;
  author: string;
}

interface ProjectCardsGridProps {
  projects?: Project[];
  onCardClick?: (route: string) => void;
}

const ProjectCardsGrid: React.FC<ProjectCardsGridProps> = ({ 
  projects = defaultProjects, 
  onCardClick 
}) => {
  const handleCardClick = (route: string) => {
    if (onCardClick) {
      onCardClick(route);
    } else {
      // Default behavior - you can replace with Next.js router
      window.location.href = route;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => handleCardClick(project.route)}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-200 overflow-hidden transform hover:-translate-y-1"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                  {project.category}
                </span>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
                {project.title}
              </h3>

              {/* Meta info */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{project.date}</span>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center justify-between">
                <span className="text-orange-300 text-sm font-medium group-hover:text-orange-500">
                  View Project
                </span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-500">There are no projects to display at the moment.</p>
        </div>
      )}
    </div>
  );
};

// Default sample projects
const defaultProjects: Project[] = [
  {
    id: "1",
    title: "E-commerce Dashboard",
    image: "https://images.unsplash.com/photo-1682685796014-2f342188a635?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "A comprehensive dashboard for managing online store operations with real-time analytics and inventory management.",
    route: "/projects/ecommerce-dashboard",
    category: "Web App",
    date: "Mar 2024",
    author: "John Doe"
  },
  {
    id: "2", 
    title: "Mobile Banking App",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
    description: "Secure and user-friendly mobile banking application with biometric authentication and seamless transactions.",
    route: "/projects/banking-app",
    category: "Mobile",
    date: "Feb 2024",
    author: "Jane Smith"
  },
  {
    id: "3",
    title: "AI Content Generator",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
    description: "Advanced AI-powered tool for generating high-quality content for blogs, social media, and marketing campaigns.",
    route: "/projects/ai-content-generator",
    category: "AI/ML",
    date: "Jan 2024",
    author: "Mike Johnson"
  },
  {
    id: "4",
    title: "Task Management System",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
    description: "Collaborative project management platform with kanban boards, time tracking, and team communication features.",
    route: "/projects/task-management",
    category: "Productivity",
    date: "Dec 2023",
    author: "Sarah Wilson"
  },
  {
    id: "5",
    title: "Data Visualization Tool",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    description: "Interactive dashboard for creating beautiful charts and graphs from complex datasets with drag-and-drop interface.",
    route: "/projects/data-viz",
    category: "Analytics",
    date: "Nov 2023",
    author: "David Brown"
  },
  {
    id: "6",
    title: "Social Learning Platform",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
    description: "Online learning platform with interactive courses, peer-to-peer learning, and progress tracking capabilities.",
    route: "/projects/learning-platform",
    category: "Education",
    date: "Oct 2023",
    author: "Emily Davis"
  }
];

export default ProjectCardsGrid;