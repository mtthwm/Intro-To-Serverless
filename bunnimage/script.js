const FORM_ID = 'bunnForm';
const OUTPUT_ID = 'output';
const IMAGE_INPUT_ID = 'imageInput';
const allowedExtensions = ['png', 'jpeg', 'jpg'];
// const bunnimageEndpoint = "https://serverlesscamp.azurewebsites.net/api/bunnimage-upload";
const bunnimageEndpoint = "https://serverlesscamp.azurewebsites.net/api/bunnimage-upload";

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

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Get data from the form
  const formData = new FormData(form);

  const file = formData.get('image');
  const name = formData.get('name');

  if (!file || !file.name)
  {
    alert('Please select a file.');
  }
  if (!name)
  {
    alert('No name error');
  }

  // formData.append('file', imageInput.files[0]);
  for (let [key, value] of formData.entries())
  {
    console.log(key, value);
  }

  const payload = new FormData();
  payload.append('file', imageInput.files[0]);

  const response = await fetch(bunnimageEndpoint, {
    method: 'POST',
    headers: {
      codename: formData.get('name'),
    },
    body: payload,
  });

  const responseJson = await response.json();

  if (responseJson && responseJson.contentMD5 && responseJson.contentMD5.data)
  {
    output.textContent = "Saved your image!";
  }
}); 