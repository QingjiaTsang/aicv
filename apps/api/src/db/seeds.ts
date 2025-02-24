import type { DrizzleD1Database } from "drizzle-orm/d1";

import { format } from "date-fns";

import { hashPassword } from "../routes/auth/lib/auth-utils";
import * as schema from "./schema";

const defaultUsers = [
  {
    name: "测试用户",
    email: "test@example.com",
    password: "Pi31415926+",
    emailVerified: new Date(),
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=test",
  },
] as const;

const defaultDocuments = [
  {
    title: "软件工程师简历",
    summary: "5年全栈开发经验",
    themeColor: "#7c3aed",
    status: "public" as const,
    currentPosition: 0,
    sectionOrder: "experience,education,skills",
    thumbnail: null,
  },
  {
    title: "Software Engineer Resume",
    summary: "Senior software engineer with 7 years of experience in full-stack development and cloud architecture",
    themeColor: "#2563eb",
    status: "public" as const,
    currentPosition: 0,
    sectionOrder: "experience,education,skills",
    thumbnail: null,
  },
] as const;

const defaultPersonalInfo = {
  firstName: "测试",
  lastName: "用户",
  jobTitle: "高级软件工程师",
  state: "广东省",
  city: "广州市",
  phone: "13800138000",
  email: "test@example.com",
};

