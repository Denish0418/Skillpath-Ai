import Roadmap from "../model/roadmap.js";
import Progress from "../model/progress.js";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// ─────────────────────────────────────────────────────────────────────────────
// CURATED HINDI YOUTUBE SEARCH QUERIES
// Each value is a carefully crafted search query that finds the best Hindi
// courses on YouTube. Search URLs always work — no broken playlist IDs.
// ─────────────────────────────────────────────────────────────────────────────
const SKILL_HINDI_SEARCH = {
    // ── Full Stack / Web Developer ────────────────────────────────────────
    "HTML":                   "HTML full course Hindi CodeWithHarry",
    "CSS":                    "CSS full course Hindi CodeWithHarry",
    "JavaScript":             "JavaScript full course Hindi Chai aur Code",
    "TypeScript":             "TypeScript tutorial Hindi",
    "React":                  "React JS full course Hindi Chai aur Code",
    "Vue.js":                 "Vue JS full course Hindi",
    "Angular":                "Angular full course Hindi",
    "Node.js":                "Node.js backend full course Hindi Chai aur Code",
    "Express.js":             "Express JS full course Hindi",
    "MongoDB":                "MongoDB full course Hindi Thapa Technical",
    "Authentication":         "JWT authentication Hindi tutorial",
    "Full Stack Projects":    "MERN stack project Hindi CodeWithHarry",
    "Deployment":             "web app deployment Hindi tutorial",
    "DOM":                    "JavaScript DOM Hindi tutorial",
    "Interview Preparation":  "web developer interview preparation Hindi Love Babbar",
    "Projects & Interview Preparation": "web projects interview Hindi",

    // ── AI / ML / Data Science ────────────────────────────────────────────
    "Python":                 "Python full course Hindi CodeWithHarry",
    "Data Structures":        "DSA full course Hindi Love Babbar",
    "NumPy":                  "NumPy tutorial Hindi CodeWithHarry",
    "Pandas":                 "Pandas tutorial Hindi",
    "Statistics":             "Statistics for data science Hindi",
    "Machine Learning":       "Machine Learning full course Hindi CampusX",
    "Deep Learning":          "Deep Learning full course Hindi CampusX",
    "TensorFlow/PyTorch":     "TensorFlow PyTorch Hindi tutorial",
    "Generative AI":          "Generative AI full course Hindi",
    "AI Projects":            "AI projects Hindi tutorial",
    "MLOps":                  "MLOps full course Hindi CampusX",
    "Data Visualization":     "Matplotlib Seaborn data visualization Hindi",

    // ── Cloud / DevOps ────────────────────────────────────────────────────
    "Linux Basics":           "Linux full course Hindi CodeWithHarry",
    "Linux Fundamentals":     "Linux fundamentals Hindi tutorial",
    "Networking Fundamentals":"Computer networking full course Hindi",
    "Networking Basics":      "Networking basics Hindi tutorial",
    "AWS Core Services":      "AWS full course Hindi",
    "Containers & Docker":    "Docker full course Hindi",
    "Kubernetes":             "Kubernetes full course Hindi",
    "Infrastructure as Code": "Terraform infrastructure as code Hindi",
    "Bash Scripting":         "Bash scripting full course Hindi",
    "CI/CD Pipelines":        "CI CD DevOps pipeline Hindi tutorial",
    "Jenkins":                "Jenkins full course Hindi",

    // ── Cybersecurity ─────────────────────────────────────────────────────
    "Security Principles":    "Cybersecurity full course Hindi",
    "Cryptography":           "Cryptography tutorial Hindi",
    "Penetration Testing":    "Ethical hacking full course Hindi",
    "Ethical Hacking Tools":  "Ethical hacking tools kali linux Hindi",
    "Incident Response":      "Incident response cybersecurity Hindi",

    // ── Mobile App Developer ──────────────────────────────────────────────
    "Dart Basics":            "Dart programming Hindi tutorial",
    "Flutter Fundamentals":   "Flutter full course Hindi Thapa Technical",
    "Flutter UI & Widgets":   "Flutter UI widgets Hindi tutorial",
    "State Management":       "Flutter state management Hindi",
    "API Integration & Firebase": "Flutter Firebase Hindi tutorial",
    "App Testing & Architecture": "Flutter testing architecture Hindi",
    "App Store Publishing & Projects": "Flutter app publish play store Hindi",

    // ── Game Developer ────────────────────────────────────────────────────
    "C#":                     "C# programming full course Hindi",
    "Unity Basics":           "Unity game development Hindi tutorial",
    "2D Game Development":    "Unity 2D game development Hindi",
    "3D Game Development":    "Unity 3D game development Hindi",
    "Game Physics & AI":      "Unity game physics AI Hindi tutorial",
    "Multiplayer & Networking": "Unity multiplayer game Hindi",
    "Game Optimization & Publishing": "Unity game optimization publish Hindi",

    // ── Blockchain Developer ──────────────────────────────────────────────
    "Blockchain Basics":      "Blockchain full course Hindi",
    "Ethereum Fundamentals":  "Ethereum blockchain Hindi tutorial",
    "Solidity":               "Solidity smart contracts Hindi",
    "Smart Contracts":        "Smart contracts Solidity Hindi tutorial",
    "Web3.js":                "Web3 development Hindi tutorial",
    "DApps":                  "DApp decentralized app Hindi tutorial",
    "Blockchain Security":    "Blockchain security Hindi tutorial",

    // ── UI/UX Designer ────────────────────────────────────────────────────
    "Design Principles":      "UI UX design principles Hindi GFX Mentor",
    "Color Theory":           "Color theory design Hindi GFX Mentor",
    "Wireframing":            "Wireframing UI design Hindi",
    "Figma":                  "Figma full course Hindi GFX Mentor",
    "Prototyping":            "Figma prototyping Hindi tutorial",
    "User Research":          "UX user research Hindi tutorial",
    "Accessibility":          "Web accessibility Hindi tutorial",
    "Portfolio & Case Studies": "UI UX portfolio Hindi GFX Mentor",

    // ── Data Engineer ─────────────────────────────────────────────────────
    "SQL":                    "SQL full course Hindi CodeWithHarry",
    "Data Modeling":          "Data modeling SQL Hindi tutorial",
    "Hadoop":                 "Hadoop big data Hindi tutorial",
    "Spark":                  "Apache Spark Hindi tutorial",
    "ETL Pipelines":          "ETL data pipeline Hindi tutorial",
    "Data Warehousing":       "Data warehousing Hindi tutorial",
    "Cloud Data Services":    "Cloud data AWS Hindi tutorial",

    // ── QA Tester ────────────────────────────────────────────────────────
    "Manual Testing Basics":  "Manual testing full course Hindi",
    "Test Planning & Cases":  "Test cases planning Hindi tutorial",
    "Automation Basics":      "Test automation Hindi tutorial",
    "Selenium":               "Selenium full course Hindi",
    "API Testing":            "API testing Postman Hindi tutorial",
    "Postman":                "Postman API testing full course Hindi",
    "Performance Testing":    "JMeter performance testing Hindi",
    "CI/CD Integration":      "CI CD testing pipeline Hindi tutorial",

    // ── Embedded Systems ─────────────────────────────────────────────────
    "C":                      "C programming full course Hindi CodeWithHarry",
    "Electronics Basics":     "Electronics basics Hindi tutorial",
    "Microcontrollers":       "Arduino microcontroller Hindi tutorial",
    "Sensors & Actuators":    "Arduino sensors actuators Hindi",
    "RTOS":                   "RTOS real time OS Hindi tutorial",
    "IoT Protocols":          "IoT protocols MQTT Hindi tutorial",
    "Embedded Projects":      "Embedded systems projects Hindi",

    // ── Java Enterprise ──────────────────────────────────────────────────
    "Java Core":              "Java full course Hindi CodeWithHarry",
    "Object Oriented Programming": "OOP Java Hindi tutorial",
    "Spring Framework":       "Spring framework Hindi Telusko",
    "Spring Boot":            "Spring Boot full course Hindi",
    "REST APIs":              "REST API Spring Boot Hindi tutorial",
    "Hibernate":              "Hibernate JPA Hindi tutorial",
    "JPA":                    "JPA Hibernate Hindi tutorial",
    "Microservices Architecture": "Microservices Java Hindi tutorial",

    // ── Generic Fallbacks ─────────────────────────────────────────────────
    "Basics & Fundamentals":  "programming basics fundamentals Hindi",
    "Version Control":        "Git GitHub full course Hindi CodeWithHarry",
    "Core Language Concepts": "programming core concepts Hindi tutorial",
    "Advanced Operations":    "advanced programming Hindi tutorial",
    "Frameworks & Libraries": "JavaScript frameworks Hindi tutorial",
    "Databases / State Management": "database SQL Hindi full course",
    "Architecture":           "software architecture Hindi tutorial",
    "Capstone Projects":      "programming projects Hindi tutorial",
    "Problem Solving":        "DSA problem solving Hindi Love Babbar",
    "Core Fundamentals":      "programming fundamentals Hindi",
    "Basic Tools":            "developer tools VS Code Hindi tutorial",
    "Intermediate Concepts":  "DSA algorithms intermediate Hindi",
    "Databases & APIs":       "database APIs Hindi tutorial",
};

