const form = document.getElementById('formularioCrearProducto');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });

    const result = await response.json();

    if (!response.ok) {
      throw Error(result.content[0].msg);
    }

    alert(result.message);
  } catch (error) {
    alert(error)
    console.error('Error en el submit del formulario crear producto:', error);
  }
});