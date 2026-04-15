import React from 'react'

const Banner = (props) => {
    const compactMobile = props.compactMobile ?? false;
    const bannerHeightClass = compactMobile ? 'h-[40vh] sm:h-[55vh] md:h-[62vh]' : 'h-[52vh] sm:h-[62vh] md:h-[70vh]';

    return (
        <div className="pt-16 md:pt-20">
            <div className="relative w-full bg-[url('/images/bg-banner-img1.png')] bg-cover bg-center">
                <img src="/images/seat-bg.png" alt="Background" className={`w-full object-cover ${bannerHeightClass}`} />
                <div className="absolute inset-0 bg-black opacity-70"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-8 sm:pt-10">
                    <h1 className="text-4xl sm:text-5xl text-red-500 leading-tight">{props.heading}</h1>
                    <p className="text-white text-xs sm:text-sm max-w-md mt-2 sm:mt-3">
                        {props.paragraph}
                    </p>
                </div>
            </div>
            <div>
                <img src="/images/image-lines-header.jpg" alt="" />
            </div>
        </div>
    )
}

export default Banner