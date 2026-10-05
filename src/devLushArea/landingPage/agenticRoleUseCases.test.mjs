import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getAgenticRoleUseCase } from './agenticRoleUseCases.ts';

// Derive coverage from the authoritative registry so newly added roles are checked.
const registry = readFileSync(new URL('../agenticRoles/data/index.ts', import.meta.url), 'utf8');
const domains = [...registry.matchAll(/roleDomain:\s*'([^']+)'/g)].map((match) => match[1]);

test('every registered role has specific situation, decision, and evidence copy', () => {
  assert.ok(domains.length >= 10);
  for (const roleDomain of domains) {
    const useCase = getAgenticRoleUseCase({ roleDomain, description: 'Fallback description' });
    for (const field of ['situation', 'decision', 'evidence']) {
      assert.equal(typeof useCase[field], 'string', `${roleDomain}.${field}`);
      assert.ok(useCase[field].trim().length > 0, `${roleDomain}.${field}`);
    }
    assert.notEqual(useCase.situation, 'Fallback description', `${roleDomain} needs dedicated copy`);
  }
});

test('an unrecognized runtime role uses safe copy instead of crashing', () => {
  const useCase = getAgenticRoleUseCase({ roleDomain: 'future-role', description: 'A new applied-learning role.' });
  assert.equal(useCase.situation, 'A new applied-learning role.');
  assert.ok(useCase.decision && useCase.evidence);
});
