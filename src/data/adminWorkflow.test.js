const test = require('node:test');
const assert = require('node:assert/strict');
const {adminWorkflow} = require('./adminWorkflow');

test('admin workflow uses GitHub authentication without collecting credentials', () => {
  assert.equal(adminWorkflow.title, 'Admin publishing workflow');
  assert.equal(adminWorkflow.repositoryUrl.startsWith('https://github.com/revenza-techies/Revenza-Apps-KB'), true);
  assert.equal(adminWorkflow.securityNotes.some((note) => /do not collect github passwords/i.test(note)), true);
  assert.equal(adminWorkflow.securityNotes.some((note) => /never commit secrets/i.test(note)), true);
});

test('admin workflow includes image upload steps for help articles', () => {
  assert.equal(adminWorkflow.imageUploadPath, 'images/');
  assert.equal(adminWorkflow.imageSteps.some((step) => step.includes('images/')), true);
  assert.equal(adminWorkflow.imageSteps.some((step) => step.includes('/img/content/')), true);
});

