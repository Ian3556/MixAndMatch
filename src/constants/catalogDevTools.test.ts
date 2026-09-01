import { describe, expect, it } from 'vitest';

import { resolveCatalogDevToolsEnabled } from './catalogDevTools';

describe('catalogue developer tool gate', () => {
  it('requires both a development build and the explicit environment flag', () => {
    expect(resolveCatalogDevToolsEnabled(true, 'true')).toBe(true);
    expect(resolveCatalogDevToolsEnabled(true, ' TRUE ')).toBe(true);
    expect(resolveCatalogDevToolsEnabled(true, undefined)).toBe(false);
    expect(resolveCatalogDevToolsEnabled(false, 'true')).toBe(false);
  });
});
