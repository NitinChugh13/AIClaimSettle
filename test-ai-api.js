const fs = require('fs');

async function testAI() {
  const imageBase64 = fs.readFileSync('test-car-damage.jpg', { encoding: 'base64' });

  const payload = {
    policy: {
      vehicle_year: 2022,
      vehicle_make: 'Maruti',
      vehicle_model: 'Swift',
      vehicle_type: 'hatchback',
      engine_cc: 1197,
      zero_depreciation: true,
      idv: 500000
    },
    incidentType: 'collision',
    incidentLocation: 'Mumbai, Maharashtra',
    photoCount: 1,
    photos: [
      {
        base64: imageBase64,
        type: 'image/jpeg',
        label: 'front'
      }
    ]
  };

  try {
    const res = await fetch('http://localhost:3000/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Test failed:", err);
  }
}

testAI();
