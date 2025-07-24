import axios from 'axios';
import cron from 'node-cron';

const APP_URL = process.env.NEXTAUTH_URL || 'https://tfi-fe-sanchezpalomino.onrender.com';

async function pingHealthCheck() {
  try {
    const response = await axios.get(`${APP_URL}/api/health`);
    console.log(`✅ Health check successful: ${new Date().toISOString()} - Status: ${response.data.status}`);
  } catch (error) {
    console.error(`❌ Health check failed: ${new Date().toISOString()}`, error);
  }
}

// Ejecutar cada 5 minutos
cron.schedule('*/5 * * * *', () => {
  pingHealthCheck();
});

console.log('🚀 Keep-alive script started. Pinging every 5 minutes...');

// Ejecutar inmediatamente al iniciar
pingHealthCheck(); 