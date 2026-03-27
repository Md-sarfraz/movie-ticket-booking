import React from 'react'

const Banner = (props) => {
    return (
        <div>
            <div className="relative w-full bg-[url('/images/bg-banner-img1.png')] bg-cover bg-center">
                <img src="/images/seat-bg.png" alt="Background" className="w-full h-[70vh] object-cover " />
                <div className="absolute top-0 left-0 w-full h-[70vh] bg-black opacity-70"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <h1 className="text-5xl text-red-500 pt-16">{props.heading}</h1>
                    <p className="text-white text-sm max-w-md mt-3 ">
                        {props.paragraph}
                    </p>
                </div>
            </div>
            <div className='pt-2'>
                <img src="/images/image-lines-header.jpg" alt="" />
            </div>
        </div>
    )
}

export default Banner