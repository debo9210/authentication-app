import React from 'react';

const ProfileInputComponent = ({
  labelName,
  inputType,
  placeholder,
  inputInfo,
  inputValue,
  inputHandler,
  createError,
}) => {
  return (
    <div className='ProfileInputGroup'>
      <label className='LabelName'>{labelName}</label>
      <input
        type={inputType}
        placeholder={placeholder}
        defaultValue={inputValue}
        onChange={inputHandler}
      />
      <small className='inputInfo'>{inputInfo}</small>
      <small className='createError' style={{ color: 'tomato' }}>
        {createError}
      </small>
    </div>
  );
};

export default ProfileInputComponent;
