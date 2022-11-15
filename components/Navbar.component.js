import IconComponent from './Icon.component';
import Link from 'next/link';

function NavbarComponent() {
    return (
        <div className="navbar sm:w-1/2">
            <nav className="bg-white mt-5 bg-transparent">
                <div
                    className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl px-4 md:px-6 py-2.5">
                    <Link href="/" className="flex items-center">
                        <IconComponent icon="spotify" size={32} color="#1ED760" />
                        &nbsp;&nbsp;
                        <span
                            className="self-center text-xl font-semibold whitespace-nowrap mt-0.5">Spofify</span>
                    </Link>
                    <div className="flex items-center">
                        <a href="tel:5555555555"
                           className="mr-6 text-sm font-medium text-gray-500 dark:text-white hover:underline">(555) 555-5555</a>
                    </div>
                </div>
            </nav>

            <nav className="mt-5 second-nav">
                <div className="py-3 px-4 mx-auto max-w-screen-xl md:px-6">
                    <div className="flex items-center">
                        <ul className="navbar-els flex flex-row mt-0 mr-6 space-x-8 text-sm font-medium">
                            {['Home', 'About', 'Contact'].map((el, i) => (
                                <li key={i} className="hover:underline">
                                    <Link href={`/${el.toLowerCase()}`}>{el}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default NavbarComponent;
