#! /usr/bin/env node
import { program } from 'commander';
import chalk from 'chalk';
import Conf from 'conf';
import axios from 'axios';
import wrapAnsi from 'wrap-ansi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';

// ═══════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════

const config = new Conf({ projectName: 'dot-cli' });
const API_URL = 'https://api.hidot.social';

dayjs.extend(relativeTime);

// ═══════════════════════════════════════════════════════════════
// CLI Setup
// ═══════════════════════════════════════════════════════════════

program
  .name('dot')
  .description('Official Dot CLI to post and discover what\'s around you')
  .version('2026.01.30');

// ═══════════════════════════════════════════════════════════════
// Commands
// ═══════════════════════════════════════════════════════════════

// 🔑 Setup API Key
program
  .command('setup <key>')
  .description('Save your Dot API Key')
  .action((key) => {
    config.set('apiKey', key);
    console.log(chalk.green('✔ API Key saved successfully. Enjoy Dot!'));
  });

// 📍 Near - See nearby posts
program
  .command('near')
  .description('See posts near you (detects your location via IP)')
  .action(async (options) => {
    try {
      const apiKey = config.get('apiKey');
      const termWidth = process.stdout.columns || 80;
      const contentWidth = Math.min(termWidth - 4, 100);
      if (!apiKey) {
        console.log(chalk.red('\n  ✖ API Key not configured\n'));
        console.log(chalk.dim('  Run: ') + chalk.cyan('dot setup <your-api-key>\n'));
        return;
      }
      // Detect location    
      process.stdout.write(chalk.dim('  🔍 Detecting location...'));
      const { data: geo } = await axios.get('https://ipwho.is/');
      if (!geo.success) {
        throw new Error('Could not detect your location');
      }
      const { latitude, longitude, city, country } = geo;
      process.stdout.write(chalk.green(' ✔\n'));
      // Fetch posts
      process.stdout.write(chalk.dim('  📡 Fetching nearby posts...'));
      const { data } = await axios.get(`${API_URL}/search/nearby`, {
        params: { 
          latitude, 
          longitude,
          radius: options.radius,
          limit: options.limit
        },
        headers: { 
          'X-User-Api-Key': apiKey
        }
      });
      process.stdout.write(chalk.green(' ✔\n'));
      // Header
      console.log('\n' + chalk.cyan('═'.repeat(contentWidth)));
      console.log(chalk.cyan.bold(`  📍 ${city}, ${country}`));
      console.log(chalk.dim(`     ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`));
      console.log(chalk.cyan('═'.repeat(contentWidth)));
      // Posts
      if (data.posts.length === 0) {
        console.log(chalk.yellow('\n  🌵 No recent posts in this area.\n'));
        console.log(chalk.dim('  Be the first! Use: ') + chalk.cyan('dot post "your message"\n'));
      } else {
        console.log(chalk.dim(`\n  Showing ${data.posts.length} posts:\n`));
        data.posts.forEach((post, index) => {
          const { username, display_name } = post.user;
          const author = display_name 
            ? `${display_name} ${chalk.dim(`@${username}`)}`
            : chalk.dim(`@${username}`);
          const date = post.createdAt;
          // Wrap post text
          const indentedText = wrapAnsi(post.text, contentWidth - 2, { hard: true })
            .split('\n')
            .map(line => '  ' + line)
            .join('\n');
          console.log(chalk.white(indentedText));
          console.log(`  ${chalk.yellow(author)}`);
          console.log(`  ${dayjs(date).fromNow()}`);
          
          if (index < data.posts.length - 1) {
            console.log(chalk.dim("\n"));
          }
        });
        console.log('\n' + chalk.cyan('═'.repeat(contentWidth)) + '\n');
      }
    } catch (error) {
      console.log();
      const message = error.response?.data?.message || error.message || 'Unknown error';
      console.log(chalk.red(`\n  ✖ ${message}\n`));
    }
  });

// ═══════════════════════════════════════════════════════════════
// Run
// ═══════════════════════════════════════════════════════════════

program.parse();