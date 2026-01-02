import { subjectsData, classPresent, classAbsent, classCancelled } from "../data-at/subject.js";
import { timeTable, startEndDate } from "../data/time-table.js";
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

const Today = dayjs();
const todayString = Today.format('YYYY-MM-DD'); 
const TodayDayId = Today.day(); 

const startDate = dayjs(startEndDate.startDate);
const endDate = dayjs(startEndDate.endDate);

syncMarkedList();
renderSubjectCards();
renderDayListHTML(TodayDayId);

function syncMarkedList() {
    const lastDate = localStorage.getItem('last-marked-date');
    if (lastDate !== todayString) {
        localStorage.setItem('last-marked-date', todayString);
        localStorage.setItem('subjects-marked-today', JSON.stringify([]));
    }
}

function renderDayListHTML(TodayDayId) {
    const isWithinSemester = (Today.isAfter(startDate, 'day') || Today.isSame(startDate, 'day')) && 
                             (Today.isBefore(endDate, 'day') || Today.isSame(endDate, 'day'));
    const isNotSunday = TodayDayId !== 0;

    const displayBox = document.querySelector('.subjects-at-display-box');
    const dateBox = document.querySelector('.date-display-box');
    const mainContainer = document.querySelector('.day-subject-display-box');

    if (!isWithinSemester || !isNotSunday) {
        displayBox.classList.add('display-no');
        dateBox.classList.add('display-no');
        const msg = !isNotSunday ? "It's Sunday! No classes today." : "Outside Semester Dates";
        mainContainer.innerHTML = `<span class="not-today">${msg}</span>`;
        return;
    }

    let matchingDayData = timeTable.find(dayData => dayData.dayId === TodayDayId);

    let markedSlots = JSON.parse(localStorage.getItem('subjects-marked-today')) || [];

    if (!matchingDayData || matchingDayData.subjects.length === 0) {
        mainContainer.innerHTML = '<span class="not-today">No subjects scheduled for today</span>';
        return;
    }

    let subjectHTML = '';
    let visibleCount = 0;

    matchingDayData.subjects.forEach((subject, index) => {

        const slotId = `${matchingDayData.day}-${index}-${subject}`;

        // Only generate HTML if this specific slot has NOT been marked yet
        if (!markedSlots.includes(slotId)) {
            visibleCount++;
            subjectHTML += `
              <div class="subjects-at-display ${subject}-box">
                <span class="subject-at-name">${subject}</span>
                <div class="button-group">
                  <button class="present-button Tracker-button" 
                    data-subject-name="${subject}" 
                    data-slot-id="${slotId}">Present</button>
                  <button class="absent-button Tracker-button" 
                    data-subject-name="${subject}" 
                    data-slot-id="${slotId}">Absent</button>
                  <button class="cancelled-button Tracker-button" 
                    data-subject-name="${subject}" 
                    data-slot-id="${slotId}">Cancelled</button>
                </div>
              </div> 
            `;
        }
    });

    if (visibleCount === 0) {
        displayBox.classList.add('display-no');
        mainContainer.innerHTML = '<span class="not-today">All attendance for today is complete!</span>';
    } else {
        displayBox.classList.remove('display-no');
        dateBox.classList.remove('display-no');
        dateBox.innerText = Today.format('dddd, MMM DD');
        displayBox.innerHTML = subjectHTML;
        setupAttendanceListeners(TodayDayId);
    }
}

function setupAttendanceListeners(dayId) {
    document.querySelectorAll('.Tracker-button').forEach(button => {
        button.addEventListener('click', () => {
            const subjectName = button.dataset.subjectName;
            const slotId = button.dataset.slotId; 
            
            // 1. Update Attendance Data
            if (button.classList.contains('present-button')) {
                classPresent(subjectName);
            } else if (button.classList.contains('absent-button')) {
                classAbsent(subjectName);
            } else if (button.classList.contains('cancelled-button')) {
                classCancelled(subjectName);
            }

            // 2. Add the unique Slot ID to the marked list
            let markedSlots = JSON.parse(localStorage.getItem('subjects-marked-today')) || [];
            markedSlots.push(slotId);
            localStorage.setItem('subjects-marked-today', JSON.stringify(markedSlots));

            renderDayListHTML(dayId);
            renderSubjectCards();
        });
    });
}

function renderSubjectCards() {
    let html = '';
    subjectsData.forEach((subjectData) => {
        html += `
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
    document.querySelector('.all-subjects-display-box').innerHTML = html;
}

// Side Panel Toggle
document.querySelectorAll('.nav-button').forEach((button) => {
    button.addEventListener('click', () => {
        document.querySelector('.side-panel').classList.toggle('active');
    });
});