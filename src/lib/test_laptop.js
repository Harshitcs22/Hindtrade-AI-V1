async function test() {
  try {
    const response = await fetch('https://hindtrade-ai-gri-engine.vercel.app/api/hsn-audit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      },
      body: JSON.stringify({ product_description: 'cotton t-shirt' })
    });
    
    const data = await response.json();
    console.log("LAPTOP RESPONSE:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}

test();
