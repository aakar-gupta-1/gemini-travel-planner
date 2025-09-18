// File: app/api/recommend/route.js

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

// This function handles POST requests to the /api/recommend endpoint
export async function POST(req) {
  // 1. Initialize the Google Generative AI client with the API key
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    // 2. Get user preferences from the request body
    const { destination, budget, interests } = await req.json();

    // 3. Craft a detailed prompt for the Gemini model
    const prompt = `
      Create a personalized travel itinerary. I want to go to a place that is known for being a "${destination}".
      My budget is "${budget}".
      My main interests are "${interests}".

      Please provide a suggested destination and a 3-day itinerary.
      Format the response clearly with headings for each day.
      Include suggestions for activities, food, and accommodation.
      Be creative and inspiring.
    `;

    // 4. Call the Gemini API to generate content
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. Return the generated text as a JSON response
    return NextResponse.json({ recommendation: text });

  } catch (error) {
    console.error("Error in Gemini API call:", error);
    // 6. Handle errors and return an appropriate error response
    return NextResponse.json({ error: "Failed to generate recommendation." }, { status: 500 });
  }
}