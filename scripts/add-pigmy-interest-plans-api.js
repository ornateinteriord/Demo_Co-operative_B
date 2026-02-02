const axios = require('axios');

/**
 * Script to add three new interest plans using the API:
 * 1. Pigmy Saving (6 months, 4%)
 * 2. Pigmy Loan (3 months, 0%)
 * 3. Pigmy Gold Loan (12 months, 0%)
 */

const API_BASE_URL = 'http://localhost:5051'; // Update if different

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

async function addInterestPlansViaAPI() {
    console.log('📋 Adding interest plans via API endpoint...\n');

    for (const plan of newInterestPlans) {
        try {
            console.log(`➕ Creating: ${plan.interest_name}...`);

            const response = await axios.post(
                `${API_BASE_URL}/api/admin/interest`,
                plan,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                console.log(`✅ Created: ${response.data.data.interest_id} - ${plan.interest_name}`);
                console.log(`   Plan Type: ${plan.plan_type}`);
                console.log(`   Duration: ${plan.duration} months`);
                console.log(`   Interest Rate: ${plan.interest_rate_general}%\n`);
            } else {
                console.log(`⚠️  Failed to create: ${plan.interest_name}`);
                console.log(`   Message: ${response.data.message}\n`);
            }
        } catch (error) {
            if (error.response) {
                // Check if it's a duplicate/conflict error
                if (error.response.status === 409 || error.response.status === 400) {
                    console.log(`⚠️  ${plan.interest_name} may already exist or validation failed`);
                    console.log(`   Error: ${error.response.data.message}\n`);
                } else {
                    console.error(`❌ Error creating ${plan.interest_name}:`);
                    console.error(`   Status: ${error.response.status}`);
                    console.error(`   Message: ${error.response.data.message || error.message}\n`);
                }
            } else {
                console.error(`❌ Network error creating ${plan.interest_name}:`, error.message, '\n');
            }
        }
    }

    console.log('🎉 Script completed!');
}

// Run the script
addInterestPlansViaAPI()
    .then(() => {
        console.log("\n✅ All done!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Script failed:", error.message);
        process.exit(1);
    });
