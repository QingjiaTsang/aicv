import { documentRelations } from "@/api/db/schema/resume/documents";
import { educationRelations } from "@/api/db/schema/resume/education";
import { experienceRelations } from "@/api/db/schema/resume/experience";
import { personalInfoRelations } from "@/api/db/schema/resume/personal-info";
import { skillsRelations } from "@/api/db/schema/resume/skills";

export * from "./documents";
export * from "./education";
export * from "./experience";
export * from "./personal-info";
export * from "./skills";

export const resumeRelations = {
  documents: documentRelations,
  personalInfo: personalInfoRelations,
  experience: experienceRelations,
  education: educationRelations,
  skills: skillsRelations,
};
