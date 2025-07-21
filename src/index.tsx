#!/usr/bin/env node

import React from 'react';
import { render } from 'ink';
import { App } from './components/App.js';
import { parseCliArgs } from './utils/config.js';

const config = parseCliArgs();

render(<App config={config} />);