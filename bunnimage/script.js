const FORM_ID = 'bunnForm';
const OUTPUT_ID = 'output';
const IMAGE_INPUT_ID = 'imageInput';
const allowedExtensions = ['png', 'jpeg', ];
const form = document.getElementById(FORM_ID);
const output = document.getElementById(OUTPUT_ID);
const imageInput = document.getElementById(IMAGE_INPUT_ID);

imageInput.addEventListener('change', (event) => {
  const formData = new FormData(form);
  const file = formData.get('image');
  
  let foundValid = false;
  for (let ext of allowedExtensions)
  {
    if (file.name.endsWith('.'+ext))
    {
      foundValid = true;
      break;
    }
  }

  if (!foundValid)
  {
    alert('Please select a proper file type');
    imageInput.value = null;
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  // Get data from the form
  const formData = new FormData(form);

  const file = formData.get('image');
  const name = formData.get('name');

  console.log(name, file);

  if (!file || !file.name)
  {
    alert('Please select a file.');
  }
  if (!name)
  {
    alert('No name error');
  }

  
}); 