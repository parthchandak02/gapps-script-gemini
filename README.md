# Google Sheets Gemini API Integration

A custom Google Apps Script formula that integrates Google's Gemini API into Google Sheets, allowing you to leverage Gemini's AI capabilities directly from your spreadsheets.

## Features

- Custom formula `GOOGLE_GEMINI()` for easy integration
- Rate limiting (15 requests per minute)
- Error handling and user-friendly messages
- Support for multiple input parameters

## Setup

1. Open your Google Sheet
2. Go to Extensions > Apps Script
3. Copy the contents of `gemini_sheets_formula.gs` into the script editor
4. Replace `ENTER-API-KEY-HERE` with your Gemini API key
5. Save and close the script editor

## Usage

```javascript
// Basic usage with single prompt
=GOOGLE_GEMINI("What is artificial intelligence?")

// Usage with additional context
=GOOGLE_GEMINI("Summarize this text:", A1, B1)

// Multiple parameters
=GOOGLE_GEMINI("Compare these items:", A1, B1, C1)
```

## Rate Limiting

The script includes built-in rate limiting:
- Maximum 15 requests per minute
- Automatic tracking of API calls
- User-friendly messages when limit is reached

## Error Handling

The script handles various error cases:
- Rate limit exceeded
- API errors
- Invalid responses
- Network issues

## Security Notes

- Never commit your API key to version control
- Consider using Script Properties to store sensitive data
- Review Google's security best practices for Apps Script

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT License - see LICENSE file for details
