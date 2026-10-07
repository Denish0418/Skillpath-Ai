/**
 * testApi.js — end-to-end API test for SkillPath AI
 * Tests: register → login → generate roadmap → chat → mark skill
 * Run: node testApi.js
 */
import http from "http";

const TEST_EMAIL = `apitest_${Date.now()}@example.com`;
const TEST_PASS  = "Test@1234";

const call = (method, path, body) => new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = {
        hostname: "localhost",
        port: 5000,
        path,
        method,
        headers: {
            "Content-Type": "application/json",
            ...(data ? { "Content-Length": Buffer.byteLength(data) } : {})
        }
    };
    const req = http.request(opts, res => {
        let raw = "";
        res.on("data", d => raw += d);
        res.on("end", () => {
            try { resolve({ status: res.statusCode, data: JSON.parse(raw) }); }
            catch { resolve({ status: res.statusCode, data: raw }); }
        });
    });
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
});

const ok  = (label, cond, val) => {
    const pass = cond(val);
    console.log(`  ${pass ? "✅" : "❌"} ${label}: ${JSON.stringify(pass ? (typeof val === "object" ? "[object]" : val) : val).slice(0,120)}`);
    return pass;
};

const run = async () => {
    console.log("═══════════════════════════════════════════");
    console.log("  SkillPath AI — Full API Verification Test");
    console.log("═══════════════════════════════════════════\n");
    let userId;

    // 1. Register
    console.log("1️⃣  Register new user...");
    const reg = await call("POST", "/api/auth/register", {
        name: "API Test User", email: TEST_EMAIL,
        password: TEST_PASS, education: "B.Tech",
        careerGoal: "Full Stack Developer", skillLevel: "Beginner"
    });
    ok("Registration status 201", s => s === 201, reg.status);
    ok("User created with name", u => u?.user?.name === "API Test User", reg.data);
    userId = reg.data?.user?._id;
    console.log(`  → userId: ${userId}\n`);

    // 2. Login
    console.log("2️⃣  Login...");
    const login = await call("POST", "/api/auth/login", { email: TEST_EMAIL, password: TEST_PASS });
    ok("Login status 200", s => s === 200, login.status);
    ok("Login message success", d => d?.message?.includes("Successful"), login.data);
    console.log();

    // 3. Generate AI roadmap via chatbot endpoint
    console.log("3️⃣  Generate AI roadmap (Full Stack Developer, knows HTML + CSS, 4hrs/day)...");
    const rm = await call("POST", "/api/chatbot/generate-roadmap", {
        userId, name: "API Test User", education: "B.Tech",
        skills: ["HTML", "CSS"], careerGoal: "Full Stack Developer", studyHours: 4
    });
    ok("Roadmap generation 200", s => s === 200, rm.status);
    ok("Roadmap careerGoal correct", d => d?.roadmap?.careerGoal === "Full Stack Developer", rm.data);
    ok("Roadmap has months", d => d?.roadmap?.roadmap?.length > 0, rm.data);
    ok("Roadmap has resources", d => d?.roadmap?.resources?.length > 0, rm.data);
    ok("HTML already completed (was in known skills)", d => d?.roadmap?.completedSkills?.includes("HTML"), rm.data);
    
    const months = rm.data?.roadmap?.roadmap || [];
    console.log(`  → Months generated: ${months.length}`);
    months.forEach(m => console.log(`     ${m.month}: ${m.skills.join(", ")}`));

    const resources = rm.data?.roadmap?.resources || [];
    const reactRes = resources.find(r => r.skill === "React");
    const nodeRes  = resources.find(r => r.skill === "Node.js");
    ok("React resource has YouTube URL", r => r?.youtube?.includes("youtube.com"), reactRes);
    ok("Node.js resource has YouTube URL", r => r?.youtube?.includes("youtube.com"), nodeRes);
    ok("React resource has course URL", r => !!r?.course, reactRes);
    ok("React resource has docs URL", r => !!r?.docs, reactRes);
    
    if (reactRes) console.log(`  → React YouTube: ${reactRes.youtube}`);
    if (nodeRes)  console.log(`  → Node.js YouTube: ${nodeRes.youtube}`);
    console.log();

    // 4. Fetch roadmap
    console.log("4️⃣  Fetch saved roadmap...");
    const fetchRm = await call("GET", `/api/roadmap/${userId}`);
    ok("Roadmap fetch 200", s => s === 200, fetchRm.status);
    ok("Roadmap userId matches", d => d?.userId === userId, fetchRm.data);
    console.log();

    // 5. Mark a skill as completed via roadmap endpoint
    console.log("5️⃣  Mark 'JavaScript' as completed...");
    const mark = await call("PATCH", `/api/roadmap/${userId}/complete`, {
        skill: "JavaScript", completed: true
    });
    ok("Mark skill 200", s => s === 200, mark.status);
    ok("JavaScript now in completedSkills", d => d?.roadmap?.completedSkills?.includes("JavaScript"), mark.data);
    ok("Progress increased", d => d?.roadmap?.completedSkills?.length >= 2, mark.data);
    const prog = mark.data?.roadmap?.completedSkills?.length || 0;
    const total = (mark.data?.roadmap?.roadmap || []).reduce((a, m) => a + m.skills.length, 0);
    console.log(`  → Progress: ${prog}/${total} skills (${Math.round(prog/total*100)}%)`);
    console.log();

    // 6. AI Chatbot — resource request
    console.log("6️⃣  AI SkillBot: ask for React resources...");
    const chat1 = await call("POST", "/api/chatbot/chat", {
        userId, message: "show me React resources"
    });
    ok("Chat 200", s => s === 200, chat1.status);
    ok("Response has reply text", d => !!d?.reply, chat1.data);
    ok("Response has resourceLinks", d => !!d?.resourceLinks, chat1.data);
    ok("ResourceLink skill is React", d => d?.resourceLinks?.skill === "React", chat1.data);
    ok("ResourceLink has YouTube URL", d => d?.resourceLinks?.youtube?.includes("youtube.com"), chat1.data);
    console.log(`  → Bot reply: "${chat1.data?.reply?.slice(0, 80)}..."`);
    console.log(`  → YouTube:   ${chat1.data?.resourceLinks?.youtube}`);
    console.log(`  → Course:    ${chat1.data?.resourceLinks?.course}`);
    console.log(`  → Docs:      ${chat1.data?.resourceLinks?.docs}`);
    console.log();

    // 7. AI Chatbot — free text GPT response
    console.log("7️⃣  AI SkillBot: GPT free-text question...");
    const chat2 = await call("POST", "/api/chatbot/chat", {
        userId, message: "How long will it take me to become a Full Stack Developer?"
    });
    ok("Chat 200", s => s === 200, chat2.status);
    ok("Response has reply text", d => d?.reply?.length > 30, chat2.data);
    console.log(`  → GPT reply: "${chat2.data?.reply?.slice(0, 200)}..."`);
    console.log();

    // 8. AI Chatbot — mark via chat
    console.log("8️⃣  AI SkillBot: mark skill via chat...");
    const chat3 = await call("POST", "/api/chatbot/chat", {
        userId, message: "mark React as completed"
    });
    ok("Chat 200", s => s === 200, chat3.status);
    ok("Roadmap updated flag", d => d?.roadmapUpdated === true, chat3.data);
    ok("React now completed in roadmap", d => d?.roadmap?.completedSkills?.includes("React"), chat3.data);
    console.log(`  → Bot reply: "${chat3.data?.reply?.slice(0, 100)}"`);
    console.log();

    // 9. Get career paths
    console.log("9️⃣  List career paths...");
    const paths = await call("GET", "/api/careerpaths");
    ok("Careerpaths 200", s => s === 200, paths.status);
    ok("Has 8 career paths seeded", d => Array.isArray(d) && d.length === 8, paths.data);
    console.log(`  → Paths: ${(paths.data || []).map(p => p.goalTitle).join(", ")}`);
    console.log();

    console.log("═══════════════════════════════════════════");
    console.log("  ✅ All API tests complete!");
    console.log("═══════════════════════════════════════════\n");
};

run().catch(err => {
    console.error("❌ Test suite crashed:", err.message);
    process.exit(1);
});
