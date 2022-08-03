import * as yup from 'yup';
import watched from './view';

export default () => {
  const state = {
    links: [],
    form: {
      validateState: 'valid', // could be valid, invalid, duplicate
      process: 'filling', // could be filling, failed, processed, successful
      processError: null,
      error: '',
      url: '',
    },
  };
  const watchedState = watched(state);
  const schema = yup.object().shape({
    website: yup.string().url(),
  });
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('url');
    schema.validate({ website: value }).then(() => {
      if (!watchedState.links.includes(value)) {
        watchedState.links.unshift(value);
        watchedState.from.valdationState = 'valid';
      } else {
        watchedState.form.valdationState = 'duplicate';
        watchedState.form.error = 'RSS уже существует';
        watchedState.form.process = 'failed';
      }
    }).catch(() => {
      watchedState.form.valdationState = 'invalid';
      watchedState.form.error = 'Ссылка должна быть валидным URL';
      watchedState.form.process = 'failed';
    });
    form.reset();
    document.getElementById('url-input').focus();
  });
};
