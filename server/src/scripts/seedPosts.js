import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

// Adds the starter blog articles. Safe to run again: posts that already
// exist (same URL) are skipped, so edits made in the admin panel are kept.
//   npm run seed-posts
const starterPosts = [
  {
    "title": "How to Calculate Roofing Squares (With Examples)",
    "slug": "how-to-calculate-roofing-squares",
    "excerpt": "What a roofing square is, how to turn roof area into squares, and how pitch and waste change the number of squares you order.",
    "category": "Guides",
    "publishedAt": "2026-09-24",
    "tags": [
      "roofing squares",
      "estimating"
    ],
    "content": "Shingles, underlayment and most roofing materials are sold by the square, not by the square foot. Getting the number of squares right is the difference between a profitable job and a second trip to the supplier.\n\n## What is a roofing square?\n\nOne roofing square is 100 square feet of roof surface. A roof with 2,500 square feet of surface area is 25 squares. Most three-tab and architectural shingles come in bundles of three per square.\n\n## Step 1: Measure the roof area, not the footprint\n\nThe biggest mistake is measuring the house from the ground. The footprint of a building is smaller than its roof, because a sloped roof covers more surface than the flat area beneath it, and eaves hang past the walls.\n\nTo go from footprint to real roof area, multiply by the pitch factor for the roof's slope:\n\n| Pitch | Pitch factor |\n| --- | --- |\n| 4/12 | 1.054 |\n| 6/12 | 1.118 |\n| 8/12 | 1.202 |\n| 10/12 | 1.302 |\n| 12/12 | 1.414 |\n\nExample: a 40 ft × 50 ft footprint (2,000 sq ft, including the overhangs) with an 8/12 pitch has about 2,000 × 1.202 = 2,404 sq ft of roof surface.\n\n## Step 2: Divide by 100\n\n2,404 sq ft ÷ 100 = 24.04 squares. That's the actual surface of the roof.\n\n## Step 3: Add a waste factor\n\nYou'll always cut and lose some material at hips, valleys, rakes and around penetrations. Add waste before you order:\n\n- Simple gable roofs: around 10%\n- Hip roofs: around 15%\n- Complex roofs with many valleys and dormers: 15–20% or more\n\nFor our 8/12 hip roof: 24.04 × 1.15 = 27.6, so you'd order 28 squares, plus ridge cap and starter based on the ridge, hip and eave lengths.\n\n> **Tip:** Our reports include a waste factor table with the squares to order at common waste percentages, so you can skip the math.\n\n## When a roof has more than one pitch\n\nMany roofs mix pitches, for example a steep main roof with a low-slope porch. Calculate each section separately with its own pitch factor and add them up. This is where measuring by hand gets slow and error-prone, and where a facet-by-facet report pays for itself."
  },
  {
    "title": "Roof Pitch Explained: How to Read It and Why It Matters",
    "slug": "roof-pitch-explained",
    "excerpt": "What roof pitch means, how to read numbers like 6/12, how pitch affects materials and labor, and the minimum pitch for common roofing materials.",
    "category": "Guides",
    "publishedAt": "2026-09-17",
    "tags": [
      "roof pitch",
      "estimating"
    ],
    "content": "Roof pitch tells you how steep a roof is. It affects how much material you need, which materials you can use, and how long the job will take, so it's one of the first numbers on any estimate.\n\n## How to read roof pitch\n\nPitch is written as rise over run, with the run always 12 inches. A 6/12 pitch rises 6 inches for every 12 inches it runs horizontally. The bigger the first number, the steeper the roof.\n\n- Low slope: below 4/12, common on porches, additions and commercial buildings\n- Conventional: 4/12 to 9/12, most homes\n- Steep: 9/12 and above, often needs extra safety equipment and labor\n\n## Why pitch matters for estimates\n\nA steeper roof has more surface area than a flatter roof over the same footprint. A 12/12 roof has about 41% more surface than its footprint, so pitch directly changes how many squares you order.\n\nSteep roofs also take longer and cost more to install. Many contractors add a labor charge above 7/12 or 8/12, and roofs above 10/12 or 12/12 usually need roof jacks and harnesses on every job.\n\n## Minimum pitch for common materials\n\n| Material | Typical minimum pitch |\n| --- | --- |\n| Asphalt shingles | 2/12 (with extra underlayment below 4/12) |\n| Standing seam metal | About 1/4:12 to 3/12, depending on the panel |\n| Clay or concrete tile | 2.5/12 to 4/12 |\n| Flat roof membranes (TPO, EPDM) | Near flat, with a slight slope for drainage |\n\nAlways check the manufacturer's installation instructions and local building code. They have the final say.\n\n## How to find pitch without climbing the roof\n\nYou can estimate pitch from the ground with a pitch gauge app, but results vary. An aerial measurement report gives the pitch of every facet, so you know the numbers before you arrive.\n\n> **Tip:** Every report we deliver lists the pitch for each roof facet and the predominant pitch of the roof."
  },
  {
    "title": "Aerial vs. Manual Roof Measurements: Which Is Right for Your Business?",
    "slug": "aerial-vs-manual-roof-measurements",
    "excerpt": "A practical comparison of measuring roofs by hand and ordering aerial roof measurement reports: time, cost, safety, accuracy and when each makes sense.",
    "category": "Business",
    "publishedAt": "2026-09-10",
    "tags": [
      "aerial measurement",
      "business"
    ],
    "content": "For years, measuring a roof meant a ladder, a tape measure and a few hours on site. Aerial roof measurement reports have changed that for many contractors and adjusters, but they're not the right choice for every job. Here's how the two compare.\n\n## Time\n\nA manual measurement means driving to the property, setting up, climbing, measuring every section and then drawing it up at the office. An aerial report is ordered in a few minutes, and you can order reports for several properties at once.\n\n## Safety\n\nFalls are one of the leading causes of injury in construction. Every roof you don't need to climb for measurements is a risk avoided, especially on steep, wet or damaged roofs after a storm.\n\n## Accuracy\n\nManual measurements depend on the person taking them. It's easy to miss a small facet or misjudge a pitch. Aerial reports measure every facet from imagery and are checked before delivery. They can be affected by heavy tree cover or very recent changes to the building, so it's still good practice to confirm key numbers when you're on site.\n\n## Cost\n\nA report costs a fixed fee per roof. A manual measurement costs a crew member's time and travel, including for the jobs you don't win. For most contractors, a report costs less than the time it replaces.\n\n## When manual measuring still makes sense\n\n- You're already on site for an inspection and the roof is simple and safe\n- The property has very heavy tree cover hiding the roof\n- The building was changed after the latest imagery was taken\n\n## The bottom line\n\nMost businesses use both: aerial reports to quote quickly and safely, and a quick check on site before the job starts. The time you save on measuring is time you can spend selling and building.\n\n> **Tip:** See what's inside a report on our sample reports page before you order your first one."
  }
];

let exitCode = 0;

const seedPosts = async () => {
  await connectDB();

  try {
    const admin = await User.findOne({ role: "admin" }).sort({ createdAt: 1 });
    let added = 0;

    for (const data of starterPosts) {
      if (await Post.exists({ slug: data.slug })) {
        console.log(`Skipped (already exists): ${data.slug}`);
        continue;
      }
      await Post.create({
        ...data,
        status: "published",
        publishedAt: new Date(`${data.publishedAt}T12:00:00Z`),
        author: admin?._id,
        updatedBy: admin?._id,
      });
      added++;
      console.log(`Added: ${data.slug}`);
    }

    console.log(`Done. ${added} post(s) added.`);
  } catch (err) {
    console.error(`Failed to seed posts: ${err.message}`);
    exitCode = 1;
  } finally {
    await mongoose.disconnect();
    process.exit(exitCode);
  }
};

seedPosts();
