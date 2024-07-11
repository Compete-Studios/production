import React, { useEffect, useState } from 'react';
import { usePrevNextButtons } from './EmblaCarouselArrowButtons';
import useEmblaCarousel from 'embla-carousel-react';
import Lightbox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css';
import './embla.css';
import IconArrowBackward from '../../../components/Icon/IconArrowBackward';
import IconArrowForward from '../../../components/Icon/IconArrowForward';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';

const EmblaCarousel = (props: any) => {
    const { slides, options } = props;
    const [emblaRef, emblaApi] = useEmblaCarousel(options);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('View photos'));
    });
    const [value, setValue] = useState<any>('all controls');
    const [isOpen, setIsOpen] = useState<any>(false);
    const [photoIndex, setPhotoIndex] = useState<any>(0);

    const handleChange = (e: any) => setValue(e.target.value);
    const [tabs] = useState<string>('All controls');
    const [tabs1] = useState<string>('All controls');
    useEffect(() => {
        window['global'] = window as never;
    }, []);

    const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);

    return (
        <section className="embla w-full">
            <div className="flex items-center mb-4">  
            <h2 className="font-bold text-xl sm:-ml-3">Photos <span className="font-normal">({slides?.length})</span></h2>           
                <div className='ml-auto'>
                    <button className="text-emerald-600 hover:text-emerald-500 p-3 border border-emerald-600 rounded-md mr-2" onClick={onPrevButtonClick} disabled={prevBtnDisabled}>
                        <IconArrowBackward />
                    </button>
                    <button className="text-emerald-600 hover:text-emerald-500 p-3 border border-emerald-600 rounded-md hover:bg-emerald-50" onClick={onNextButtonClick} disabled={nextBtnDisabled}>
                        <IconArrowForward />
                    </button>
                </div>
            </div>
            <div className="mt-4">
                <div className="embla__viewport" ref={emblaRef}>
                    <div className="embla__container">
                        {slides?.map((slide: any, index: any) => (
                            <div className="embla__slide" key={index}>
                                <div className="embla__slide__number">
                                    <button
                                        className="w-full h-full"
                                        onClick={() => {
                                            setIsOpen(true);
                                            setPhotoIndex(index);
                                        }}
                                    >
                                        <img key={index} src={slide} alt={`Space ${index}`} className="w-full h-full object-center object-cover rounded-lg" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {isOpen && (
                    <Lightbox
                        mainSrc={`${slides[photoIndex]}`}
                        nextSrc={`${slides[photoIndex + (1 % slides.length)]?.src}`}
                        prevSrc={`${setTimeout(() => {
                            return slides[(photoIndex + slides.length - 1) % slides.length]?.src;
                        })}`}
                        onCloseRequest={() => setIsOpen(false)}
                        onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % slides.length)}
                        onMovePrevRequest={() => setPhotoIndex((photoIndex + slides.length - 1) % slides.length)}
                        imageTitle={slides[photoIndex]?.title}
                        imageCaption={slides[photoIndex]?.description}
                        animationDuration={300}
                        keyRepeatLimit={180}
                    />
                )}
            </div>
        </section>
    );
};

export default EmblaCarousel;
