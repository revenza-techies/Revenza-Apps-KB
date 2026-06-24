const test = require('node:test');
const assert = require('node:assert/strict');
const {validateContactForm, createWeb3FormsPayload} = require('./contactForm');

test('requires name, valid email, subject, and message', () => {
  assert.deepEqual(validateContactForm({name: '', email: 'bad', subject: '', message: ''}), {
    name: 'Enter your name.',
    email: 'Enter a valid email address.',
    subject: 'Choose a subject.',
    message: 'Tell us how we can help.',
  });
});

test('accepts a complete merchant support request', () => {
  assert.deepEqual(validateContactForm({name:'Asha',email:'asha@example.com',subject:'App setup',storeUrl:'https://example.myshopify.com',message:'The app block is not visible.'}), {});
});

test('creates the Web3Forms payload without dropping store context', () => {
  const payload = createWeb3FormsPayload({name:'Asha',email:'asha@example.com',subject:'App setup',storeUrl:'https://example.myshopify.com',message:'The app block is not visible.'}, 'test-key');
  assert.equal(payload.access_key, 'test-key');
  assert.equal(payload.from_name, 'Revenza Help Center');
  assert.equal(payload.store_url, 'https://example.myshopify.com');
});
