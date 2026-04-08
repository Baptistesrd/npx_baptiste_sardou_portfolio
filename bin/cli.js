#!/usr/bin/env node
import chalk from 'chalk';
import inquirer from 'inquirer';
import { execSync } from 'child_process';

const PROJECTS = [
  {
    name: 'switchpayglobal.com',
    desc: 'Payment orchestration sandbox — routes transactions to the most cost-efficient PSP across Stripe, Adyen, Airwallex, Rapyd & Wise.',
    links: [
      { label: 'Live site', url: 'https://switchpayglobal.com' },
      { label: 'Frontend repo', url: 'https://github.com/Baptistesrd/switchpay-frontend' },
      { label: 'Backend repo', url: 'https://github.com/Baptistesrd/switchpay-backend' },
    ],
  },
  {
    name: 'flexipay',
    desc: 'Pluggable BNPL widget for marketplaces. Drop-in buy-now-pay-later in two installments — zero friction.',
    links: [
      { label: 'Repo', url: 'https://github.com/Baptistesrd/flexipay' },
    ],
  },
  {
    name: 'filmy',
    desc: 'AI bot that tailors film picks to your watch history, watchlist & mood. Not just genre tags.',
    links: [
      { label: 'Repo', url: 'https://github.com/Baptistesrd/Filmy' },
    ],
  },
  {
    name: 'gamebrief',
    desc: 'Your favorite games, all the latest news, one place. No more tab hopping.',
    links: [
      { label: 'Live site', url: 'https://gamebrief.live' },
      { label: 'Repo', url: 'https://github.com/edhoblyn/GameBrief' },
    ],
  },
];

function openUrl(url) {
  try {
    const platform = process.platform;
    if (platform === 'darwin') execSync(`open "${url}"`);
    else if (platform === 'win32') execSync(`start "${url}"`);
    else execSync(`xdg-open "${url}"`);
  } catch {
    console.log(chalk.dim(`  → ${url}`));
  }
}

function header() {
  console.clear();
  console.log('');
  console.log(chalk.dim('  $ ') + chalk.bold.white('baptiste_sardou_portfolio'));
  console.log('');
  console.log(chalk.dim('  ') + chalk.hex('#1D9E75')('Baptiste Sardou') + chalk.dim(' · fullstack dev · building in public'));
  console.log(chalk.dim('  ') + chalk.blue('github.com/Baptistesrd'));
  console.log('');
  console.log(chalk.dim('  ─────────────────────────────────────'));
  console.log('');
}

async function showProject(project) {
  console.clear();
  header();
  console.log(chalk.bold.white('  ' + project.name));
  console.log('');
  console.log(chalk.dim('  ') + chalk.white(project.desc));
  console.log('');

  const linkChoices = project.links.map(l => ({
    name: chalk.dim('  → ') + chalk.cyan(l.label) + chalk.dim('  ' + l.url),
    value: l.url,
  }));

  linkChoices.push({ name: chalk.dim('  ← back'), value: '__back__' });

  const { action } = await inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: chalk.dim('open link'),
    choices: linkChoices,
    loop: false,
  }]);

  if (action !== '__back__') {
    openUrl(action);
    await showProject(project);
  }
}

async function main() {
  header();

  const projectChoices = PROJECTS.map((p, i) => ({
    name: chalk.dim(`  ${i + 1}. `) + chalk.white(p.name),
    value: p,
  }));

  projectChoices.push(new inquirer.Separator());
  projectChoices.push({ name: chalk.dim('  quit'), value: '__quit__' });

  const { selected } = await inquirer.prompt([{
    type: 'list',
    name: 'selected',
    message: chalk.dim('· projects'),
    choices: projectChoices,
    loop: false,
    pageSize: 10,
  }]);

  if (selected === '__quit__') {
    console.log('');
    console.log(chalk.dim('  build in public · open to collabs'));
    console.log('');
    process.exit(0);
  }

  await showProject(selected);
  await main();
}

main().catch(err => {
  if (err.name !== 'ExitPromptError') console.error(err);
  process.exit(0);
});
