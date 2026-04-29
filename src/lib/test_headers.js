async function test() {
  try {
    const response = await fetch('https://hindtrade-ai-gri-engine.vercel.app/api/hsn-audit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      },
      body: JSON.stringify({ product_description: '100% Cotton Knitted T-Shirt for Men' })
    });
    
    console.log("Status:", response.status);
    console.log("Headers:");
    for (const [key, value] of response.headers.entries()) {
      console.log(`  ${key}: ${value}`);
    }
  } catch (err) {
    console.error(err);
  }
}

test();
