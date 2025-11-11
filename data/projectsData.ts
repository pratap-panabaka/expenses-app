const projectsData = [
  {
    id: 6,
    name: "Global Learning Management Platform",
    about: 'I work closely with U.S.-based developers to analyze requirements and plan frontend tasks assigned via JIRA. My role involves building and maintaining scalable ReactJS components to enhance UI functionality and ensure design consistency across the platform. I manage version control through Git by submitting merge requests, incorporating code review feedback, and maintaining clean, well-structured code. Additionally, I collaborate with the QA team to identify and resolve UI bugs, refining features based on testing feedback to deliver an optimal user experience.',
    techs: [
      "ReactJS",
      "JIRA",
      "GitLab",
    ],
    from: 'Apr 2025',
    to: 'Present',
    role: 'Software Engineer',
    company: 'Manuh Technologies',
  },
  {
    id: 5,
    name: "E-commerce Website",
    about: 'I led the development of an e-commerce web application built from scratch using Next.js and Tailwind CSS. Working closely with a team of two React developers and one backend developer specializing in Java and Spring Boot, I acted as the team lead, coordinating daily tasks, reviewing code, and ensuring project milestones were met. I collaborated with the Project Manager to gather requirements, broke down tasks, assigned them to the team, and reviewed deliverables to maintain code quality and alignment with the project goals.',
    techs: [
      "NextJS",
      "REST API",
      "Tailwind CSS",
      "AWS"
    ],
    from: 'Jan 2025',
    to: 'Mar 2025',
    role: 'Software Engineer (Team Lead)',
    company: 'Freelance Project (on site)',
  },
  {
    id: 4,
    name: "Organisation Chart",
    sideProject: true,
    about: 'Refactored and upgraded an organizational chart application from React V16 to React V18.',
    techs: [
      "ReactJS",
      "D3.js",
      "Netlify",
    ],
    liveLink: "https://pratap-panabaka-org-chart.netlify.app/org-chart",
    from: '2024',
    to: '2024',
    role: 'Software Developer',
    company: 'Freelance Project',
  },
  {
    id: 3,
    name: "News App",
    sideProject: true,
    about:
      'It is a full stack app - from this app, you can search for news and top headlines from GNews API.',
    techs: [
      "ReactJS",
      "ExpressJS",
      "REST API",
      "Tailwind CSS",
      "Netlify",
      "Firebase"
    ],
    source: "https://github.com/PRATAP-KUMAR/news-app-front-end",
    liveLink: "https://pratap-panabaka-news.web.app/",
    from: '2024',
    to: '2024',
    role: 'Software Developer',
    company: 'Side Project',
  },
  {
    id: 2,
    name: "Expenses and Contacts App",
    sideProject: true,
    about:
      'It is a full stack app.' + ' ' +
      'Users have to configure PostgreSQL on their systems to run the server.' + ' ' +
      'Users can signup and start to save, edit and delete their daily expenses and important contacts.' + ' ' +
      'All the data is stored in users configured database. Deleted expenses and contacts are stored in a seperate table such that users dont loose' + ' ' +
      'any data once they added.',
    techs: [
      "ReactJS",
      "ExpressJS",
      "PostgreSQL",
      "PERN Stack",
      "JWT",
      "REST API",
      "Tailwind CSS",
      "Netlify",
    ],
    source: "https://github.com/PRATAP-KUMAR/expenses-app-front-end/",
    liveLink: "https://pratap-panabaka-expenses-app.netlify.app/",
    from: '2024',
    to: '2024',
    role: 'Software Developer',
    company: 'Side Project',

  },
  {
    id: 1,
    name: "Metrics Web App",
    about:
      'It is a frontend app to check a list of metrics (numeric values).' + ' ' +
      "The metric data is from the free API website https://www.mfapi.in. " +
      "This API gives historical data for up to 10 years.",
    techs: [
      "ReactJS",
      "REST API",
      "ContextAPI",
      "Tailwind CSS",
      "Netlify",
    ],
    source: "https://github.com/PRATAP-KUMAR/metrics-web-app",
    liveLink: "https://pratap-panabaka-metrics-web-app.netlify.app/",
    from: '2023',
    to: '2023',
    role: 'Student (Full Stack Web Development Program)',
    company: 'Microverse Inc, San Francisco',
  }
];

export default projectsData;