// Build a YouTube search URL from a search query string
const buildYouTubeSearchUrl = (query) =>
    `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

// Get curated Hindi playlist URL for a skill
const getCuratedUrl = (skillName) => {
    // Exact match
    if (SKILL_HINDI_SEARCH[skillName]) {
        return {
            query: SKILL_HINDI_SEARCH[skillName],
            url: buildYouTubeSearchUrl(SKILL_HINDI_SEARCH[skillName])
        };
    }
    // Fuzzy match
    const normalized = skillName.toLowerCase().trim();
    for (const key of Object.keys(SKILL_HINDI_SEARCH)) {
        const kl = key.toLowerCase();
        if (normalized.includes(kl) || kl.includes(normalized)) {
            return {
                query: SKILL_HINDI_SEARCH[key],
                url: buildYouTubeSearchUrl(SKILL_HINDI_SEARCH[key])
            };
        }
    }
    return null;
};

// Ask OpenAI to generate the best Hindi search query for custom/unknown skills
const getAISearchQuery = async (skill) => {
    try {
        if (!process.env.OPENAI_API_KEY) return null;

        const prompt = `You are a learning resource expert.
For the skill: "${skill}", what is the best YouTube search query to find a free, high-quality Hindi course?
The query should target popular Hindi creators like CodeWithHarry, Chai aur Code, Thapa Technical, Apna College, CampusX, Love Babbar, etc.
Return ONLY a valid JSON object:
{"title": "course title", "channelName": "creator name", "searchQuery": "the exact YouTube search query"}
Output raw JSON only, no markdown.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
            max_tokens: 150
        });

        const raw = completion.choices[0].message.content.trim();
        const jsonStr = raw.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
        const res = JSON.parse(jsonStr);
        if (res.searchQuery) {
            return {
                title: res.title || `${skill} Full Course in Hindi`,
                channelName: res.channelName || "YouTube Hindi",
                url: buildYouTubeSearchUrl(res.searchQuery)
            };
        }
        return null;
    } catch (err) {
        console.warn(`OpenAI query failed for "${skill}":`, err.message);
        return null;
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// ROADMAP DEFINITIONS — 15 career paths
// ─────────────────────────────────────────────────────────────────────────────
const ROADMAPS = {
    "Web Developer": [
        "HTML", "CSS", "JavaScript", "React",
        "Projects & Interview Preparation"
    ],
    "Full Stack Developer": [
        "HTML", "CSS", "JavaScript", "React",
        "Node.js", "Express.js", "MongoDB", "Authentication",
        "Full Stack Projects", "Deployment", "Interview Preparation"
    ],
    "Data Scientist": [
        "Python", "Statistics", "NumPy", "Pandas",
        "Data Visualization", "Machine Learning", "Deep Learning",
        "Interview Preparation"
    ],
    "AI Engineer": [
        "Python", "Data Structures", "NumPy", "Pandas", "Statistics",
        "Machine Learning", "Deep Learning", "TensorFlow/PyTorch",
        "Generative AI", "AI Projects", "MLOps", "Interview Preparation"
    ],
    "Cyber Security Expert": [
        "Networking Basics", "Linux Fundamentals", "Security Principles",
        "Cryptography", "Penetration Testing", "Ethical Hacking Tools",
        "Incident Response", "Interview Preparation"
    ],
    "Cloud Engineer": [
        "Linux Basics", "Networking Fundamentals", "AWS Core Services",
        "Containers & Docker", "Kubernetes", "Infrastructure as Code",
        "Interview Preparation"
    ],
    "Mobile App Developer": [
        "Dart Basics", "Flutter Fundamentals", "Flutter UI & Widgets",
        "State Management", "API Integration & Firebase",
        "App Testing & Architecture", "App Store Publishing & Projects"
    ],
    "Game Developer": [
        "C#", "Unity Basics", "2D Game Development",
        "3D Game Development", "Game Physics & AI",
        "Multiplayer & Networking", "Game Optimization & Publishing"
    ],
    "DevOps Engineer": [
        "Linux Basics", "Bash Scripting", "Networking Fundamentals",
        "Containers & Docker", "CI/CD Pipelines", "Jenkins",
        "Kubernetes", "Infrastructure as Code"
    ],
    "Blockchain Developer": [
        "Cryptography", "Blockchain Basics", "Ethereum Fundamentals",
        "Solidity", "Smart Contracts", "Web3.js", "DApps",
        "Blockchain Security"
    ],
    "UI/UX Designer": [
        "Design Principles", "Color Theory", "Wireframing", "Figma",
        "Prototyping", "User Research", "Accessibility",
        "Portfolio & Case Studies"
    ],
    "Data Engineer": [
        "Python", "SQL", "Data Modeling", "Hadoop", "Spark",
        "ETL Pipelines", "Data Warehousing", "Cloud Data Services"
    ],
    "QA Tester": [
        "Manual Testing Basics", "Test Planning & Cases",
        "Automation Basics", "Selenium", "API Testing", "Postman",
        "Performance Testing", "CI/CD Integration"
    ],
    "Embedded Systems Engineer": [
        "C", "Electronics Basics", "Microcontrollers",
        "Sensors & Actuators", "RTOS", "IoT Protocols", "Embedded Projects"
    ],
    "Java Enterprise Developer": [
        "Java Core", "Object Oriented Programming", "Spring Framework",
        "Spring Boot", "REST APIs", "Hibernate", "JPA",
        "Microservices Architecture"
    ]
};

const GENERIC_ROADMAP = [
    "Basics & Fundamentals", "Version Control", "Core Language Concepts",
    "Advanced Operations", "Frameworks & Libraries", "Databases / State Management",
    "Architecture", "Capstone Projects", "Interview Preparation"
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN FUNCTION: Generate roadmap + Hindi YouTube suggestions per skill
// ─────────────────────────────────────────────────────────────────────────────
export const generateStaticRoadmap = async ({ userId, careerGoal, skills, studyHours }) => {
    const baseRoadmap = ROADMAPS[careerGoal] || GENERIC_ROADMAP;
    const knownSkills = skills.map(s => s.toLowerCase().trim());

    // Filter out skills the user already knows
    const finalRoadmap = baseRoadmap.filter(
        skill => !knownSkills.includes(skill.toLowerCase().trim())
    );

    // Calculate timeline
    const hoursPerSkill = 40;
    const totalHours = finalRoadmap.length * hoursPerSkill;
    const daysNeeded = Math.ceil(totalHours / (studyHours || 2));
    const monthsNeeded = Math.ceil(daysNeeded / 30);
    let timelineStr = `${daysNeeded} Days (~${monthsNeeded} Months)`;
    if (studyHours >= 6) timelineStr += " (Fast Track)";
    else if (studyHours <= 2) timelineStr += " (Extended Timeline)";

    // Build recommended videos list — one per skill
    const recommendedVideos = [];
    for (const skill of finalRoadmap) {
        // 1st: Use our curated Hindi search query map (fastest, always works)
        const curated = getCuratedUrl(skill);
        if (curated) {
            recommendedVideos.push({
                title: `${skill} Full Course in Hindi`,
                category: "Education",
                channelName: "Top Hindi Educator",
                views: 200000,
                url: curated.url
            });
            continue;
        }

        // 2nd: Ask OpenAI to craft the best Hindi search query for this custom skill
        const aiResult = await getAISearchQuery(skill);
        if (aiResult) {
            recommendedVideos.push({
                title: aiResult.title,
                category: "Education",
                channelName: aiResult.channelName,
                views: 150000,
                url: aiResult.url
            });
            continue;
        }

        // 3rd: Guaranteed fallback — always opens valid YouTube search results
        recommendedVideos.push({
            title: `${skill} Full Course in Hindi`,
            category: "Education",
            channelName: "YouTube Hindi Courses",
            views: 100000,
            url: buildYouTubeSearchUrl(`${skill} full course in Hindi`)
        });
    }

    // Save to DB
    const newRoadmap = await Roadmap.findOneAndUpdate(
        { userId },
        { skills, careerGoal, studyHours, roadmap: finalRoadmap, timeline: timelineStr, recommendedVideos },
        { new: true, upsert: true }
    );

    // Reset progress
    const newProgress = await Progress.findOneAndUpdate(
        { userId },
        { completedSkills: [], percentage: 0 },
        { new: true, upsert: true }
    );

    return { roadmap: newRoadmap, progress: newProgress };
};
