import { OmniForgeClient } from '@omniforge/sdk';

async function main() {
  console.log('--- OmniForge SDK Demo ---');
  const client = new OmniForgeClient({ serverUrl: 'http://localhost:8080' });

  const health = await client.getHealth();
  console.log('Server Health:', health);

  const skills = await client.listSkills();
  console.log('Available Skills:', skills.map(s => s.name).join(', '));

  const result = await client.runWorkflow('engineering-workflow', { target: 'auth-service' });
  console.log('Workflow Output:', result);
}

main().catch(console.error);
