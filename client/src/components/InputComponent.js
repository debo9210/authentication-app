import React from 'react';

const InputComponent = ({
  iconType,
  inputType,
  placeholder,
  errorText,
  inputValueHandler,
  error,
}) => {
  return (
    <>
      <div className='InputGroup'>
        <i className='material-icons InputIcon'>{iconType}</i>
        <input
          type={inputType}
          placeholder={placeholder}
          onChange={inputValueHandler}
        />
      </div>
      <small className='ErrorText'>{errorText}</small>
    </>
  );
};

export default InputComponent;
