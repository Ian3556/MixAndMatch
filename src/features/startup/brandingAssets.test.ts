import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { DOUBLE_M_PATHS } from '@/components/branding/doubleMGeometry';

const projectRoot = resolve(process.cwd());
const appConfig = JSON.parse(readFileSync(resolve(projectRoot, 'app.json'), 'utf8')) as {
  expo: {
    android: {
      adaptiveIcon: {
        backgroundColor: string;
        foregroundImage: string;
        monochromeImage: string;
      };
      icon: string;
    };
    icon: string;
    ios: { icon: string };
    plugins: [string, { backgroundColor: string; image: string; imageWidth: number }][];
    web: { favicon: string };
  };
};

describe('Double M branding assets', () => {
  it('keeps every configured branding asset present and square', () => {
    const paths = [
      appConfig.expo.icon,
      appConfig.expo.ios.icon,
      appConfig.expo.android.icon,
      appConfig.expo.android.adaptiveIcon.foregroundImage,
      appConfig.expo.android.adaptiveIcon.monochromeImage,
      appConfig.expo.web.favicon,
      appConfig.expo.plugins[0]?.[1].image,
    ];

    for (const assetPath of new Set(paths)) {
      expect(assetPath).toBeTruthy();
      const absolutePath = resolve(projectRoot, assetPath ?? '');
      expect(existsSync(absolutePath), absolutePath).toBe(true);

      if (absolutePath.endsWith('.png')) {
        const png = readFileSync(absolutePath);
        expect(png.toString('ascii', 1, 4)).toBe('PNG');
        expect(png.readUInt32BE(16)).toBe(png.readUInt32BE(20));
      }
    }
  });

  it('uses a black native and adaptive-icon background', () => {
    expect(appConfig.expo.android.adaptiveIcon.backgroundColor).toBe('#000000');
    expect(appConfig.expo.plugins[0]?.[1]).toMatchObject({
      backgroundColor: '#000000',
      imageWidth: 168,
    });
  });

  it('keeps the runtime geometry synchronized with the vector master', () => {
    const svg = readFileSync(resolve(projectRoot, 'assets/branding/double-m.svg'), 'utf8');

    for (const path of DOUBLE_M_PATHS) {
      expect(svg).toContain(`d="${path}"`);
    }
  });
});
