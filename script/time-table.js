import {timeTable, saveInStorage, getDayData, removeSubjectTimeTable, startEndDate, saveStartDate, saveEndDate} from '../data/time-table.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

renderTimeTable();

// display of dates at opening og page
document.querySelector('.display-start-day')
  .innerHTML = dayjs(startEndDate.startDate).format('dddd MMM DD');

document.querySelector('.display-end-day')
  .innerHTML = dayjs(startEndDate.endDate).format('dddd MMM DD');

// event listener for nav button
document.querySelectorAll('.nav-button')
  .forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelector('.side-panel').classList.toggle('active');
    });
  });

// render whole time table html 
function renderTimeTable() {
  let timeTableHTML = '';

  timeTable.forEach((data) => {
    const day = data.day

    timeTableHTML += `
      <div class="${day}-box time-table-box">
        <span class="day-span">${day}</span>

        <div class="subject-input-box">
          <input type="text" placeholder="Subject Name" class="subject-input subject-input-${day}" data-day="${day}">
          <button class="subject-button-add subject-button" data-day="${day}">Add</button>
        </div>

        <div class="subject-display-box">${renderAddedSubjects(data)}</div>
        
      </div>
    `;
  });

  document.querySelector('.main-box-2').innerHTML = timeTableHTML;

  // render all the subjects html at particular day
  function renderAddedSubjects(data) {
    let subjectHTML = '';

    data.subjects.forEach((subject) => {
      subjectHTML += `
        <div class="subject-display">
            <span class="subject-name">${subject}</span>
            <button class="subject-button-remove subject-button" data-day="${data.day}" data-subject-name="${subject}">Delete</button>
        </div>
      `;
    });

    return subjectHTML;
  }

  // event listeners for Add button
  document.querySelectorAll('.subject-button-add')
    .forEach((button) => {
      button.addEventListener('click', () => {
        let day = button.dataset.day;
        let input = document.querySelector(`.subject-input-${day}`);
        let inputValue = input.value;

        (inputValue !== '') ? addSubject(day, inputValue) : alert('Please enter a Subject Name!');
        input.value = '';
        saveInStorage();
        renderTimeTable();
      });
    }); 

  // event listeners for enter
  document.querySelectorAll('.subject-input')
    .forEach((button) => {
      button.addEventListener('keydown', (event) => {
        let day = button.dataset.day;
        let input = document.querySelector(`.subject-input-${day}`);
        let inputValue = input.value;

        if (event.key === 'Enter') {
          (inputValue !== '') ? addSubject(day, inputValue) : alert('Please enter a Subject Name!');
          input.value = '';
          saveInStorage();
          renderTimeTable();
        }
      });
    });

  // event listeners for Delete button
  document.querySelectorAll('.subject-button-remove')
    .forEach((button) => {
      button.addEventListener('click', () => {
        let day = button.dataset.day;
        let subjectName = button.dataset.subjectName;

        removeSubject(day, subjectName);
        saveInStorage();
        renderTimeTable();
      });
    });

  // event listener for edit button on start 
  let startElement = document.querySelector('.input-start-date');
  document.querySelector('.edit-date-button-start')
    .addEventListener('click', () => {
      const selectedDate = dayjs(startElement.value);
      const today = dayjs();

      if (startElement.value !== '' && selectedDate.isValid()) {
        if (selectedDate.isAfter(today)) {
          startEndDate.startDate = startElement.value;
          
          document.querySelector('.display-start-day').innerHTML = 
            selectedDate.format('dddd MMM DD');
            saveStartDate(startElement.value);
        } else {
          alert('Please select a future date to Start!');
        }
      } else {
        alert('Please select a Date to Start!');
      }
    });

  // event listener for edit button on end
  let endElement = document.querySelector('.input-end-date');
  document.querySelector('.edit-date-button-end')
    .addEventListener('click', () => {
      const selectedDate = dayjs(endElement.value);
      const today = dayjs();
      const startDate = startEndDate.startDate;

      if (startDate !== '') {
        if (endElement.value !== '' && selectedDate.isValid()) {
          if (selectedDate.isAfter(today) && (selectedDate.isAfter(dayjs(startEndDate.startDate)))) {
            document.querySelector('.display-end-day').innerHTML = 
            selectedDate.format('dddd MMM DD');
            saveEndDate(endElement.value);
          }
          else {
            alert('Please select a valid Date to End!')
          }
        }
        else {
          alert('Please select a Date to End!');
        }
      } else {
        alert('Please select a Date to Start First!');
      }
    });
}

// logic for adding subjects
function addSubject(day, inputValue) {
  const dayData = getDayData(day);
  dayData.subjects.push(inputValue);
}

// logic for removing subjects
function removeSubject(day, subjectName) {
  const dayData = getDayData(day);
  removeSubjectTimeTable(dayData, subjectName);
}