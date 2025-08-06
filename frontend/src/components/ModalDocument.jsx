import React from 'react';
import '../styles/ModalDocument.css';

const ModalDocument = ({ visible, onClose, url }) => {
  if (!visible) return null;

  const isPDF = url.toLowerCase().endsWith('.pdf');

  return (
    <div className='modal-doc-overlay'>
      <div className='modal-doc-content'>
        <button
          className='close-btn'
          onClick={onClose}
        >
          ×
        </button>
        {isPDF ? (
          <iframe
            src={url}
            className='modal-iframe'
            title='Documento PDF'
            style={{
              width: '100%',
              height: '460px',
              borderRadius: '8px',
              border: 'none',
            }}
          />
        ) : (
          <img
            src={url}
            alt='Documento'
            className='modal-image'
            style={{
              maxWidth: '100%',
              maxHeight: '400px',
              borderRadius: '8px',
              objectFit: 'contain',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ModalDocument;
