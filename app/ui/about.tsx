import SvgIconStatic from "./svgIconStatic";

const About = () => (
    <main className='flex flex-col text-center gap-2 p-2 min-h-[calc(100vh-4rem)] items-center justify-center bg-cover bg-color-1'>
        <p className="text-18 m-0 p-0 leading-none text-color-4">Hi, Glad to see you! I am</p>
        <p className="text-32 md:text-48 font-bold text-color-4 m-0 p-0 leading-none">Pratap Panabaka</p>
        <p className='text-24 md:text-28 justify-items-start font-bold text-color-3'>Full Stack Developer and Open Source Software Developer</p>
        <div className="w-full text-color-4">
            <strong>JavaScript</strong>
            <span> | </span>
            <strong>ReactJS</strong>
            <span> | </span>
            <strong>NextJS</strong>
            <span> | </span>
            <strong>NodeJS</strong>
            <span> | </span>
            <strong>ExpressJS</strong>
            <span> | </span>
            <strong>Tailwind CSS</strong>
        </div>
        <div className="mx-auto flex justify-center items-center fill-color-4 mt-5 mb-5">
            <SvgIconStatic />
        </div>
        <span className="text-color-4">I use <strong>Linux OS</strong> with <strong>Arch Linux</strong> distribution</span>
    </main>
);

export default About;
