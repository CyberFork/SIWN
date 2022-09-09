import {Swiper, SwiperSlide} from 'swiper/react'
import {RightCircleOutlined, LeftCircleOutlined} from '@ant-design/icons'
import {useState} from 'react'


function MySwiper(props) {
    const list = props.list;
    const slidesPerView = props.slidesPerView;
    const spaceBetween = props.spaceBetween;
    const Render = props.child;
    const [swiper, setSwiper] = useState();
    const [begin, setBegin] = useState(true);
    const [end, setEnd] = useState(false);

    function slideChange() {
        setBegin(swiper.isBeginning);
        setEnd(swiper.isEnd);
    }
    function prev() {
        swiper.slidePrev();
    }
    function next() {
        swiper.slideNext();
    }
    return (
        <>
            <Swiper slidesPerView={slidesPerView} spaceBetween={spaceBetween} onSwiper={s => setSwiper(s)} onSlideChange={slideChange}>
                {
                    list.map((d, i) => (
                        <SwiperSlide key={i}>
                            <Render data={d} {...props}/>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
            <div className="left-arrow">{!begin && <LeftCircleOutlined onClick={prev}/>}</div>
            <div className="right-arrow">{!end && <RightCircleOutlined onClick={next}/>}</div>
        </>
    )
}

export default MySwiper