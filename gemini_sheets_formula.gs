// Cache for rate limiting
const CACHE_KEY = "GEMINI_API_CALLS";
const MAX_REQUESTS_PER_MINUTE = 15;
const API_KEY = "ENTER-API-KEY-HERE";

/**
 * Custom function to interact with Gemini API
 * @param {string} prompt - The main prompt to send to Gemini
 * @param {...string} data - Additional data to include in the prompt
 * @return {string} The generated response
 * @customfunction
 */
function GOOGLE_GEMINI(prompt, ...data) {
  // Check rate limit
  if (isRateLimited()) {
    return "Rate limit exceeded. Please wait a minute before trying again.";
  }

  try {
    // Combine prompt with additional data
    const fullPrompt = [prompt, ...data].filter(Boolean).join("\n");

    // Prepare the request payload
    const payload = {
      contents: [{
        parts: [{
          text: fullPrompt
        }]
      }]
    };

    // Make the API request
    const response = makeGeminiRequest(payload);
    
    // Update rate limit tracking
    updateRateLimit();

    return response;
  } catch (error) {
    return `Error: ${error.toString()}`;
  }
}

/**
 * Make the actual API request to Gemini
 * @param {Object} payload - The request payload
 * @return {string} The generated response
 */
function makeGeminiRequest(payload) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();

  if (responseCode !== 200) {
    throw new Error(`API request failed with status ${responseCode}: ${response.getContentText()}`);
  }

  const result = JSON.parse(response.getContentText());
  
  // Extract the text from the response
  if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts) {
    return result.candidates[0].content.parts[0].text;
  }
  
  throw new Error('Invalid response format from API');
}

/**
 * Check if we've hit the rate limit
 * @return {boolean} True if rate limited, false otherwise
 */
function isRateLimited() {
  const cache = CacheService.getScriptCache();
  const calls = cache.get(CACHE_KEY);
  
  if (!calls) {
    return false;
  }

  const callData = JSON.parse(calls);
  const now = new Date().getTime();
  
  // Remove calls older than 1 minute
  const recentCalls = callData.filter(timestamp => now - timestamp < 60000);
  
  return recentCalls.length >= MAX_REQUESTS_PER_MINUTE;
}

/**
 * Update the rate limit tracking
 */
function updateRateLimit() {
  const cache = CacheService.getScriptCache();
  const calls = cache.get(CACHE_KEY);
  const now = new Date().getTime();
  
  let callData = calls ? JSON.parse(calls) : [];
  
  // Remove calls older than 1 minute
  callData = callData.filter(timestamp => now - timestamp < 60000);
  
  // Add current call
  callData.push(now);
  
  // Store updated call data
  cache.put(CACHE_KEY, JSON.stringify(callData), 60); // Cache for 1 minute
}

/**
 * Test the Gemini function
 */
function testGeminiFunction() {
  const result = GOOGLE_GEMINI("What is artificial intelligence?", "Please keep it brief.");
  Logger.log(result);
}
