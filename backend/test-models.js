const { GoogleGenerativeAI } = require('@google/generative-ai');
const ai = new GoogleGenerativeAI('AIzaSyB4Mmh8ylR4mw5_LcgjwMp7Cvi8nacI-0k');

async function test(modelName) {
  try {
    const model = ai.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Hello");
    console.log(modelName + " SUCCESS:", result.response.text());
  } catch (e) {
    console.log(modelName + " ERROR:", e.message);
  }
}

async function run() {
  await test('gemini-2.0-flash');
  await test('gemini-2.5-flash');
  await test('gemini-3.0-flash');
}
run();
