import React, {useState} from 'react';
import {
  CheckCircle,
  PaperPlaneTilt,
  WarningCircle,
} from '@phosphor-icons/react';
import contactFormUtils from '../../utils/contactForm';
import styles from './styles.module.css';

const {createWeb3FormsPayload, validateContactForm} = contactFormUtils;
function resolveWeb3FormsAccessKey() {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY || import.meta.env.WEB3FORMS_ACCESS_KEY || '';
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env.PUBLIC_WEB3FORMS_ACCESS_KEY || process.env.WEB3FORMS_ACCESS_KEY || '';
  }
  return '';
}

const initialValues = {
  name: '',
  email: '',
  storeUrl: '',
  subject: '',
  message: '',
  botcheck: '',
};

const fields = [
  {name: 'name', label: 'Your name', type: 'text', autoComplete: 'name', required: true},
  {name: 'email', label: 'Email address', type: 'email', autoComplete: 'email', required: true},
  {name: 'storeUrl', label: 'Shopify store URL', type: 'url', autoComplete: 'url'},
];

export default function ContactForm() {
  const accessKey = resolveWeb3FormsAccessKey();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');

  function updateValue(event) {
    const {name, value} = event.target;
    setValues((current) => ({...current, [name]: value}));
    if (errors[name]) {
      setErrors((current) => ({...current, [name]: undefined}));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateContactForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      setStatus('error');
      setStatusMessage('Check the highlighted fields and try again.');
      return;
    }

    if (!accessKey) {
      setStatus('error');
      setStatusMessage(
        'The contact form is not configured yet. Please email support@revenza.in.',
      );
      return;
    }

    setStatus('submitting');
    setStatusMessage('');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify(createWeb3FormsPayload(values, accessKey)),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message);
      }

      setValues(initialValues);
      setErrors({});
      setStatus('success');
      setStatusMessage('Thanks. Your message has been sent to the Revenza team.');
    } catch {
      setStatus('error');
      setStatusMessage(
        'We could not send your message. Please try again or email support@revenza.in.',
      );
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.heading}>
        <span>Contact form</span>
        <h2>Send us a message</h2>
        <p>Required fields are marked with an asterisk.</p>
      </div>

      <div className={styles.fieldGrid}>
        {fields.map((field) => {
          const errorId = `${field.name}-error`;
          return (
            <div className={styles.field} key={field.name}>
              <label htmlFor={field.name}>
                {field.label} {field.required && <span aria-hidden="true">*</span>}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={values[field.name]}
                onChange={updateValue}
                autoComplete={field.autoComplete}
                required={field.required}
                aria-invalid={Boolean(errors[field.name])}
                aria-describedby={errors[field.name] ? errorId : undefined}
                placeholder={field.name === 'storeUrl' ? 'your-store.myshopify.com' : ''}
              />
              {errors[field.name] && (
                <span className={styles.error} id={errorId}>
                  <WarningCircle size={16} weight="fill" aria-hidden="true" />
                  {errors[field.name]}
                </span>
              )}
            </div>
          );
        })}

        <div className={styles.field}>
          <label htmlFor="subject">
            What do you need help with? <span aria-hidden="true">*</span>
          </label>
          <select
            id="subject"
            name="subject"
            value={values.subject}
            onChange={updateValue}
            required
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? 'subject-error' : undefined}>
            <option value="">Choose a subject</option>
            <option value="App setup">App setup</option>
            <option value="Offer display">Offer display</option>
            <option value="Theme compatibility">Theme compatibility</option>
            <option value="Billing or account">Billing or account</option>
            <option value="Feature question">Feature question</option>
            <option value="Other">Other</option>
          </select>
          {errors.subject && (
            <span className={styles.error} id="subject-error">
              <WarningCircle size={16} weight="fill" aria-hidden="true" />
              {errors.subject}
            </span>
          )}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="message">
          How can we help? <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={values.message}
          onChange={updateValue}
          required
          rows={7}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'message-error' : 'message-hint'}
          placeholder="Describe what you expected, what happened, and any troubleshooting you already tried."
        />
        <span className={styles.hint} id="message-hint">
          Do not include passwords, access tokens, or customer data.
        </span>
        {errors.message && (
          <span className={styles.error} id="message-error">
            <WarningCircle size={16} weight="fill" aria-hidden="true" />
            {errors.message}
          </span>
        )}
      </div>

      <div className={styles.botcheck} aria-hidden="true">
        <label htmlFor="botcheck">Leave this field empty</label>
        <input
          id="botcheck"
          name="botcheck"
          value={values.botcheck}
          onChange={updateValue}
          tabIndex="-1"
          autoComplete="off"
        />
      </div>

      <button className={styles.submit} type="submit" disabled={status === 'submitting'}>
        <PaperPlaneTilt size={20} weight="bold" aria-hidden="true" />
        {status === 'submitting' ? 'Sending...' : 'Send message'}
      </button>

      <div
        className={`${styles.status} ${status !== 'idle' ? styles[status] : ''}`}
        role="status"
        aria-live="polite">
        {status === 'success' && <CheckCircle size={20} weight="fill" />}
        {status === 'error' && <WarningCircle size={20} weight="fill" />}
        {statusMessage}
      </div>
    </form>
  );
}
