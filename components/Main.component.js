import {useRouter} from 'next/router';
import IconComponent from '../components/Icon.component';
import spotify from '../utils/spotify';

function MainComponent() {
    const router = useRouter();

    const signIn = () => {
        spotify(router);
    }

    return (
        <div className="welcomeSection">
            <button onClick={() => signIn()} className="signInButton"><IconComponent icon="spotify" size={32} color="#1ED760" />&nbsp;&nbsp;Sign In via&nbsp;<b className="spotify">Spotify</b></button>
        </div>
    );
}

export default MainComponent;
