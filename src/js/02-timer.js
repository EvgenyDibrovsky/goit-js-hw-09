import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const el = {
  startBtn: document.querySelector('button[data-start]'),
  timer: document.querySelector('.timer'),
  fields: document.querySelectorAll('.field'),
  values: document.querySelectorAll('.value'),
  labels: document.querySelectorAll('.label'),
};

el.fields.forEach(field => {
  field.style.display = 'flex';
  field.style.flexDirection = 'column';
  field.style.alignItems = 'center';
});

el.timer.style.display = 'flex';
el.timer.style.justifyContent = 'center';
el.timer.style.gap = '25px';

el.values.forEach(value => (value.style.fontSize = '48px'));

el.labels.forEach(label => {
  label.style.fontSize = '18px';
  label.style.textTransform = 'uppercase';
  label.style.color = '#9c9c9c';
});

el.startBtn.disabled = true;
let choosenDate = 0;
let timerId = null;

el.startBtn.addEventListener('click', onStartBtnClick);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (!el.timer.classList.contains('active')) {
      if (Date.now() - selectedDates[0] > 0) {
        Notify.failure('Please choose a date in the future');
        return;
      }
      el.startBtn.disabled = false;
      el.timer.classList.add('active');
      return (choosenDate = selectedDates[0]);
    }
  },
};

flatpickr('#datetime-picker', options);

function onStartBtnClick() {
  timerId = setInterval(timer, 1000);
}

function timer() {
  el.startBtn.disabled = true;
  const time = choosenDate - Date.now();
  if (time <= 0) {
    clearInterval(timerId);
    el.startBtn.disabled = false;
    el.timer.classList.remove('active');
    return;
  }
  const obj = convertMs(time);
  el.values.forEach(
    (value, i) => (value.textContent = addLeadingZero(Object.values(obj)[i]))
  );
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, 0);
}
