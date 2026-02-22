# MockLab

Mock APIs instantly. Test smarter.

MockLab is a free, open-source tool that generates live mock API endpoints and AI-powered test cases from your API schemas. No setup required—paste your schema and start testing immediately.

## Features

- **Instant Mock Endpoints** - Generate working API endpoints from your schema in seconds
- **AI-Generated Test Cases** - Automatically create comprehensive test cases for your APIs
- **Live Preview** - Test endpoints before integrating them into your application
- **Easy to Use** - Simple, intuitive interface with no complex configuration

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI**: Groq API (LLaMA 3.3-70B)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Groq API key (get one at [console.groq.com](https://console.groq.com))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mocklab
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
echo "GROQ_API_KEY=your_api_key_here" > .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Navigate to the dashboard at `/dashboard`
2. Paste your API schema (OpenAPI, JSON, or plain text format)
3. Click "Generate" to create mock endpoints
4. Copy the generated endpoints and test cases for your project

## API Endpoint

**POST** `/api/generate`

Request body:
```json
{
  "schema": "your-api-schema-here"
}
```

Response:
```json
{
  "endpoints": [
    {
      "method": "GET",
      "path": "/resource",
      "description": "Description of endpoint",
      "mockResponse": { "key": "value" }
    }
  ]
}
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT
