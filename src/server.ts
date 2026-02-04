import app from "./app.js";
import os from 'os';

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 8000;
    
    // Simple function to get IP
    const getLocalIp = () => {
      const interfaces = os.networkInterfaces();
      for (const iface of Object.values(interfaces)) {
        if (!iface) continue;
        for (const alias of iface) {
          if (alias.family === 'IPv4' && !alias.internal) {
            return alias.address;
          }
        }
      }
      return '192.168.1.7'; // Fallback
    };
    
    const localIp = getLocalIp();
    
    await app.listen({ 
      port: port,
      host: '0.0.0.0'
    });
    
    console.log(`✅ Server running on port ${port}`);
    console.log(`📱 Use this IP on your phone: http://${localIp}:${port}`);
    console.log(`💻 Local: http://localhost:${port}`);
    
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();