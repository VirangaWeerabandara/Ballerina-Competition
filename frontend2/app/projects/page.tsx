"use client";

import { useState } from "react";
import ProjectCardsGrid from "./projectcardsgrid";
import ProjectsLayout from "@/components/projectslayout";
import { NewProjectPopup } from "./newprojectpopup";

export default function ProjectsPage() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleCreateProject = () => {
    // Here you would typically send the data to your API
    alert('Project created successfully!');
    
  };

    return(
        <>
            <ProjectsLayout onCreateNewClick={() => setIsPopupOpen(true)}>
                <ProjectCardsGrid />
            </ProjectsLayout>

            <NewProjectPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                onSubmit={handleCreateProject}
            />
        </>
    );
}
