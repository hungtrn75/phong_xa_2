import {showMessage} from 'react-native-flash-message';

export const pushMessage = ({message, description, type, ...props}) => {
  showMessage({
    message,
    description,
    type,
    icon: {icon: type, position: 'left'},
    ...props,
  });
};

pushMessage.defaultProps = {
  duration: 2550,
  animationDuration: 225,
};
