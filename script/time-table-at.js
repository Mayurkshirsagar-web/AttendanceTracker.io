import { subjectDataSort, clearSubjectsData } from "../data-at/subject.js";

clearSubjectsData();
subjectDataSort();
// event listener for nav button
document.querySelectorAll('.nav-button')
  .forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelector('.side-panel').classList.toggle('active');
    });
  });