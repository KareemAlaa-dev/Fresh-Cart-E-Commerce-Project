"use client"
import Image from "next/image";
import React, { useState } from "react";
import Slider from "react-slick";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../ui/button";

interface ArrowProps {
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function NextArrow(props: ArrowProps) {
	const { onClick } = props;
	return (
		<button
			onClick={onClick}
			className="absolute right-8 top-1/2 -translate-y-1/2 z-30 p-6 rounded-full bg-white/90 hover:bg-white text-primary shadow-2xl transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center border border-primary/10"
			aria-label="Next slide"
		>
			<ChevronRight className="h-8 w-8" />
		</button>
	);
}

function PrevArrow(props: ArrowProps) {
	const { onClick } = props;
	return (
		<button
			onClick={onClick}
			className="absolute left-8 top-1/2 -translate-y-1/2 z-30 p-6 rounded-full bg-white/90 hover:bg-white text-primary shadow-2xl transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center border border-primary/10"
			aria-label="Previous slide"
		>
			<ChevronLeft className="h-8 w-8" />
		</button>
	);
}

const slides = [
	{
		image: "/images/hero_veg.png",
		fallback: "/images/slider-image-1.jpeg",
		title: "Organic Freshness",
		subtitle: "Directly from our farms",
		description: "Experience the peak of seasonal organic harvesting with daily deliveries that guarantee ultra-fresh quality.",
		cta: "Shop Vegetables"
	},
	{
		image: "/images/hero_fruits.png",
		fallback: "/images/slider-image-2.jpeg",
		title: "Exotic Flavors",
		subtitle: "Curated Global Selection",
		description: "Discover nature's finest sweetness with our hand-picked collection of premium exotic fruits from around the world.",
		cta: "Explore Fruits"
	},
	{
		image: "/images/hero_delivery.png",
		fallback: "/images/slider-image-3.jpeg",
		title: "Smart Logistics",
		subtitle: "Next-Gen Delivery",
		description: "Leveraging technology to ensure your groceries arrive in perfect condition, exactly when you need them.",
		cta: "Learn More"
	}
];

export default function MainSlider() {
	const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

	const settings = {
		dots: true,
		infinite: true,
		speed: 1500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 7000,
		fade: true,
		cssEase: "cubic-bezier(0.87, 0, 0.13, 1)",
		nextArrow: <NextArrow />,
		prevArrow: <PrevArrow />,
		appendDots: (dots: React.ReactNode) => (
			<div className="absolute bottom-10 w-full flex justify-center z-40">
				<ul className="flex justify-center items-center gap-6 bg-black/60 backdrop-blur-2xl px-10 py-5 rounded-full border border-white/20 shadow-2xl w-1/2"> {dots} </ul>
			</div>
		),
		customPaging: () => (
			<div className="w-3.5 h-3.5 rounded-full bg-white/20 hover:bg-white/50 transition-all duration-300 border border-white/5 shadow-sm cursor-pointer hover:scale-125" />
		),
	};

	return (
		<div className="w-full relative group bg-neutral-950 overflow-hidden">
			<Slider {...settings} className="hero-slider-main">
				{slides.map((slide, index) => (
					<div key={index} className="relative w-full h-[650px] lg:h-[800px] outline-none overflow-hidden">
						{/* Background Image Container */}
						<motion.div 
							initial={{ scale: 1.15 }}
							animate={{ scale: 1 }}
							transition={{ duration: 12, ease: "linear" }}
							className="absolute inset-0"
						>
								<Image 
									src={imageErrors[index] ? slide.fallback : slide.image}
									alt={slide.title}
									fill
									priority={index === 0}
									loading={index === 0 ? "eager" : "lazy"}
									className="object-cover transition-opacity duration-1000"
									sizes="100vw"
									quality={80}
									onError={() => setImageErrors(prev => ({ ...prev, [index]: true }))}
								/>
						</motion.div>
						
						{/* Multi-layered Premium Overlays */}
						<div className="absolute inset-0 bg-black/30 z-10" />
						<div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />
						<div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent z-10" />

						{/* Content Layer */}
						<div className="absolute inset-0 z-20 flex items-center">
							<div className="container mx-auto px-10 lg:px-24">
								<div className="max-w-4xl -mt-20">
									<AnimatePresence mode="wait">
										<motion.div
											key={`content-${index}`}
											initial={{ opacity: 0, y: 40 }}
											whileInView={{ opacity: 1, y: 0 }}
											transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
										>
											<div className="flex items-center gap-4 mb-8">
												<motion.div 
													initial={{ opacity: 0, scale: 0.8 }}
													animate={{ opacity: 1, scale: 1 }}
													className="p-3 rounded-2xl bg-primary/20 backdrop-blur-md border border-primary/30"
												>
													<Sparkles className="h-5 w-5 text-primary" />
												</motion.div>
												<span className="text-sm font-black uppercase tracking-[0.4em] text-white/90">Fresh <span className="text-primary italic font-serif">Catalog</span></span>
											</div>

											<motion.p 
												initial={{ opacity: 0, x: -30 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: 0.2, duration: 0.8 }}
												className="text-primary-foreground/80 font-bold uppercase tracking-[0.3em] text-xs lg:text-sm mb-6"
											>
												{slide.subtitle}
											</motion.p>
											
											<h2 className="text-6xl lg:text-[10rem] font-black text-white leading-[0.85] mb-10 drop-shadow-2xl tracking-tighter">
												{slide.title.split(' ')[0]} <br/> 
												<span className="text-primary italic font-serif font-light tracking-normal">{slide.title.split(' ')[1]}</span>
											</h2>

											<p className="text-white/80 text-lg lg:text-3xl font-light mb-14 line-clamp-2 leading-snug drop-shadow-lg max-w-3xl">
												{slide.description}
											</p>

											<div className="flex flex-wrap gap-8">
												<Button className="h-20 px-14 rounded-full bg-primary hover:bg-white hover:text-primary text-white font-black uppercase tracking-[0.2em] text-sm gap-6 group/btn shadow-2xl shadow-primary/40 transition-all duration-700 border-none">
													{slide.cta}
													<ArrowRight className="h-7 w-7 group-hover/btn:translate-x-4 transition-transform duration-500" />
												</Button>
											</div>
										</motion.div>
									</AnimatePresence>
								</div>
							</div>
						</div>
					</div>
				))}
			</Slider>

			{/* Global Slider Overrides */}
			<style jsx global>{`
				.hero-slider-main .slick-dots li.slick-active div {
					background-color: #ffffff !important;
					width: 4rem !important;
					border-color: transparent !important;
					opacity: 1 !important;
				}
				.hero-slider-main .slick-dots li {
					margin: 0 8px !important;
					width: auto !important;
					height: auto !important;
				}
				.hero-slider-main .slick-list {
					overflow: visible !important;
				}
				.hero-slider-main .slick-track {
					display: flex !important;
				}
				.hero-slider-main .slick-slide > div {
					height: 100%;
				}
			`}</style>
		</div>
	);
}