export function loadTimeTable() {
  const timeTable = JSON.parse(localStorage.getItem('time-table-data')) || [
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

  return timeTable;
}

export let timeTable = loadTimeTable();
export let startEndDate = loadStartEndDates();

export function loadStartEndDates() {
  const startEndDate = JSON.parse(localStorage.getItem('start-end-date-data')) || {
    startDate: '',
    endDate: ''
  };

  return startEndDate;
}

export function saveStartDate(dates) {
  // Update the actual object in memory first!
  startEndDate.startDate = dates; 
  
  localStorage.setItem('start-end-date-data', JSON.stringify(startEndDate));
}

export function saveEndDate(dates) {
  // Update the actual object in memory first!
  startEndDate.endDate = dates;

  localStorage.setItem('start-end-date-data', JSON.stringify(startEndDate));
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

export function dataChecker() {
  let checkDate = true;
  let checkSubjects = true;
  let subjectCount = subjectCounter();

  

  if (loadStartEndDates().startDate === '' || loadStartEndDates().endDate === '') {
    checkDate = false;
  } 
  if (subjectCount === 0) {
    checkSubjects = false;
  }

  if (!checkDate || !checkSubjects) {
    return false;
  }
  else {
    return true;
  }
}

export function subjectCounter () {
  let subjectCount = 0;
  loadTimeTable().forEach((dayData) => {
    subjectCount += dayData.subjects.length;
  });
  return subjectCount;
}