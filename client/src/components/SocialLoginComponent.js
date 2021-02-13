import React from 'react';

const SocialLoginComponent = ({ socialLogo, socialName }) => {
  const socialLoginHandler = (e) => {
    // Authenticate using via passport api in the backend
    // Open Twitter login page
    const width = 600,
      height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    // const url = 'http://localhost:5000/api/users/auth/twitter';
    // const url = `http://localhost:5000/auth/${e.target.alt}`;
    // const url2 = `http://127.0.0.1:5000/auth/${e.target.alt}`;

    let url;
    if (process.env.NODE_ENV === 'production') {
      url = `https://debo9210-auth-app.herokuapp.com/auth/${e.target.alt}`;
    } else {
      url = `http://localhost:5000/auth/${e.target.alt}`;
    }

    // if (e.target.alt === 'twitter') {
    //   url = `http://127.0.0.1:5000/auth/${e.target.alt}`;
    // } else {
    //   url = `http://localhost:5000/auth/${e.target.alt}`;
    // }

    return window.open(
      url,
      '_self',
      `toolbar=no, location=no, directories=no, status=no, menubar=no,
        scrollbars=no, resizable=no, copyhistory=no, width=${width},
        height=${height}, top=${top}, left=${left}`
    );
  };

  return (
    <div>
      <img onClick={socialLoginHandler} src={socialLogo} alt={socialName} />
    </div>
  );
};

export default SocialLoginComponent;
