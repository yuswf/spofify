import IcoMoon from 'react-icomoon';
import IconSet from '../utils/selection.json';

function IconComponent(props) {
    return (
        <IcoMoon iconSet={IconSet} {...props} />
    );
}

export default IconComponent;
