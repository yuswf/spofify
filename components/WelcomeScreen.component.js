import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useRouter} from 'next/router';
import IconComponent from './Icon.component';
import getCurrentlyPlaying from '../utils/getCurrentlyPlaying';
import Image from 'next/image';
import Script from 'next/script';
import getLikedTracks from '../utils/getLikedTracks';
import ChangeTrack from '../utils/changeTrack';
import Loop from '../utils/loop';

function WelcomeScreenComponent() {
    const router = useRouter();
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);
    // const [progress, setProgress] = useState(0);
    const [player, setPlayer] = useState(undefined);
    const {currentUser} = useSelector(state => state.currentUser);
    const token = sessionStorage.getItem('token');
    const [is_paused, setPaused] = useState(false);
    const [volume, setVolume] = useState(100);
    const [is_active, setActive] = useState(false);
    const [loop, setLoop] = useState(false);
    const [search, setSearch] = useState('');
    const track = {
        name: "",
        album: {
            images: [
                {url: ""}
            ]
        },
        artists: [
            {name: ""}
        ]
    }
    const [current_track, setTrack] = useState(track);
    const [tracks, setTracks] = useState([]);
    let progress = 0;

    const getPlaying = async () => {
        const data = await getCurrentlyPlaying(token);

        if (!data) return;

        const {
            progress_ms,
            is_playing,
            timestamp,
            item: {album: {images, release_date}, artists, duration_ms, name}
        } = data;
    }

    const getTracks = async () => {
        const data = await getLikedTracks(token);

        if (!data) return;

        setTracks(data);
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
        const token = sessionStorage.getItem('token');
        const player = new Spotify.Player({
            name: 'Spofify',
            getOAuthToken: cb => {
                cb(token);
            },
            volume: 1
        });

        setPlayer(player);

        player.addListener('ready', ({device_id}) => {
            console.log('Ready with Device ID', device_id);
        });

        player.addListener('not_ready', ({device_id}) => {
            console.log('Device ID has gone offline', device_id);
        });

        player.addListener('player_state_changed', (state => {
            if (!state) return;

            setTrack(state.track_window.current_track);
            setPaused(state.paused);

            player.getCurrentState()
                .then(state => {
                    if (!state) return setActive(false);


                    progress += state.position;
                    setDuration(state.duration);
                    setTime(Math.round(100 * state.position / state.duration));
                    setActive(true);
                });
        }));

        player.connect();
    }

    useEffect(() => {
        // getPlaying();
        getTracks();
    }, [currentUser, token]);

    if (current_track.name === '') return <div className="welcomeScreen">
        <Script src="https://sdk.scdn.co/spotify-player.js"/>

        <p>Please connect the <b>Spofify</b> on <b style={{color: '#1ED760'}}>Spotify</b>.</p>

        <Image src="/spofify.png" height="305" width="388" className="align-center mt-7 ml-auto mr-auto" alt=""/>
    </div>

    function changeVolume(e) {
        setVolume(e.target.value);
        player.setVolume(e.target.value / 100);
    }

    function nextVolume(m) {
        if (m === 'increase') {
            player.setVolume(Number(volume) < 100 ? (Number(volume) + 1) / 100 : 1);
            setVolume(Number(volume) < 100 ? Number(volume) + 1 : '100');
        }

        if (m === 'decrease') {
            player.setVolume(Number(volume) > 0 ? (Number(volume) - 1) / 100 : 0);
            setVolume(Number(volume) > 0 ? Number(volume) - 1 : '0');
        }
    }

    function changeTrack({track}) {
        setTimeout(() => {
            setLoop(false);

            if (track.id === current_track.id && !is_paused) {
                player.pause();
            }

            if (track.id === current_track.id && is_paused) {
                player.resume();
            }

            if (track.id !== current_track.id && !is_paused) {
                setTrack(track);
                ChangeTrack(token, track.album.uri);
            }

            if (track.id !== current_track.id && is_paused) {
                setTrack(track);
                ChangeTrack(token, track.album.uri);
            }
        }, 500);
    }

    function runLoop() {
        setTimeout(() => {
            setLoop(!loop);
            Loop(loop ? 'off' : 'track', token);
        }, 500);
    }

    return (
        <div className="welcomeScreen">
            <Script src="https://sdk.scdn.co/spotify-player.js"/>
            <div>
                <div
                    className="playerCard w-full ml-auto mr-auto max-w-sm bg-white border rounded-lg shadow-md">
                    <div className="flex flex-col items-center pb-10">
                        <br/>
                        <br/>
                        <Image width={64} height={64} className="now-playing__cover w-24 h-24 mb-3 rounded-full shadow-lg"
                             src={current_track.album.images[0].url} alt="song name"/>
                        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white"><a
                            className="hover:underline"
                            href={"https://open.spotify.com/track/" + current_track.id}>{current_track.name}</a></h5>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{
                            current_track.artists.map((artist, i) => <a key={i}
                                                                        href={'https://open.spotify.com/artist/' + artist.uri.split(':')[2]}><span
                                className="hover:underline">{artist.name}</span>{current_track.artists.length - 1 > i ? ', ' : ''}
                            </a>)
                        }</span>
                        <div className="flex mt-4 space-x-3 md:mt-6">
                            <a onClick={() => {
                                setTimeout(() => {
                                    setLoop(false);
                                    player.previousTrack()
                                }, 500)
                            }}
                               className="cursor-pointer inline-flex items-center px-4 py-2 text-center text-white bg-blue-700 rounded-lg"><IconComponent
                                icon="previous" size={16} color="#fff"/></a>
                            <a onClick={() => {
                                setTimeout(() => {
                                    player.togglePlay()
                                }, 500)
                            }}
                               className="cursor-pointer inline-flex items-center px-4 py-2 text-center text-white bg-blue-700 rounded-lg ">{is_paused ?
                                <IconComponent icon="play" size={16}/> : <IconComponent icon="pause" size={16}/>}</a>
                            <a onClick={() => {
                                setTimeout(() => {
                                    setLoop(false);
                                    player.nextTrack()
                                }, 500)
                            }}
                               className="cursor-pointer inline-flex items-center px-4 py-2 text-center text-white bg-blue-700 rounded-lg"><IconComponent
                                icon="next" size={16}/></a>
                            <a onClick={() => runLoop()}
                               className="cursor-pointer inline-flex items-center px-4 py-2 text-center text-white bg-blue-700 rounded-lg"><IconComponent
                                icon="loop" color={loop ? 'rgba(255,57,178,0.98)' : ''} size={16}/></a>
                        </div>
                        <br/>
                        <label htmlFor="small-range"
                               className="block mb-2 text-sm mb-4 font-medium text-gray-900 dark:text-white"><span
                            id="decrease" onClick={() => nextVolume('decrease')}
                            className="cursor-pointer"><IconComponent icon="volume-decrease"
                                                                      size={13} /></span>&nbsp;&nbsp;&nbsp;Set
                            Volume&nbsp;&nbsp;&nbsp;<span id="increase" onClick={() => nextVolume('increase')}
                                                          className="cursor-pointer"><IconComponent
                                icon="volume-increase" size={13}/></span></label>
                        <input type="range" id="vol" value={volume} onChange={(e) => changeVolume(e)} name="vol" min="0"
                               max="100"
                               className="w-60 h-1 mb-6 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"/>
                        <pre>
                            <IconComponent
                                icon={
                                    volume >= 75 ? 'volume-high' : 'volume-medium' && volume >= 25 ? 'volume-medium' : 'volume-low' && volume > 0 ? 'volume-low' : 'volume-mute2'
                                }
                                size={16}/>
                            &nbsp;
                            {volume}
                        </pre>
                    </div>
                </div>

                <br/>
                <br/>

                <div
                    className="playerCard ml-auto mr-auto w-full max-w-md p-4 bg-white border rounded-lg shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h5 className="text-xl font-bold leading-none">
                            <IconComponent icon="heart" size={40} color="red"/>
                            &nbsp;&nbsp;&nbsp;Liked Songs
                        </h5>

                        {/*
                            <a href="" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                            View all
                        </a>
                            */}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <label htmlFor="search"
                               className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                &nbsp;
                                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                     fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>

                            <input type="search" id="search"
                                   value={search}
                                   autoComplete="off"
                                   onChange={(e) => setSearch(e.target.value)}
                                   className="block songSearchInput p-4 pl-10 text-sm rounded-lg"
                                   placeholder="Search a song..."/>
                        </div>

                    </div>

                    <div className="listOfSongs flow-root">
                        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                            {tracks
                                .filter((p) => p.track.name.toLowerCase().includes(search.toLowerCase())).length === 0
                                ?
                                'Not found any song'
                                :
                                tracks
                                    .filter((p) => p.track.name.toLowerCase().includes(search.toLowerCase()))
                                    .map((p, i) => (
                                        <li key={i} className="py-3 sm:py-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    <Image width="32" height="32" className="w-8 h-8 rounded-full"
                                                         src={p.track.album.images[0].url} alt="Neil image"/>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                        <a
                                                           href={"https://open.spotify.com/track/" + p.track.id}>
                                                            <span className="hover:underline"
                                                                  style={{color: `${current_track.id === p.track.id ? '#1ED760' : ''}`}}>{p.track.name}</span>
                                                        </a>
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                        {p.track.artists.map((artist, i) => <a key={i}
                                                                                               href={'https://open.spotify.com/artist/' + artist.uri.split(':')[2]}><span
                                                            className="hover:underline">{artist.name}</span>{p.track.artists.length - 1 > i ? ', ' : ''}
                                                        </a>)}

                                                    </p>
                                                </div>
                                                <div onClick={() => changeTrack(p)}
                                                     className="cursor-pointer inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                                    {current_track.id === p.track.id && !is_paused
                                                        ?
                                                        <IconComponent icon="pause" size={20}/>
                                                        :
                                                        <IconComponent icon="play" size={20}/>
                                                    }
                                                </div>
                                            </div>
                                        </li>
                                    ))
                            }
                        </ul>
                    </div>
                </div>

                <br/>
                <br/>
            </div>
        </div>
    );
}

export default WelcomeScreenComponent;
