#!/usr/bin/env node

import { serve } from "@sphido/dev";
import { build } from "./build.js";

// Rebuilds on every change in content/ and live-reloads the browser
await serve({ watch: ["content"], output: "public", build });
