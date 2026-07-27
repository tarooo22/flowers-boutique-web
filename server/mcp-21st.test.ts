import { describe, it, expect, beforeAll } from 'vitest';

/**
 * Test 21st.dev MCP integration
 * Validates API key and connection to 21st.dev MCP server
 */

const API_KEY = process.env.TWENTYFIRST_API_KEY;
const MCP_URL = 'https://21st.dev/api/mcp';

describe('21st.dev MCP Integration', () => {
  beforeAll(() => {
    if (!API_KEY) {
      throw new Error('TWENTYFIRST_API_KEY environment variable is not set');
    }
  });

  it('should have valid API key format', () => {
    expect(API_KEY).toBeDefined();
    expect(API_KEY).toMatch(/^21st_sk_/);
    expect(API_KEY.length).toBeGreaterThan(20);
  });

  it('should connect to 21st.dev MCP server with valid credentials', async () => {
    const response = await fetch(MCP_URL, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
      }),
    });

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toBeDefined();
    expect(data.result || data.tools).toBeDefined();
  });

  it('should list available tools from 21st.dev', async () => {
    const response = await fetch(MCP_URL, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
      }),
    });

    const data = await response.json();
    console.log('21st.dev MCP Response:', JSON.stringify(data, null, 2));

    // Verify response structure
    expect(data).toBeDefined();
    expect(response.status).toBe(200);
  });

  it('should search for components using 21st.dev MCP', async () => {
    const response = await fetch(MCP_URL, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'search',
          arguments: {
            query: 'premium florist ecommerce product card',
          },
        },
      }),
    });

    const data = await response.json();
    console.log('21st.dev Search Response:', JSON.stringify(data, null, 2));

    expect(response.status).toBe(200);
    expect(data).toBeDefined();
  });
});
