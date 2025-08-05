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
            width='100%'
            height='500px'
            title='Documento PDF'
          />
        ) : (
          <img
            src={url}
            alt='Documento'
            style={{ maxWidth: '100%', maxHeight: '500px' }}
          />
        )}
      </div>
    </div>
  );
};

export default ModalDocument;
