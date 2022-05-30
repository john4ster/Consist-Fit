import './editWorkoutModal.css';
import Modal from 'react-modal';
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

Modal.setAppElement('#root');

function EditWorkoutModal({ modalOpen, workout, closeModalCallback }) {

  const { userID } = useContext(AuthContext);

  return (
    <Modal isOpen={modalOpen} className="editModal">
      <div className="rightHalf">
        <p className='closeButton' onClick={() => closeModalCallback()}>+</p>
      </div>
    </Modal>
  )
}

export default EditWorkoutModal