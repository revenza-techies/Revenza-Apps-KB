const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContactForm(values) {
  const errors = {};

  if (!values.name?.trim()) {
    errors.name = 'Enter your name.';
  }

  if (!EMAIL_PATTERN.test(values.email?.trim() || '')) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.subject?.trim()) {
    errors.subject = 'Choose a subject.';
  }

  if (!values.message?.trim()) {
    errors.message = 'Tell us how we can help.';
  }

  return errors;
}

function createWeb3FormsPayload(values, accessKey) {
  return {
    access_key: accessKey,
    from_name: 'Revenza Help Center',
    subject: `[Revenza Support] ${values.subject}`,
    name: values.name.trim(),
    email: values.email.trim(),
    store_url: values.storeUrl?.trim() || 'Not provided',
    message: values.message.trim(),
    botcheck: '',
  };
}

module.exports = {validateContactForm, createWeb3FormsPayload};
