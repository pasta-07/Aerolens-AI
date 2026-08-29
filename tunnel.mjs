import { startTunnel } from 'untun';

async function main() {
  console.log('Starting Cloudflare tunnel for port 5173...');
  const tunnel = await startTunnel({ url: 'http://127.0.0.1:5173' });
  const url = await tunnel.getURL();
  console.log('====================================');
  console.log('PUBLIC_CLOUDFLARE_URL:', url);
  console.log('====================================');
}

main().catch(err => {
  console.error('Error starting tunnel:', err);
});
