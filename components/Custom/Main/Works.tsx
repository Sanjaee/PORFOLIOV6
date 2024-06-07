"use client";
import useEmblaCarousel from "embla-carousel-react";
import Image from "../../ui/Image";

export function Works() {
  const [emblaRef] = useEmblaCarousel();

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        <div className="embla__slide">
          <Image width={1000} height={1000} alt="2" src={"/2.png"} />
        </div>
        <div className="embla__slide">
          <Image width={1000} height={1000} alt="1" src={"/1.png"} />
        </div>
        <div className="embla__slide">
          <Image width={1000} height={1000} alt="3" src={"/3.png"} />
        </div>
        <div className="embla__slide">
          <Image width={1000} height={1000} alt="4" src={"/4.png"} />
        </div>
        <div className="embla__slide">
          <Image width={1000} height={1000} alt="5" src={"/5.png"} />
        </div>

        <div className="embla__slide">
          <Image width={1000} height={1000} alt="7" src={"/7.png"} />
        </div>
        <div className="embla__slide">
          <Image width={1000} height={1000} alt="8" src={"/8.png"} />
        </div>
      </div>
    </div>
  );
}
