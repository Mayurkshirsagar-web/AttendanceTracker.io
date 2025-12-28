export const timeTable = JSON.parse(localStorage.getItem('time-table-data')) || [
  {
    day: "Monday",
    subjects: []
  },
  {
    day: "Tuesday",
    subjects: []
  },
  {
    day: "Wednesday",
    subjects: []
  },
  {
    day: "Thursday",
    subjects: []
  },
  {
    day: "Friday",
    subjects: []
  },
  {
    day: "Saturday",
    subjects: []
  }
]

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