import {timeTable} from '../data/time-table.js';
import { startEndDate } from '../data/time-table.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

export let subjectsData =  JSON.parse(localStorage.getItem('subjects-at-data')) || [];

export function saveToStorage() {
  localStorage.setItem('subjects-at-data', JSON.stringify(subjectsData));
}

export function subjectDataSort() {

  timeTable.forEach((dayData) => {
    dayData.subjects.forEach((subject) => {
      let flag = 0;

      subjectsData.forEach((subjectData) => {
        if (subjectData.subjectName === subject) {
          flag = 1;
        }
      });

      if (flag === 0) {
        subjectsData.unshift({
          subjectName: subject,
          weekData: {
            Monday: 0,
            Tuesday: 0,
            Wednesday: 0,
            Thursday: 0,
            Friday: 0,
            Saturday: 0
          },
          totalClasses: 0,
          present: 0,
          absent: 0,
          cancelled : 0,
          relativePercentage: 0,
          totalPercentage: 0
        });

        subjectsData[0].weekData[dayData.day] += 1;
      }
      else if (flag === 1) {
        let MatchingData;
        subjectsData.forEach((subjectData) => {
          if (subjectData.subjectName === subject) {
            MatchingData = subjectData;
          }
        });

        MatchingData.weekData[dayData.day] += 1;
      }

    });
  });

  totalClassCounter();
  saveToStorage();
  console.log(subjectsData);
}

export function clearSubjectsData() {
  subjectsData = [];
  saveToStorage();
}

function totalClassCounter() {
  subjectsData.forEach((subjectData) => {
    subjectData.totalClasses = 
    ((subjectData.weekData.Monday) * (dayCounter('Monday'))) + 
    ((subjectData.weekData.Tuesday) * (dayCounter('Tuesday'))) + 
    ((subjectData.weekData.Wednesday) * (dayCounter('Wednesday'))) + 
    ((subjectData.weekData.Thursday) * (dayCounter('Thursday'))) + 
    ((subjectData.weekData.Friday) * (dayCounter('Friday'))) + 
    ((subjectData.weekData.Saturday) * (dayCounter('Saturday')));
  });
}

function dayCounter(day) {
  let startDate = dayjs(startEndDate.startDate);
  let endDate = dayjs(startEndDate.endDate);

  let dayCount = 0;
  let dayId = 0; 

  switch (day) {
    case 'Monday':    dayId = 1; break;
    case 'Tuesday':   dayId = 2; break;
    case 'Wednesday': dayId = 3; break;
    case 'Thursday':  dayId = 4; break;
    case 'Friday':    dayId = 5; break;
    case 'Saturday':  dayId = 6; break;
  }

  while (!startDate.isAfter(endDate)) {
    if (startDate.day() === dayId) {
      dayCount++;
    }
    startDate = startDate.add(1, 'day');
  }

  return dayCount;
}

