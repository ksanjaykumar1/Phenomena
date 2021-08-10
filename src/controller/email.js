const { transporter } = require("../config/emailTransporter");

const sendAccountActivation = async (email, activationToken) => {
  await transporter.sendMail({
    from: 'My App ksanjay99kumar@gmail.com',
    to: email,
    subject: 'Acount Activation',
    html: `Token is ${activationToken}`,
  });
};

module.exports = {
  sendAccountActivation,
};
