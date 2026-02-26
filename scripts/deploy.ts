// deploy.ts - A Node.js script to deploy the contents of the ./dist directory to a Home Assistant instance via SCP, with user confirmation if HA token is detected.

// deploy.ts - Script för att ladda upp dashboarden till Home Assistant via SCP
import { Client, type ScpClient } from 'node-scp';
import * as dotenv from 'dotenv';
import { join, relative } from 'path';
import chalk from 'chalk';
import { access, constants, readdir } from 'fs/promises';

dotenv.config();

const HA_URL = process.env.VITE_HA_URL;
const HA_TOKEN = process.env.VITE_HA_TOKEN;
const USERNAME = process.env.VITE_SSH_USERNAME;
const PASSWORD = process.env.VITE_SSH_PASSWORD;
const HOST_OR_IP_ADDRESS = process.env.VITE_SSH_HOSTNAME;
const PORT = 22;
const FOLDER_NAME = process.env.VITE_FOLDER_NAME;
const LOCAL_DIRECTORY = './dist';
const REMOTE_PATH = `/www/${FOLDER_NAME}`;

async function ensureRemoteDir(client: ScpClient, target: string) {
  const segments = target.split('/').filter(Boolean);
  let current = '';
  for (const seg of segments) {
    current += '/' + seg;
    const exists = await client.exists(current).catch(() => false);
    if (!exists) {
      await client.mkdir(current).catch(err => {
        console.error(chalk.red(`Kunde inte skapa mapp: ${current}`), err.message);
      });
    }
  }
}

const uploadDirectoryRecursively = async (
  client: ScpClient,
  localDir: string,
  remoteBase: string
): Promise<{ uploaded: number; failed: number }> => {
  let uploaded = 0;
  let failed = 0;
  const entries = await readdir(localDir, { withFileTypes: true });

  for (const entry of entries) {
    const localPath = join(localDir, entry.name);
    const relPath = relative(LOCAL_DIRECTORY, localPath);
    const remoteTarget = relPath ? `${remoteBase}/${relPath}`.replace(/\\/g, '/') : remoteBase;

    if (entry.isDirectory()) {
      await ensureRemoteDir(client, remoteTarget);
      const sub = await uploadDirectoryRecursively(client, localPath, remoteBase);
      uploaded += sub.uploaded;
      failed += sub.failed;
    } else if (entry.isFile()) {
      try {
        await client.uploadFile(localPath, remoteTarget);
        uploaded++;
      } catch (err) {
        failed++;
        console.error(chalk.red(`Fel vid uppladdning: ${relPath}`));
      }
    }
  }
  return { uploaded, failed };
};

async function deploy() {
  try {
    // Validering av miljövariabler
    const missing = [];
    if (!HA_URL) missing.push('VITE_HA_URL');
    if (!FOLDER_NAME) missing.push('VITE_FOLDER_NAME');
    if (!USERNAME) missing.push('VITE_SSH_USERNAME');
    if (!PASSWORD) missing.push('VITE_SSH_PASSWORD');
    if (!HOST_OR_IP_ADDRESS) missing.push('VITE_SSH_HOSTNAME');

    if (missing.length > 0) {
      throw new Error(`Saknar variabler i .env: ${missing.join(', ')}`);
    }

    try {
      await access(LOCAL_DIRECTORY, constants.F_OK);
    } catch {
      throw new Error('Hittar ingen ./dist-mapp. Kör "npm run build" först.');
    }

    console.log(chalk.blue(`🚀 Ansluter till ${HOST_OR_IP_ADDRESS}...`));

    const client = await Client({
      host: HOST_OR_IP_ADDRESS,
      port: PORT,
      username: USERNAME,
      password: PASSWORD,
    });

    // Home Assistant kan ha config-mappen döpt till 'config' eller 'homeassistant'
    const potentialRoots = ['config', 'homeassistant'];
    let success = false;

    for (const root of potentialRoots) {
      const remoteBase = `/${root}${REMOTE_PATH}`;

      // Vi kollar om mappen finns genom att prova att gå in i den
      const rootExists = await client.exists(`/${root}`).catch(() => false);
      if (!rootExists) continue;

      console.info(chalk.gray(`Rensar gammal deployment i ${remoteBase}...`));
      await client.rmdir(remoteBase).catch(() => {}); // Ignorerar fel om mappen inte finns

      await ensureRemoteDir(client, remoteBase);

      console.info(chalk.cyan(`Laddar upp filer till ${remoteBase}...`));
      const { uploaded, failed } = await uploadDirectoryRecursively(client, LOCAL_DIRECTORY, remoteBase);

      if (failed === 0 && uploaded > 0) {
        success = true;
        console.info(chalk.green(`\n✅ Deployment klar! ${uploaded} filer uppladdade.`));

        const finalUrl = `${HA_URL}/local/${FOLDER_NAME}/index.html`;
        console.info(chalk.blue('\nDin dashboard finns nu här:'));
        console.info(chalk.bgBlue.white.bold(` ${finalUrl} `));
        console.info(chalk.gray('\nGlöm inte att lägga till den som en "Webpage Card" eller i sidomenyn!\n'));
      }
      break;
    }

    client.close();
    if (!success) throw new Error('Kunde inte hitta en giltig sökväg på servern.');
  } catch (e: any) {
    console.error(chalk.red(`\n❌ Deployment misslyckades: ${e.message}`));
    process.exit(1);
  }
}

// Kör scriptet
deploy();
