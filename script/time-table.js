import {timeTable, attendanceCriteria, checkAttendanceCriteria, setAttendanceCriteria, resetTimeTableData, loadTimeTable, loadStartEndDates, saveInStorage, getDayData, removeSubjectTimeTable, startEndDate, saveStartDate, saveEndDate, dataChecker} from '../data/time-table.js';
import { subjectDataSort, removeSubjectFromData, subjectsData, saveToStorage } from '../data-at/subject.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log('Service Worker Registered'))
    .catch((err) => console.log('Service Worker Failed', err));
}

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  
  // A small delay ensures the transition is smooth even if the page loads fast
  setTimeout(() => {
    loader.classList.add("loader-hidden");
  }, 800); 
});

loadTimeTable();
loadStartEndDates();
renderTimeTable();

// attendance Criteria Display at start
if (checkAttendanceCriteria()) {
  document.querySelector('.selected-attendance-criteria').innerText = `${attendanceCriteria}% Criteria Selected`;
}
else {
  document.querySelector('.selected-attendance-criteria').innerText = `No Criteria Selected`;
}

// display of dates at opening og page
(!dayjs(startEndDate.startDate) || !dayjs(startEndDate.startDate).isValid()) ? document.querySelector('.display-start-day').innerText = 'No Date Selected' : document.querySelector('.display-start-day').innerHTML = dayjs(startEndDate.startDate).format('dddd MMM DD');
(!dayjs(startEndDate.endDate) || !dayjs(startEndDate.endDate).isValid()) ? document.querySelector('.display-end-day').innerText = 'No Date Selected' : document.querySelector('.display-end-day').innerHTML = dayjs(startEndDate.endDate).format('dddd MMM DD');

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

    if (subjectHTML === '') {
      return '<div class="no-subjects">Add Subjects to Start</div>';
    }
    else {
      return subjectHTML;
    }
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
        renderTimeTable();
      });
    });

  // event listener for edit button on start 
  let startElement = document.querySelector('.input-start-date');
  document.querySelector('.edit-date-button-start')
  .addEventListener('click', () => {
    const selectedDate = dayjs(startElement.value);
    const today = dayjs();
    const storedEndDate = startEndDate.endDate ? dayjs(startEndDate.endDate) : null;

    if (!startElement.value || !selectedDate.isValid()) {
      return alert('Please select a Date to Start!');
    }

    if (selectedDate.isBefore(today, 'day')) {
      return alert('Please select a future date to Start!');
    }

    if (storedEndDate && !selectedDate.isBefore(storedEndDate, 'day')) {
      return alert('Please select a date BEFORE the End Date!');
    }

    startEndDate.startDate = startElement.value;
    saveStartDate(startElement.value);
    document.querySelector('.display-start-day').innerHTML = selectedDate.format('dddd MMM DD');
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

let attendanceCriteriaElement = document.querySelector('.input-criteria-box');

document.querySelector('.input-criteria-box')
  .addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const value = attendanceCriteriaElement.value;
      const numValue = Number(value);

      if (value !== '' && !isNaN(numValue) && numValue >= 0 && numValue <= 100) {
        setAttendanceCriteria(Number(attendanceCriteriaElement.value));          
      } else {
      alert('Please enter a valid Criteria to Confirm!');
      }
      attendanceCriteriaElement.value = '';
      if (checkAttendanceCriteria()) {
        document.querySelector('.selected-attendance-criteria').innerText = `${attendanceCriteria}% Criteria Selected`;
      }
      else {
        document.querySelector('.selected-attendance-criteria').innerText = `No Criteria Selected`;
      }
    } 
  });

document.querySelector('.attendance-criteria-button')
  .addEventListener('click', () => {
    const value = attendanceCriteriaElement.value;
    const numValue = Number(value);

    if (value !== '' && !isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      setAttendanceCriteria(Number(attendanceCriteriaElement.value));          
    } else {
    alert('Please enter a valid Criteria to Confirm!');
    }
    attendanceCriteriaElement.value = '';
    if (checkAttendanceCriteria()) {
        document.querySelector('.selected-attendance-criteria').innerText = `${attendanceCriteria}% Criteria Selected`;
      }
      else {
        document.querySelector('.selected-attendance-criteria').innerText = `No Criteria Selected`;
      }
  });

document.querySelector('.reset-button')
  .addEventListener('click', () => {
    if(confirm("Are you sure you want to reset all data?")) {
      resetTimeTableData();
      // Force a hard reload to clear memory variables across the PWA
      window.location.reload(); 
    }
  });

document.querySelector('.subject-attendance-chart')
  .addEventListener('click', () => {
    if (dataChecker()) {
      subjectDataSort();
      window.location.href = 'attendance-chart.html';
    }
    else {
      alert('Please first Setup the tracker to Start!');
    }
  });

// logic for adding subjects
function addSubject(day, inputValue) {
  const dayData = getDayData(day);
  dayData.subjects.push(inputValue);
  saveInStorage();
}

// logic for removing subjects
function removeSubject(day, subjectName) {
  const dayData = getDayData(day);
  removeSubjectTimeTable(dayData, subjectName);
  removeSubjectFromData(day, subjectName);
}
