import type { DrizzleD1Database } from "drizzle-orm/d1";

import { hashPassword } from "../routes/auth/lib/auth-utils";
import * as schema from "./schema";

const defaultUsers = [
  {
    name: "测试用户",
    email: "test@example.com",
    password: "password123",
    emailVerified: new Date(),
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=test",
  },
  {
    name: "管理员",
    email: "admin@example.com",
    password: "admin123",
    emailVerified: new Date(),
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
  },
] as const;

const defaultDocuments = [
  {
    title: "软件工程师简历",
    summary: "5年全栈开发经验",
    themeColor: "#7c3aed",
    status: "public" as const,
    authorName: "测试用户",
    authorEmail: "test@example.com",
  },
] as const;

const defaultPersonalInfo = {
  firstName: "测试",
  lastName: "用户",
  jobTitle: "高级软件工程师",
  city: "上海",
  address: "浦东新区",
  phone: "13800138000",
  email: "test@example.com",
};

const defaultExperience = [
  {
    title: "高级前端工程师",
    companyName: "某科技公司",
    state: "上海",
    city: "浦东新区",
    isCurrentlyEmployed: true,
    workSummary: "负责公司核心产品的前端开发",
    startDate: new Date("2020-01-01"),
    endDate: new Date(),
  },
  {
    title: "全栈工程师",
    companyName: "某互联网公司",
    state: "北京",
    city: "朝阳区",
    isCurrentlyEmployed: false,
    workSummary: "全栈开发,负责产品从0到1的构建",
    startDate: new Date("2018-01-01"),
    endDate: new Date("2019-12-31"),
  },
] as const;

const defaultEducation = [
  {
    universityName: "某大学",
    degree: "计算机科学与技术",
    major: "计算机科学",
    startDate: new Date("2014-09-01"),
    endDate: new Date("2018-07-01"),
    description: "主修计算机科学与技术,参与多个创新项目",
  },
] as const;

const defaultSkills = [
  { name: "JavaScript", rating: 5 },
  { name: "TypeScript", rating: 4 },
  { name: "React", rating: 5 },
  { name: "Node.js", rating: 4 },
  { name: "Python", rating: 3 },
] as const;

export async function seed(db: DrizzleD1Database<typeof schema>) {
  // 插入用户
  for (const user of defaultUsers) {
    const hashedPassword = await hashPassword(user.password);
    await db.insert(schema.users).values({
      name: user.name,
      email: user.email,
      password: hashedPassword,
      emailVerified: user.emailVerified,
      image: user.image,
    });
  }

  // 获取测试用户
  const testUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, "test@example.com"),
  });

  if (!testUser) {
    throw new Error("测试用户未找到");
  }

  // 插入文档
  for (const doc of defaultDocuments) {
    const [document] = await db.insert(schema.documents).values({
      userId: testUser.id,
      ...doc,
    }).returning();

    // 插入个人信息
    await db.insert(schema.personalInfo).values({
      documentId: document.id,
      ...defaultPersonalInfo,
    });

    // 插入工作经验
    for (const exp of defaultExperience) {
      await db.insert(schema.experience).values({
        documentId: document.id,
        ...exp,
      });
    }

    // 插入教育经历
    for (const edu of defaultEducation) {
      await db.insert(schema.education).values({
        documentId: document.id,
        ...edu,
      });
    }

    // 插入技能
    for (const skill of defaultSkills) {
      await db.insert(schema.skills).values({
        documentId: document.id,
        ...skill,
      });
    }
  }
}
