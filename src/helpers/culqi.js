function culqi() {
  const Culqi = window.Culqi;
  if (Culqi.token) {
    // ¡Objeto Token creado exitosamente!
    var token = Culqi.token.id;
    alert("Se ha creado un token:" + token);
    //En esta linea de codigo debemos enviar el "Culqi.token.id"
    //hacia tu servidor con Ajax
  } else {
    // ¡Hubo algún problema!
    // Mostramos JSON de objeto error en consola
    console.log(Culqi.error);
    alert(Culqi.error.user_message);
  }
}

export default culqi;