const defaultExperience = [
  {
    title: "高级前端工程师",
    companyName: "某科技公司",
    state: "广东省",
    city: "广州市",
    isCurrentlyEmployed: true,
    workSummary: "负责公司核心产品的前端开发",
    startDate: format(new Date("2020-01-01"), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
    displayOrder: 0,
  },
  {
    title: "全栈工程师",
    companyName: "某互联网公司",
    state: "广东省",
    city: "广州市",
    isCurrentlyEmployed: false,
    workSummary: "全栈开发,负责产品从0到1的构建",
    startDate: format(new Date("2018-01-01"), "yyyy-MM-dd"),
    endDate: format(new Date("2019-12-31"), "yyyy-MM-dd"),
    displayOrder: 1,
  },
] as const;

const defaultEducation = [
  {
    universityName: "某大学",
    degree: "计算机科学与技术",
    major: "计算机科学",
    startDate: format(new Date("2014-09-01"), "yyyy-MM-dd"),
    endDate: format(new Date("2018-07-01"), "yyyy-MM-dd"),
    description: "主修计算机科学与技术,参与多个创新项目",
    displayOrder: 0,
  },
] as const;

const defaultSkills = [
  { name: "JavaScript", rating: 5, displayOrder: 0 },
  { name: "TypeScript", rating: 4, displayOrder: 1 },
  { name: "React", rating: 5, displayOrder: 2 },
  { name: "Node.js", rating: 4, displayOrder: 3 },
  { name: "Python", rating: 3, displayOrder: 4 },
] as const;

const englishPersonalInfo = {
  firstName: "Michael",
  lastName: "Anderson",
  jobTitle: "Senior Software Engineer",
  state: "California",
  city: "San Francisco",
  phone: "14155552671",
  email: "m.anderson@example.com",
};

const englishExperience = [
  {
    title: "Senior Software Engineer",
    companyName: "Stripe",
    state: "California",
    city: "San Francisco",
    isCurrentlyEmployed: true,
    workSummary: "• Led a team of 5 engineers in developing and maintaining payment processing microservices\n• Improved system performance by 40% through optimization of database queries and caching strategies\n• Implemented CI/CD pipelines reducing deployment time by 60%",
    startDate: format(new Date("2021-03-01"), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
    displayOrder: 0,
  },
  {
    title: "Full Stack Developer",
    companyName: "Airbnb",
    state: "California",
    city: "San Francisco",
    isCurrentlyEmployed: false,
    workSummary: "• Developed and maintained key features of the booking platform using React and Node.js\n• Implemented real-time messaging system serving over 1M daily active users\n• Reduced page load time by 35% through code optimization and lazy loading",
    startDate: format(new Date("2019-01-01"), "yyyy-MM-dd"),
    endDate: format(new Date("2021-02-28"), "yyyy-MM-dd"),
    displayOrder: 1,
  },
  {
    title: "Software Engineer",
    companyName: "Dropbox",
    state: "California",
    city: "San Francisco",
    isCurrentlyEmployed: false,
    workSummary: "• Built and maintained RESTful APIs using Python and Django\n• Implemented file synchronization features used by millions of users\n• Collaborated with product team to improve user experience",
    startDate: format(new Date("2017-06-01"), "yyyy-MM-dd"),
    endDate: format(new Date("2018-12-31"), "yyyy-MM-dd"),
    displayOrder: 2,
  },
] as const;

const englishEducation = [
  {
    universityName: "Stanford University",
    degree: "Master of Science",
    major: "Computer Science",
    startDate: format(new Date("2015-09-01"), "yyyy-MM-dd"),
    endDate: format(new Date("2017-05-01"), "yyyy-MM-dd"),
    description: "• Specialization in Machine Learning and Distributed Systems\n• GPA: 3.9/4.0\n• Teaching Assistant for Advanced Algorithms course",
    displayOrder: 0,
  },
  {
    universityName: "University of California, Berkeley",
    degree: "Bachelor of Science",
    major: "Computer Science",
    startDate: format(new Date("2011-09-01"), "yyyy-MM-dd"),
    endDate: format(new Date("2015-05-01"), "yyyy-MM-dd"),
    description: "• Dean's List all semesters\n• Led Computer Science Society\n• Completed senior thesis on distributed systems",
    displayOrder: 1,
  },
] as const;

const englishSkills = [
  { name: "Python", rating: 5, displayOrder: 0 },
  { name: "JavaScript/TypeScript", rating: 5, displayOrder: 1 },
  { name: "React", rating: 5, displayOrder: 2 },
  { name: "Node.js", rating: 4, displayOrder: 3 },
  { name: "AWS", rating: 4, displayOrder: 4 },
  { name: "Docker", rating: 4, displayOrder: 5 },
  { name: "Kubernetes", rating: 3, displayOrder: 6 },
  { name: "GraphQL", rating: 4, displayOrder: 7 },
] as const;

export async function seed(db: DrizzleD1Database<typeof schema>) {
  // upsert users
  for (const user of defaultUsers) {
    const hashedPassword = await hashPassword(user.password);
    await db.insert(schema.users)
      .values({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        emailVerified: user.emailVerified,
        image: user.image,
      })
      .onConflictDoUpdate({
        target: schema.users.email,
        set: {
          name: user.name,
          password: hashedPassword,
          emailVerified: user.emailVerified,
          image: user.image,
        },
      });
  }

  // get test user
  const testUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, "test@example.com"),
  });

  if (!testUser) {
    throw new Error("测试用户未找到");
  }

  // insert documents
  for (const [index, doc] of defaultDocuments.entries()) {
    const [document] = await db.insert(schema.documents).values({
      userId: testUser.id,
      ...doc,
    }).returning();

    // select chinese or english data based on index
    const personalInfo = index === 0 ? defaultPersonalInfo : englishPersonalInfo;
    const experiences = index === 0 ? defaultExperience : englishExperience;
    const educations = index === 0 ? defaultEducation : englishEducation;
    const skills = index === 0 ? defaultSkills : englishSkills;

    // insert personal info
    await db.insert(schema.personalInfo).values({
      documentId: document.id,
      ...personalInfo,
    });

    // insert experiences
    for (const exp of experiences) {
      await db.insert(schema.experience).values({
        documentId: document.id,
        ...exp,
      });
    }

    // insert educations
    for (const edu of educations) {
      await db.insert(schema.education).values({
        documentId: document.id,
        ...edu,
      });
    }

    // insert skills
    for (const skill of skills) {
      await db.insert(schema.skills).values({
        documentId: document.id,
        ...skill,
      });
    }
  }
}
