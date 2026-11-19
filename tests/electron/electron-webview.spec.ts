/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { expect, electronTest as test } from './electronTest';

test('should not keep the swapped-out placeholder frame of a webview', async ({ launchElectronApp }) => {
  const app = await launchElectronApp('electron-webview-app.js');
  const window = await app.firstWindow();
  await window.locator('webview').waitFor();

  // The webview content moves to a separate guest page. The placeholder iframe that Chromium
  // detached with reason "swap" must not stay in the frame tree without an execution context.
  await expect.poll(() => window.frames().length).toBe(1);

  const snapshot = await window.locator('body').ariaSnapshot({ mode: 'ai', timeout: 5000 });
  expect(snapshot).toContain('heading "host"');
});
