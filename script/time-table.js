import {timeTable, saveInStorage, getDayData} from '../data/time-table.js';

renderTimeTable();

document.querySelectorAll('.nav-button')
  .forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelector('.side-panel').classList.toggle('active');
    });
  });

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

  function renderAddedSubjects(data) {
    let subjectHTML = '';

    data.subjects.forEach((subject) => {
      subjectHTML += `
        <div class="subject-display">
            <span class="subject-name">${subject}</span>
            <button class="subject-button-remove subject-button">Delete</button>
        </div>
      `;
    });

    return subjectHTML;
  }
}

function addSubject(day, inputValue) {
  const dayData = getDayData(day);
  dayData.subjects.push(inputValue);
  console.log(dayData);
}