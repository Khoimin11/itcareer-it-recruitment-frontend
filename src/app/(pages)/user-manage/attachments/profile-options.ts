import { positionList, workingFormList } from "@/config/variable";

export const singleOptions: Record<string, string[]> = {
  experience: ["< 1 năm", "1 năm", "2 năm", "3 năm", "4 năm", "5 năm", "6–10 năm", "Trên 10 năm"],
  level: positionList.map(item => item.label),
  education: ["Cao đẳng", "Đại học", "Thạc sĩ", "Tiến sĩ", "Khác"],
  major: ["Công nghệ thông tin", "Khoa học máy tính", "Kỹ thuật phần mềm", "Hệ thống thông tin", "Kỹ thuật máy tính", "Mạng máy tính và truyền thông dữ liệu", "An toàn thông tin", "Khoa học dữ liệu", "Trí tuệ nhân tạo", "Điện tử viễn thông", "Khác"],
};

export const multipleOptions: Record<string, string[]> = {
  skills: ["JavaScript", "TypeScript", "Java", "Python", "C", "C++", "C#", ".NET", "PHP", "Go", "Ruby", "Kotlin", "Swift", "HTML5", "CSS3", "ReactJS", "Next.js", "Vue.js", "Angular", "Node.js", "Express.js", "NestJS", "Spring Boot", "Laravel", "Django", "Flutter", "React Native", "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Git", "Docker", "Kubernetes", "Linux", "AWS", "Azure", "CI/CD", "Testing", "Figma", "Agile/Scrum"],
  workingForms: workingFormList.map(item => item.label),
  industries: ["Phát triển phần mềm", "Thuê ngoài phát triển phần mềm", "Sản phẩm phần mềm và dịch vụ web", "Thương mại điện tử", "Ngân hàng và dịch vụ tài chính", "Công nghệ tài chính (Fintech)", "Giáo dục và đào tạo", "Y tế và chăm sóc sức khỏe", "Viễn thông", "Trò chơi điện tử", "Trí tuệ nhân tạo và dữ liệu", "An ninh mạng", "Logistics và vận tải", "Du lịch và dịch vụ", "Sản xuất", "Khác"],
};
