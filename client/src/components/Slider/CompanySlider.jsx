import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";

const logos1 = [
  { title: "adobe",     url: "/logos/adobe.webp" },
  { title: "amazon",    url: "/logos/amazon.webp" },
  { title: "flipkart",  url: "/logos/flipkart.webp" },
  { title: "google",    url: "/logos/google.webp" },
  { title: "meta",      url: "/logos/meta.webp" },
  { title: "microsoft", url: "/logos/microsoft.webp" },
  { title: "nykaa",     url: "/logos/nykaa.webp" },
];

const logos2 = [
  { title: "paypal",    url: "/logos/paypal.webp" },
  { title: "paytm",     url: "/logos/paytm.webp" },
  { title: "razorpay",  url: "/logos/razorpay.webp" },
  { title: "target",    url: "/logos/target.webp" },
  { title: "vimeo",     url: "/logos/vimeo.webp" },
  { title: "zomato",    url: "/logos/zomato.webp" },
  { title: "nykaa",     url: "/logos/nykaa.webp" },
];

function Slider({ logos, reverse = false }) {
  return (
    <Swiper
      modules={[Autoplay, FreeMode]}
      spaceBetween={20}
      loop={true}
      freeMode={true}
      autoplay={{ delay: 0, reverseDirection: reverse, disableOnInteraction: false, pauseOnMouseEnter: true }}
      speed={5000}
      breakpoints={{ 320: { slidesPerView: 2.5 }, 480: { slidesPerView: 3 }, 640: { slidesPerView: 4 }, 1024: { slidesPerView: 6 } }}
    >
      {logos.map((logo, idx) => (
        <SwiperSlide key={idx} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ width: 100, height: 50, position: "relative" }}>
            <img src={logo.url} alt={logo.title} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default function CompanySlider() {
  return (
    <div style={{ background: "#f9fafb", padding: "24px 0" }}>
      <Slider logos={logos1} />
      <Slider logos={logos2} reverse />
    </div>
  );
}
