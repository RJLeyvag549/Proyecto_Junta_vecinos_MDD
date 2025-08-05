import { useState, useRef } from 'react';
import { register } from '../services/auth.service';
import '../styles/register.css';

import fullNameIcon from '../assets/register1-icon.png';
import rutIcon from '../assets/register2-icon.png';
import emailIcon from '../assets/register3-icon.png';
import passwordIcon from '../assets/register4-icon.png';
import contactIcon from '../assets/register5-icon.png';
import homeAddressIcon from '../assets/register6-icon.png';
import uploadArchiveIcon from '../assets/register7-icon.png';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    rut: '',
    email: '',
    password: '',
    contact: '',
    homeAddress: '',
    docIdentity: null,
    docResidence: null,
  });

  const docIdentityRef = useRef(null);
  const docResidenceRef = useRef(null);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!formData.docIdentity || !formData.docResidence) {
    alert(
      'Debes adjuntar la cédula de identidad y el comprobante de domicilio antes de enviar la solicitud de registro.'
    );
    return;
    }

    try {
      await register(formData);
      alert(
        '¡Tu solicitud de registro fue enviada con éxito!\nTe enviaremos un correo en los próximos días informándote si fue aprobada o rechazada.'
      );

      setFormData({
        fullName: '',
        rut: '',
        email: '',
        password: '',
        contact: '',
        homeAddress: '',
        docIdentity: null,
        docResidence: null,
      });

      if (docIdentityRef.current) docIdentityRef.current.value = '';
      if (docResidenceRef.current) docResidenceRef.current.value = '';
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        console.error(error);
        alert('Error al registrar');
      }
    }
  };

  return (
    <div className='register-background'>
      <form
        className='register-container'
        onSubmit={handleSubmit}
      >
        <h2 className='register-title'>Solicitud de Registro</h2>

        <label>NOMBRE COMPLETO</label>
        <div className='input-with-icon'>
          <img
            src={fullNameIcon}
            alt='icono nombre'
            className='input-icon'
          />
          <input
            type='text'
            name='fullName'
            value={formData.fullName}
            onChange={handleChange}
            placeholder='Valentina Lucía Barra Retamal'
          />
        </div>
        {errors.fullName && (
          <ul className='error-message'>
            {errors.fullName.map((err, idx) => (
              <li key={idx}>• {err}</li>
            ))}
          </ul>
        )}

        <label>RUT</label>
        <div className='input-with-icon'>
          <img
            src={rutIcon}
            alt='icono nombre'
            className='input-icon'
          />
          <input
            type='text'
            name='rut'
            value={formData.rut}
            onChange={handleChange}
            placeholder='12.345.678-9'
          />
        </div>
        {errors.rut && (
          <ul className='error-message'>
            {errors.rut.map((err, idx) => (
              <li key={idx}>• {err}</li>
            ))}
          </ul>
        )}

        <label>CORREO ELECTRÓNICO</label>
        <div className='input-with-icon'>
          <img
            src={emailIcon}
            alt='icono nombre'
            className='input-icon'
          />
          <input
            type='text'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='correo@gmail.com'
          />
        </div>
        {errors.email && (
          <ul className='error-message'>
            {errors.email.map((err, idx) => (
              <li key={idx}>• {err}</li>
            ))}
          </ul>
        )}

        <label>CONTRASEÑA</label>
        <div className='input-with-icon'>
          <img
            src={passwordIcon}
            alt='icono nombre'
            className='input-icon'
          />
          <input
            type='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='Abcd1234@'
          />
        </div>
        {errors.password && (
          <ul className='error-message'>
            {errors.password.map((err, idx) => (
              <li key={idx}>• {err}</li>
            ))}
          </ul>
        )}

        <label>NÚMERO DE CONTACTO</label>
        <div className='input-with-icon'>
          <img
            src={contactIcon}
            alt='icono nombre'
            className='input-icon'
          />
          <input
            type='text'
            name='contact'
            value={formData.contact}
            onChange={handleChange}
            placeholder='12345678'
          />
        </div>
        {errors.contact && (
          <ul className='error-message'>
            {errors.contact.map((err, idx) => (
              <li key={idx}>• {err}</li>
            ))}
          </ul>
        )}

        <label>DIRECCIÓN</label>
        <div className='input-with-icon'>
          <img
            src={homeAddressIcon}
            alt='icono nombre'
            className='input-icon'
          />
          <input
            type='text'
            name='homeAddress'
            value={formData.homeAddress}
            onChange={handleChange}
            placeholder='Avenida siempre viva, casa 742, Springfield'
          />
        </div>
        {errors.homeAddress && (
          <ul className='error-message'>
            {errors.homeAddress.map((err, idx) => (
              <li key={idx}>• {err}</li>
            ))}
          </ul>
        )}

        <br />

        <div className='documents-upload'>
          <div>
            <label>CÉDULA IDENTIDAD</label>
            <button
              type='button'
              className='custom-file-button'
              onClick={() => docIdentityRef.current.click()}
            >
              <img
                src={uploadArchiveIcon}
                alt='icono subir'
                className='file-icon'
              />
              Adjuntar cédula
            </button>
            <input
              type='file'
              name='docIdentity'
              accept='.pdf,.jpg,.jpeg,.png'
              onChange={handleChange}
              ref={docIdentityRef}
            />
            {errors.docIdentity && (
              <span className='error-message'>
                {errors.docIdentity.join(', ')}
              </span>
            )}
          </div>
          <div>
            <label>COMPROBANTE DOMICILIO</label>
            <button
              type='button'
              className='custom-file-button'
              onClick={() => docResidenceRef.current.click()}
            >
              <img
                src={uploadArchiveIcon}
                alt='icono subir'
                className='file-icon'
              />
              Adjuntar domicilio
            </button>
            <input
              type='file'
              name='docResidence'
              accept='.pdf,.jpg,.jpeg,.png'
              onChange={handleChange}
              ref={docResidenceRef}
            />
            {errors.docResidence && (
              <span className='error-message'>
                {errors.docResidence.join(', ')}
              </span>
            )}
          </div>
        </div>

        <button type='submit'>ENVIAR SOLICITUD</button>
      </form>
    </div>
  );
}

export default Register;
