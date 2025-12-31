export const timeTable = JSON.parse(localStorage.getItem('time-table-data')) || [
  {
    day: "Monday",
    dayId: 1,
    subjects: []
  },
  {
    day: "Tuesday",
    dayId: 2,
    subjects: []
  },
  {
    day: "Wednesday",
    dayId: 3,
    subjects: []
  },
  {
    day: "Thursday",
    dayId: 4,
    subjects: []
  },
  {
    day: "Friday",
    dayId: 5,
    subjects: []
  },
  {
    day: "Saturday",
    dayId: 6,
    subjects: []
  }
];

export const startEndDate = JSON.parse(localStorage.getItem('start-end-date-data')) || {
  startDate: '',
  endDate: ''
};

export function saveStartDate(dates) {
  localStorage.setItem('start-end-date-data', JSON.stringify({
    startDate: dates,
    endDate: ''
  }));
}

export function saveEndDate(dates) {
  localStorage.setItem('start-end-date-data', JSON.stringify({
    startDate: startEndDate.startDate,
    endDate: dates
  }));
}

export function saveInStorage() {
  localStorage.setItem('time-table-data', JSON.stringify(timeTable));
}

export function getDayData(day) {
  let matchingDayData;

  timeTable.forEach((data) => {
    if (data.day === day) {
      matchingDayData = data;
    }
  });

  return matchingDayData;
}

export function removeSubjectTimeTable(data, subjectName) {
  
  for (let i = 0; i < data.subjects.length; i++) {
    if (subjectName === data.subjects[i]) {
      data.subjects.splice(i, 1);
      break;
    }
  }

  saveInStorage();
}