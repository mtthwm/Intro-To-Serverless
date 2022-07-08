const FORM_ID = 'bunnForm';
const OUTPUT_ID = 'output';
const form = document.getElementById(FORM_ID);
const output = document.getElementById(OUTPUT_ID);

form.addEventListener('submit', (event) => {
  event.preventDefault();

  // Get data from the form
  const formData = new FormData(form);
  
  output.innerHTML = formData.get('name') + '❤️';
}); 