import { spawn } from 'child_process';
import path from 'path';

// Simple JSON-RPC 2.0 Types
interface JsonRpcRequest {
  jsonrpc: "2.0";
  id: number;
  method: string;
  params?: any;
}

interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: number;
  result?: any;
  error?: any;
}

const serverPath = path.resolve('dist/index.js');
const child = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'inherit']
});

let buffer = '';

child.stdout.on('data', (data: Buffer) => {
  const str = data.toString();
  buffer += str;
  
  const lines = buffer.split('\n');
  buffer = lines.pop() || ''; 
  
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const msg = JSON.parse(line);
      handleMessage(msg);
    } catch (e) {
      // console.error("Failed to parse JSON line:", line);
    }
  }
});

function send(msg: JsonRpcRequest) {
  const str = JSON.stringify(msg) + '\n';
  child.stdin.write(str);
}

function handleMessage(msg: JsonRpcResponse) {
  if (msg.id === 1) {
    console.log("1. Initialized");
    send({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list"
    });
  } else if (msg.id === 2) {
    console.log("2. Tools listed:", msg.result.tools.map((t: any) => t.name));
    send({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "babylon_create_entity",
        arguments: {
          name: "TestBox",
          type: "Box",
          position: { x: 10, y: 20, z: 30 }
        }
      }
    });
  } else if (msg.id === 3) {
    console.log("3. Tool result:", JSON.stringify(msg.result, null, 2));
    process.exit(0);
  }
}

// Start sequence
send({
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "tester", version: "1.0" }
  }
});
