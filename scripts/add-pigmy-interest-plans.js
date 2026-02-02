require('dotenv').config();
const mongoose = require("mongoose");
const InterestModel = require("../models/interest.model");

// MongoDB connection URI - Loaded from environment variables
const MONGO_URI = process.env.MONGO_URI;

/**
 * Script to add three new interest plans:
 * 1. Pigmy Saving (6 months, 4%)
 * 2. Pigmy Loan (3 months, 0%)
 * 3. Pigmy Gold Loan (12 months, 0%)
 */

const newInterestPlans = [
    {
        plan_type: "PIGMY SAVING",
        interest_name: "Pigmy Saving - 6 Months",
        duration: 6,
        interest_rate_general: 4.0,
        interest_rate_senior: 4.0,
        minimum_deposit: 0,
        status: "active"
    },
    {
        plan_type: "PIGMY LOAN",
        interest_name: "Pigmy Loan - 3 Months",
        duration: 3,
        interest_rate_general: 0.0,
        interest_rate_senior: 0.0,
        minimum_deposit: 0,
        status: "active"
    },
    {
        plan_type: "PIGMY GOLD LOAN",
        interest_name: "Pigmy Gold Loan - 12 Months",
        duration: 12,
        interest_rate_general: 0.0,
        interest_rate_senior: 0.0,
        minimum_deposit: 0,
        status: "active"
    }
];

async function addInterestPlans() {
    try {
        // Connect to MongoDB
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB successfully");

        // Get the last interest_id to determine the next ID
        const lastInterest = await InterestModel.findOne()
            .sort({ interest_id: -1 })
            .limit(1);

        let nextIdNumber = 1;
        if (lastInterest && lastInterest.interest_id) {
            const numericPart = lastInterest.interest_id.replace(/^INT/, '');
            const lastId = parseInt(numericPart);
            if (!isNaN(lastId)) {
                nextIdNumber = lastId + 1;
            }
        }

        console.log(`\n📋 Starting from Interest ID: INT${nextIdNumber.toString().padStart(4, '0')}\n`);

        // Create each interest plan
        for (let i = 0; i < newInterestPlans.length; i++) {
            const plan = newInterestPlans[i];
            const interest_id = `INT${(nextIdNumber + i).toString().padStart(4, '0')}`;

            // Check if this plan already exists
            const existingPlan = await InterestModel.findOne({
                plan_type: plan.plan_type,
                duration: plan.duration
            });

            if (existingPlan) {
                console.log(`⚠️  Interest plan "${plan.interest_name}" already exists (${existingPlan.interest_id}). Skipping...`);
                continue;
            }

            // Create the new interest plan
            const newInterest = await InterestModel.create({
                interest_id,
                ...plan,
                from_date: new Date(),
                to_date: null
            });

            console.log(`✅ Created: ${newInterest.interest_id} - ${newInterest.interest_name}`);
            console.log(`   Plan Type: ${newInterest.plan_type}`);
            console.log(`   Duration: ${newInterest.duration} months`);
            console.log(`   Interest Rate: ${newInterest.interest_rate_general}%\n`);
        }

        console.log("🎉 All interest plans have been processed successfully!");

    } catch (error) {
        console.error("❌ Error adding interest plans:", error);
        throw error;
    } finally {
        // Close MongoDB connection
        await mongoose.connection.close();
        console.log("\n🔌 MongoDB connection closed");
    }
}

// Run the script
addInterestPlans()
    .then(() => {
        console.log("\n✅ Script completed successfully");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Script failed:", error.message);
        process.exit(1);
    });
