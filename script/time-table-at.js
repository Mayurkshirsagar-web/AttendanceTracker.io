import { subjectDataSort, clearSubjectsData, subjectsData } from "../data-at/subject.js";
import { timeTable, startEndDate } from "../data/time-table.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

// data sort from time table before
clearSubjectsData();
subjectDataSort();
renderSubjectCards();

const TodayDayId = dayjs().day();
const Today = dayjs();
const startDate = dayjs(startEndDate.startDate);
const endDate = dayjs(startEndDate.endDate);

// check if today is between start and end
if (Today.isBefore(endDate) && Today.isAfter(startDate)) {
  document.querySelector('.subjects-at-display-box').classList.remove('display-no');
  document.querySelector('.date-display-box').classList.remove('display-no');
  renderDayListHTML(TodayDayId);
}
else {
  document.querySelector('.subjects-at-display-box').classList.add('display-no');
  document.querySelector('.date-display-box').classList.add('display-no');
  document.querySelector('.day-subject-display-box').innerHTML = '<span class="not-today">No Tracking for Today</span>';
}

// generate HTML for 1st Part
function renderDayListHTML(TodayDayId) {
  let subjectHTML = '';
  let matchingDayData;

  timeTable.forEach((dayData) => {
    if (dayData.dayId === TodayDayId) {
      matchingDayData = dayData;
    }
  });

  matchingDayData.subjects.forEach((subject) => {
    subjectHTML += `
      <div class="subjects-at-display">
        <span class="subject-at-name">${subject}</span>
        <div>
          <button class="present-button Tracker-button" data-subject-name="${subject}">Present</button>
          <button class="absent-button Tracker-button" data-subject-name="${subject}">Absent</button>
          <button class="cancelled-button Tracker-button" data-subject-name="${subject}">Cancelled</button>
        </div>
      </div> 
    `;
  });

  document.querySelector('.subjects-at-display-box').innerHTML = subjectHTML;
  document.querySelector('.date-display-box').innerText = dayjs().format('dddd MMM DD');
}

function renderSubjectCards() {
  let Html = '';

  subjectsData.forEach((subjectData) => {
    Html += `
      <div class="subject-data-box ${subjectData.status}">
        <div class="subject-name-box">
          <span class="subject-name">${subjectData.subjectName}</span>
        </div>

        <div class="total-classes-box">
          <span class="total-classes">Total classes <img src="Images/right-arrow.png"> ${subjectData.totalClasses} </span>
        </div>

        <div class="present-box">
          <span class="present attendance-track">Present <img src="Images/right-arrow.png"> ${subjectData.present} </span>
        </div>

        <div class="absent-box">
          <span class="attendance-track">Absent <img src="Images/right-arrow.png"> ${subjectData.absent} </span>
        </div>

        <div class="cancelled-box">
          <span class="attendance-track">Cancelled <img src="Images/right-arrow.png"> ${subjectData.cancelled} </span>
        </div>

        <div class="percentage-relative-attendance percentage-attendance">
          <span class="attendance-track">Relative % <img src="Images/right-arrow.png"> ${subjectData.relativePercentage}%</span>
          <div class="bar-box"><div class="bar-width-box" style="width: ${subjectData.relativePercentage}%;"></div> </div>
        </div>
      
        <div class="percentage-total-attendance percentage-attendance">
          <span class="attendance-track">Total % <img src="Images/right-arrow.png"> ${subjectData.totalPercentage}%</span>
          <div class="bar-box"><div class="bar-width-box" style="width: ${subjectData.totalPercentage}%;"></div> </div>
        </div>
        
      </div>
    `;
  });

  document.querySelector('.all-subjects-display-box').innerHTML = Html;
}

// event listener for nav button
document.querySelectorAll('.nav-button')
  .forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelector('.side-panel').classList.toggle('active');
    });
  });
