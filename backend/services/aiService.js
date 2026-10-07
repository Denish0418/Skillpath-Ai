/**
 * aiService.js
 * OpenAI-powered AI backend for SkillPath AI's SkillBot.
 * Uses GPT-4o-mini for cost efficiency while maintaining quality.
 * Structured so you can swap models or providers (Gemini, etc.) later.
 */

import OpenAI from "openai";
import { CAREER_PATHS, SKILL_RESOURCES } from "../config/seedData.js";

// Lazy OpenAI client initialization to prevent top-level module load crashes in serverless
let openaiClient = null;
const getOpenAIClient = () => {
    if (!openaiClient) {
        openaiClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_fallback"
        });
    }
    return openaiClient;
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. GENERATE ROADMAP USING GPT
//    Given a user profile, asks GPT to produce a personalized monthly roadmap.
//    Falls back to the curated CAREER_PATHS dataset if GPT fails.
// ─────────────────────────────────────────────────────────────────────────────
export const generateAIRoadmap = async ({ name, education, skills, careerGoal, studyHours }) => {
    const prompt = `You are SkillBot, an AI career advisor at SkillPath AI.

A student has provided the following profile:
- Name: ${name}
- Education: ${education}
- Skills they already know: ${skills.length > 0 ? skills.join(", ") : "None"}
- Career Goal: ${careerGoal}
- Study Hours Per Day: ${studyHours}

Task: Generate a personalized month-by-month learning roadmap for them to reach the goal of "${careerGoal}".

Rules:
1. Skip skills they already know.
2. Organize skills into monthly chunks based on ${studyHours} study hours/day.
3. Logically order skills from foundations to advanced.
4. Output ONLY valid JSON in this exact format:
[
  { "month": "Month 1", "skills": ["Skill A", "Skill B"] },
  { "month": "Month 2", "skills": ["Skill C"] }
]
5. No explanation text — only the JSON array.`;

    try {
        const completion = await getOpenAIClient().chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.4,
            max_tokens: 800
        });

        const raw = completion.choices[0].message.content.trim();

        // Extract JSON block from the response
        const jsonMatch = raw.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error("No JSON array found in GPT response");

        const roadmapArray = JSON.parse(jsonMatch[0]);

        // Validate structure
        if (!Array.isArray(roadmapArray) || !roadmapArray[0]?.month) {
            throw new Error("Invalid roadmap format from GPT");
        }

        return { success: true, roadmap: roadmapArray };

    } catch (error) {
        console.error("GPT roadmap generation failed, using curated fallback:", error.message);

        // Fallback: Use curated CAREER_PATHS dataset
        const fallbackPath = CAREER_PATHS[careerGoal] || CAREER_PATHS["Other"];

        // Filter out already known skills
        const filteredRoadmap = fallbackPath.roadmap.map(monthObj => ({
            month: monthObj.month,
            skills: monthObj.skills.filter(s => !skills.includes(s))
        })).filter(m => m.skills.length > 0);

        return { success: true, roadmap: filteredRoadmap, usedFallback: true };
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. GET YOUTUBE + RESOURCE RECOMMENDATIONS FOR A SKILL
//    Asks GPT for specific YouTube search queries and resource links.
//    Merges with curated SKILL_RESOURCES links for reliability.
// ─────────────────────────────────────────────────────────────────────────────
export const getAISkillResources = async (skillName) => {
    // Check curated static resources first
    const curated = SKILL_RESOURCES[skillName];

    const prompt = `You are a learning resource expert.
For the skill: "${skillName}", provide:
1. The best YouTube playlist search query (be specific, e.g., "React JS Complete Course 2024 Traversy Media")
2. The best free online course URL (freecodecamp.org, kaggle.com, etc.)
3. The official documentation URL

Output ONLY valid JSON:
{
  "youtubeQuery": "...",
  "youtubeUrl": "https://www.youtube.com/results?search_query=...",
  "courseUrl": "...",
  "docsUrl": "..."
}`;

    try {
        const completion = await getOpenAIClient().chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
            max_tokens: 300
        });

        const raw = completion.choices[0].message.content.trim();
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON found in GPT response");

        const aiRes = JSON.parse(jsonMatch[0]);

        return {
            skill: skillName,
            // Prefer curated static links when available (more reliable), supplement with AI
            youtube: curated?.youtube || aiRes.youtubeUrl,
            course: curated?.course || aiRes.courseUrl,
            docs: curated?.docs || aiRes.docsUrl,
            youtubeQuery: aiRes.youtubeQuery
        };

    } catch (error) {
        console.error(`GPT resource fetch failed for ${skillName}, using curated:`, error.message);

        // Fallback to curated or generic search
        return {
            skill: skillName,
            youtube: curated?.youtube || `https://www.youtube.com/results?search_query=${encodeURIComponent(skillName + " tutorial 2024")}`,
            course: curated?.course || `https://www.freecodecamp.org/news/?s=${encodeURIComponent(skillName)}`,
            docs: curated?.docs || `https://en.wikipedia.org/wiki/${encodeURIComponent(skillName)}`
        };
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. GENERAL SKILLBOT CHAT — Free-text AI conversation
//    Handles any user question about learning, skills, or career guidance.
// ─────────────────────────────────────────────────────────────────────────────
export const skillBotChat = async ({ userMessage, userProfile, roadmapContext }) => {
    const systemPrompt = `You are SkillBot, a friendly and expert AI career coach built into SkillPath AI.

User profile:
- Name: ${userProfile.name}
- Education: ${userProfile.education || "Not specified"}
- Career Goal: ${userProfile.careerGoal || "Not specified"}
- Skills known: ${userProfile.skills?.join(", ") || "None"}
- Study hours/day: ${userProfile.studyHours || "Not specified"}

${roadmapContext ? `Their current learning roadmap goal: ${roadmapContext.goal}
Completed skills: ${roadmapContext.completedSkills?.join(", ") || "None"}
Pending skills: ${roadmapContext.pendingSkills?.join(", ") || "All"}` : "They haven't generated a roadmap yet."}

Instructions:
- Be warm, motivating, and concise (2-4 sentences max per response).
- If asked about YouTube resources or learning materials for a skill, provide specific, real resource recommendations.
- If asked what to study next, advise based on their roadmap and pending skills.
- If asked to mark a skill, tell them to use the toggle in "My Roadmap" tab or the chat command format.
- Do NOT make up URLs — use general guidance like "search YouTube for [skill] tutorial by [channel]".
- Always end with an encouraging sentence.`;

    try {
        const completion = await getOpenAIClient().chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: 400
        });

        return {
            success: true,
            reply: completion.choices[0].message.content.trim()
        };

    } catch (error) {
        console.error("GPT skillbot chat failed:", error.message);

        // If the error is a quota/billing issue, provide a realistic mock response for testing the UI
        if (error.status === 429 || error.message.toLowerCase().includes("quota")) {
            return {
                success: false,
                reply: `🤖 *[Demo Mode - API Quota Exceeded]*\nBased on your profile, focusing on ${roadmapContext?.pendingSkills?.[0] || "your next skill"} is the best step forward. Typically, with ${userProfile.studyHours || "a few"} hours of study a day, you can expect to reach your goal of becoming a ${userProfile.careerGoal || "developer"} in about 4-6 months. Keep up the great work! Let me know if you need specific resources.`
            };
        }

        return {
            success: false,
            reply: "I'm having trouble connecting to my AI brain right now. Please try asking again in a moment, or use the 'My Roadmap' tab to view your resources directly!"
        };
    }
};
