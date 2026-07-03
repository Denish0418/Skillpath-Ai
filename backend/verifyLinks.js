/**
 * verifyLinks.js — checks all YouTube, course, and doc URLs in seedData
 * Runs: node verifyLinks.js
 */
import https from "https";
import http from "http";
import { SKILL_RESOURCES } from "./config/seedData.js";

const checkUrl = (url) => {
    return new Promise((resolve) => {
        try {
            const protocol = url.startsWith("https") ? https : http;
            const req = protocol.get(url, { timeout: 8000 }, (res) => {
                resolve({ url, status: res.statusCode, ok: res.statusCode < 400 });
                req.destroy();
            });
            req.on("error", (e) => resolve({ url, status: "ERR", ok: false, error: e.message }));
            req.on("timeout", () => { req.destroy(); resolve({ url, status: "TIMEOUT", ok: false }); });
        } catch (e) {
            resolve({ url, status: "ERR", ok: false, error: e.message });
        }
    });
};

const run = async () => {
    console.log("🔍 Verifying all resource links...\n");
    
    const checks = [];
    for (const [skill, res] of Object.entries(SKILL_RESOURCES)) {
        checks.push({ skill, type: "YouTube",  url: res.youtube });
        checks.push({ skill, type: "Course",   url: res.course });
        checks.push({ skill, type: "Docs",     url: res.docs });
    }

    // Run in batches of 10 to avoid overwhelming network
    const batchSize = 10;
    const results = [];
    for (let i = 0; i < checks.length; i += batchSize) {
        const batch = checks.slice(i, i + batchSize);
        const batchResults = await Promise.all(
            batch.map(c => checkUrl(c.url).then(r => ({ ...c, ...r })))
        );
        results.push(...batchResults);
        process.stdout.write(`  Checked ${Math.min(i + batchSize, checks.length)}/${checks.length}...\r`);
    }

    console.log("\n");
    const broken = results.filter(r => !r.ok);
    const ok     = results.filter(r => r.ok);

    console.log(`✅ Working: ${ok.length}/${results.length}`);
    
    if (broken.length > 0) {
        console.log(`\n❌ Broken or unreachable (${broken.length}):`);
        broken.forEach(r => {
            console.log(`  [${r.status}] ${r.skill} → ${r.type}: ${r.url}`);
        });
    } else {
        console.log("🎉 All links are reachable!");
    }
};

run();
