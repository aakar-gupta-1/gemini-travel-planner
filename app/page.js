// File: app/page.js

"use client"; // This directive indicates that this is a client-side component

import { useState } from 'react';
import styles from './Home.module.css';

export default function Home() {
  // State variables to store user inputs
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [interests, setInterests] = useState('');

  // State variables for API response and loading status
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the form from reloading the page
    setLoading(true);
    setRecommendation(''); // Clear previous recommendation

    try {
      // Send the user's preferences to our backend API route
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ destination, budget, interests }),
      });

      const data = await response.json();

      if (response.ok) {
        setRecommendation(data.recommendation);
      } else {
        throw new Error(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error("Failed to get recommendation:", error);
      setRecommendation(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>AI Travel Planner ✈️</h1>
        <p className={styles.description}>
          Tell us your travel dreams, and we'll craft the perfect itinerary!
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Where to? (e.g., Beach, Mountains, City)"
            className={styles.input}
            required
          />
          <input
            type="text"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="What&apos;s your budget? (e.g., Budget-friendly, Moderate, Luxury)" // This is the corrected line
            className={styles.input}
            required
          />
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="What are your interests? (e.g., Hiking, Food, History)"
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Generating...' : 'Get Recommendation'}
          </button>
        </form>

        {recommendation && (
          <div className={styles.recommendation}>
            <h2 className={styles.recommendationTitle}>Your Personalised Itinerary:</h2>
            {/* Use pre-wrap to respect newlines and formatting from the AI */}
            <p className={styles.recommendationText}>{recommendation}</p>
          </div>
        )}
      </div>
    </main>
  );
}