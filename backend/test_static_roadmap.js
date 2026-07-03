import axios from "axios";

async function testStatic() {
    try {
        console.log("1. Generating static roadmap...");
        const generateRes = await axios.post("http://localhost:5000/api/roadmap/generate", {
            userId: "6a37c5c2cfc6719375a5f73c", // Reuse a known user ID
            careerGoal: "Full Stack Developer",
            skills: ["HTML", "CSS"],
            studyHours: 4
        });
        
        console.log("Roadmap Generated:", generateRes.data.roadmap.roadmap);
        console.log("Timeline:", generateRes.data.roadmap.timeline);

        console.log("2. Marking skill as completed...");
        const markRes = await axios.post("http://localhost:5000/api/progress/update", {
            userId: "6a37c5c2cfc6719375a5f73c",
            skill: "JavaScript"
        });
        
        console.log("Progress:", markRes.data.percentage + "%", "Completed:", markRes.data.completedSkills);
        console.log("Test Passed!");
    } catch (e) {
        console.error("Test Failed:", e.response?.data || e.message);
    }
}

testStatic();
