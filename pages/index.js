import {useEffect, useState} from 'react';
import toast, {Toaster} from 'react-hot-toast';
import {useRouter} from 'next/router';
import axios from 'axios';
import MainComponent from '../components/Main.component';
import LoaderComponent from '../components/Loader.component';
import NavbarComponent from '../components/Navbar.component';
import WelcomeScreenComponent from '../components/WelcomeScreen.component';

import TokenCheck from '../utils/check';
import Check from '../utils/validateBeta'
import {useSelector, useDispatch} from 'react-redux';
import {setCurrentUser} from '../stores/currentUser';

function Main() {
    const dispatch = useDispatch();
    const router = useRouter();
    const {token = null, error = null} = router.query;
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState('');
    const [check, setCheck] = useState(false);

    setTimeout(() => setLoading(false), 1100);

    const preCheck = async () => {
        if (sessionStorage.getItem('token')) {
            const result = await TokenCheck(sessionStorage.getItem('token'));

            if (result.error) {
                sessionStorage.removeItem('token');

                router.reload();
            } else {
                dispatch(setCurrentUser(await TokenCheck(sessionStorage.getItem('token'))));
            }
        }
    }

    const control = async () => {
        if (!loading && error) {
            toast.error(error);
        }

        if (!loading && token) {
            if (!(await TokenCheck(token)).error) {
                dispatch(setCurrentUser(await TokenCheck(token)));
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('expires', '3600');
                toast.success('Successfully logged in!');
                toast.success('Redirecting to dashboard in 5 secs...');
                setTimeout(() => router.push('/'), 5000);
            } else {
                toast.error('Invalid token!');
            }
        }
    }

    useEffect(() => {
        preCheck();
        control();

        if (sessionStorage.getItem('token')) {
            const checkToken = setInterval(() => {
                if (sessionStorage.getItem('expires') <= 0) {
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('expires');
                    clearInterval(checkToken);
                    router.reload();
                } else {
                    sessionStorage.setItem('expires', (sessionStorage.getItem('expires') - 1).toString());
                }
            }, 1000);
        } else {
            if (sessionStorage.getItem('expires')) {
                sessionStorage.removeItem('expires');
            }
        }
    }, [loading, token, error]);

    if (loading) return <div className="main">
        <Toaster position="bottom-center" reverseOrder={false}/>

        <LoaderComponent />
    </div>;

    if (sessionStorage.getItem('token')) return <div className="main">
        <Toaster position="bottom-center" reverseOrder={false}/>

        <NavbarComponent />
        <WelcomeScreenComponent />
    </div>;

    async function submit(event, code) {
        const regex = /[^((0-9)|(a-z)|(A-Z))]/g;

        if (code === '') {
            document.getElementById('code').disabled = false;
            setCode('');

            return toast.error(<b>Enter a code.</b>);
        }
        if (regex.test(code)) {
            document.getElementById('code').disabled = false;
            setCode('');

            return toast.error(<b>Don't match code.</b>);
        }

        if (Check(code)) {
            toast.success('Successfully entered code!');
            toast.success('Redirecting to home page in 5 secs...');
            setTimeout(() => {
                setCheck(true);
                sessionStorage.setItem('code', code);
            }, 5000);
        } else {
            document.getElementById('code').disabled = false;
            setCode('');
            toast.error(<b>Invalid code!</b>);
        }
    }

    function keyPress(event, code) {
        if (event.key === 'Enter') {
            document.getElementById('code').disabled = true;
            submit(event, code);
        }
    }

    if (sessionStorage.getItem('code') && Check(sessionStorage.getItem('code'))) {
        return <div className="main">
            <Toaster position="bottom-center" reverseOrder={false}/>

            <MainComponent />
        </div>
    } else {
        sessionStorage.removeItem('code');
    }

    return (
        <div className="main">
            <Toaster position="bottom-center" reverseOrder={false}/>

            <div className="key-input main">
                <label className="code-label" htmlFor="code">Enter Code</label>

                <div className="relative mt-1 rounded-md">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <span>|</span>
                    </div>

                    <input type="text" onKeyPress={(e) => keyPress(e, code)} name="code" id="code"
                           value={code}
                           autoComplete="off"
                           onChange={(e) => setCode(e.target.value)}
                           className="block w-full rounded-md pl-7 pr-12"
                           placeholder={"Xx".repeat(10)}/>
                </div>
            </div>
        </div>
    );
}

export default Main;
