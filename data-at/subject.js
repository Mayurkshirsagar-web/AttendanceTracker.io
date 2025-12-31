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
          status: '',
          totalClasses: 0,
          present: 0,
          absent: 0,
          cancelled: 0,
          relativePercentage: 0,
          totalPercentage: 0
        });

        subjectsData[0].weekData[dayData.day] = 0;
        subjectsData[0].weekData[dayData.day] += 1;
      }
      else if (flag === 1) {
        let MatchingData;
        subjectsData.forEach((subjectData) => {
          if (subjectData.subjectName === subject) {
            MatchingData = subjectData;
          }
        });

        MatchingData.weekData[dayData.day] = 0;
        MatchingData.weekData[dayData.day] += 1;
      }

    });
  });

  totalClassCounter();
  checkTotalClasses();
  calRelativePercent();
  calTotalPercent();
  statusGiver(75);
  saveToStorage();
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

function calRelativePercent() {
  subjectsData.forEach((subjectData) => {
    const totalConducted = subjectData.present + subjectData.absent;

    if (totalConducted === 0) {
      subjectData.relativePercentage = 100; 
    } else {
      const calculation = (subjectData.present / totalConducted) * 100;
      
      subjectData.relativePercentage = Number(calculation.toFixed(2));
    }
  });

  
  statusGiver(75);
  saveToStorage();
}

function calTotalPercent() {
  subjectsData.forEach((subjectData) => {
    const denominator = subjectData.totalClasses - subjectData.cancelled;
    if (denominator <= 0) {
      subjectData.totalPercentage = 0;
    } else {
      const calculation = (subjectData.present / denominator) * 100;
      subjectData.totalPercentage = Number(calculation.toFixed(2));
    }
  });

  saveToStorage();
}

export function classPresent(subjectName) {
  let MatchingData;

  subjectsData.forEach((subjectData) => {
    if (subjectData.subjectName === subjectName) {
      MatchingData = subjectData;
    }
  });

  MatchingData.present += 1;
  calRelativePercent();
  calTotalPercent();
  saveToStorage();
}

export function classAbsent(subjectName) {
  let MatchingData;

  subjectsData.forEach((subjectData) => {
    if (subjectData.subjectName === subjectName) {
      MatchingData = subjectData;
    }
  });

  MatchingData.absent += 1;
  calRelativePercent();
  calTotalPercent();
  saveToStorage();
}

export function classCancelled(subjectName) {
  let MatchingData;

  subjectsData.forEach((subjectData) => {
    if (subjectData.subjectName === subjectName) {
      MatchingData = subjectData;
    }
  });

  MatchingData.cancelled += 1
  calTotalPercent();
  saveToStorage();
}

function statusGiver(attendanceCriteria) {
  subjectsData.forEach((subjectData) => {
    let modifiedCriteria = ((100 - Number(attendanceCriteria)) / 2).toFixed(2) + Number(attendanceCriteria);

    if (subjectData.relativePercentage <= Number(attendanceCriteria)){
      subjectData.status = 'bad';
    } else if (subjectData.relativePercentage >= modifiedCriteria) {
      subjectData.status = 'good';
    }
    else {
      subjectData.status = 'medium';
    }
  });
}

export function removeSubjectFromData(day, subjectNamePara) {
  let matchingSubjectData;

  subjectsData.forEach((subjectData) => {
    if (subjectData.subjectName === subjectNamePara) {
      matchingSubjectData = subjectData;
    }
  });

  matchingSubjectData.weekData[day] -= 1;

  checkTotalClasses();
  saveToStorage();
}

function checkTotalClasses() {
  subjectsData.forEach((subjectData, i) => {
    if (subjectData.totalClasses <= 0) {
      subjectsData.splice(i, 1);
    }
  });
}

  console.log(subjectsData);