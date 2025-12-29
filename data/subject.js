const subjects = JSON.parse(localStorage.getItem('subjects-list-data')) || [];

export function saveSubjectList() {
  localStorage.setItem('subjects-list-data', JSON.stringify(subjects));
}

export function addSubjectToList(subjectNamePara) {
  let flag = 0;
  subjects.forEach((subject) => {
    if (subjectNamePara === subject.subjectName) {
      flag = 1;
      return;
    }
  });

  if (flag === 1) {
    subjects.forEach((subject) => {
      if (subjectNamePara === subject.subjectName) {
        subject.totalClassesInaWeek += 1;
        return;
      }
    });
  } else if (flag === 0) {
    subjects.push({
      subjectName: subjectNamePara,
      totalClassesInaWeek: 1,
      totalClasses: 0,
      classesAttended: 0,
      classesPresent: 0,
      classesCancelled: 0
    });
  }

  saveSubjectList();
}

export function removeSubjectFromList(subjectNamePara) {
  for (let i = 0; i < subjects.length; i++) {
    if (subjectNamePara === subjects[i].subjectName) {
      subjects[i].totalClassesInaWeek -= 1;
      break;
    }
  }

  for (let i = 0; i < subjects.length; i++) {
    if (subjects[i].totalClassesInaWeek === 0) {
      subjects.splice(i, 1);
      break;
    }
  }

  saveSubjectList();
}

